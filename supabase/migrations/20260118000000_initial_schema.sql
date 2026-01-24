-- Initial schema for Daily Journal production app
-- Run this migration in your Supabase SQL editor

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS public.reactions CASCADE;
DROP TABLE IF EXISTS public.entries CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '😊',
  partner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  partner_emoji TEXT,
  theme TEXT NOT NULL DEFAULT 'midnight',
  color_preset TEXT NOT NULL DEFAULT 'default',
  font_family TEXT NOT NULL DEFAULT 'roboto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entries table
CREATE TABLE public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  audio_notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one entry per user per date
  UNIQUE(user_id, date)
);

-- Reactions table (for partner reactions)
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one reaction per user per entry
  UNIQUE(entry_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_entries_user_id ON public.entries(user_id);
CREATE INDEX idx_entries_date ON public.entries(date);
CREATE INDEX idx_entries_user_date ON public.entries(user_id, date DESC);
CREATE INDEX idx_reactions_entry_id ON public.reactions(entry_id);

-- Updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert with idempotency check to handle potential retries
  INSERT INTO public.users (id, display_name, emoji, theme, color_preset, font_family)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    '😊',
    'midnight',
    'default',
    'roboto'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view their partner's profile"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND partner_id = public.users.id
    )
  );

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for entries table
CREATE POLICY "Users can view their own entries"
  ON public.entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their partner's entries"
  ON public.entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND partner_id = public.entries.user_id
    )
  );

CREATE POLICY "Users can insert their own entries"
  ON public.entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON public.entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON public.entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reactions table
CREATE POLICY "Users can view reactions on their entries"
  ON public.reactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.entries
      WHERE id = public.reactions.entry_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view reactions on their partner's entries"
  ON public.reactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.entries e
      JOIN public.users u ON u.id = auth.uid()
      WHERE e.id = public.reactions.entry_id AND e.user_id = u.partner_id
    )
  );

CREATE POLICY "Users can insert reactions on their partner's entries"
  ON public.reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.entries e
      JOIN public.users u ON u.id = auth.uid()
      WHERE e.id = entry_id AND e.user_id = u.partner_id
    )
  );

CREATE POLICY "Users can delete their own reactions"
  ON public.reactions
  FOR DELETE
  USING (auth.uid() = user_id);
