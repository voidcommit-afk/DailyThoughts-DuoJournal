-- RLS Hardening Migration
-- Add explicit DENY policies for client-side user management
-- This migration strengthens security by making authorization rules explicit

-- Explicit deny policies for users table
-- These prevent clients from directly creating or deleting user records
-- User creation should only happen via the handle_new_user() trigger
CREATE POLICY "Deny client-side user creation"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Deny client-side user deletion"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (false);

-- Add policy comment for documentation
COMMENT ON POLICY "Deny client-side user creation" ON public.users IS 
  'Prevents clients from directly inserting users. User creation happens via handle_new_user() trigger on auth.users INSERT.';

COMMENT ON POLICY "Deny client-side user deletion" ON public.users IS 
  'Prevents clients from deleting user records. User deletion should cascade from auth.users.';
