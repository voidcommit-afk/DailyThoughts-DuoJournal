-- Migration: Add mood and weather columns to entries table
-- Created: 2026-01-24

ALTER TABLE public.entries
ADD COLUMN IF NOT EXISTS mood TEXT,
ADD COLUMN IF NOT EXISTS weather TEXT;
