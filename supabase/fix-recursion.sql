-- Create helper function to safely get partner_id without recursion
CREATE OR REPLACE FUNCTION public.get_auth_partner_id()
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  partner_id_val UUID;
BEGIN
  -- This runs with SECURITY DEFINER, bypassing RLS to safely read the user's own row
  SELECT partner_id INTO partner_id_val
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN partner_id_val;
END;
$$;

-- Fix USERS policy
DROP POLICY IF EXISTS "Users can view their partner's profile" ON public.users;
CREATE POLICY "Users can view their partner's profile"
  ON public.users
  FOR SELECT
  USING (
    -- Securely check if the target row's ID matches the current user's partner ID
    id = public.get_auth_partner_id()
  );

-- Fix ENTRIES policy
DROP POLICY IF EXISTS "Users can view their partner's entries" ON public.entries;
CREATE POLICY "Users can view their partner's entries"
  ON public.entries
  FOR SELECT
  USING (
    -- Securely check if the entry's user_id matches the current user's partner ID
    user_id = public.get_auth_partner_id()
  );

-- Fix REACTIONS policies
DROP POLICY IF EXISTS "Users can view reactions on their partner's entries" ON public.reactions;
CREATE POLICY "Users can view reactions on their partner's entries"
  ON public.reactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.entries e
      WHERE e.id = public.reactions.entry_id 
      AND e.user_id = public.get_auth_partner_id()
    )
  );

DROP POLICY IF EXISTS "Users can insert reactions on their partner's entries" ON public.reactions;
CREATE POLICY "Users can insert reactions on their partner's entries"
  ON public.reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.entries e
      WHERE e.id = entry_id 
      AND e.user_id = public.get_auth_partner_id()
    )
  );

SELECT 'Fixed RLS Recursion' as status;
