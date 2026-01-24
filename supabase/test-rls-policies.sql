-- RLS Policy Testing Script for Supabase SQL Editor
-- This script uses a DO block to define variables, making it easier to run without manual replacement in every line.
--
-- INSTRUCTIONS:
-- 1. Create 3 users in Authentication -> Users 
-- 2. Copy their UUIDs and paste them into the variables below (user_id_a, user_id_b, user_id_c).
-- 3. Run the entire script.

DO $$
DECLARE
  -- PASTE YOUR USER UUIDS HERE
  user_id_a UUID := '0d3cda84-1723-47de-b12c-6bd8c3c9e509'; -- Replace with User A UUID
  user_id_b UUID := '3bf3f5d9-7a52-4db0-8b9e-61a515b0b554'; -- Replace with User B UUID
  user_id_c UUID := '29f673ce-8c1d-4955-b73f-b19347ce8172'; -- Replace with User C UUID
  
  -- Internal variables
  entry_id UUID;
  reaction_id UUID;
BEGIN
  -- ============================================================================
  -- CLEANUP: Remove previous test data
  -- ============================================================================
  -- Ensure we are in a clean state (running as superuser initially)
  DELETE FROM public.entries WHERE user_id IN (user_id_a, user_id_b, user_id_c) AND date = CURRENT_DATE;

  -- ============================================================================
  -- TEST 1: Partner Linking
  -- ============================================================================
  RAISE NOTICE 'TEST 1: Linking Partners...';
  
  -- Simulate User A linking to User B
  -- We use SET LOCAL request.jwt.claims to simulate auth context for RLS if feasible,
  -- but since we are running as postgres/superuser in SQL Editor, we can bypass RLS or 
  -- simply test logic by direct manipulation if we assume the purpose is to test data integrity.
  -- HOWEVER, meaningful RLS testing requires switching roles.
  
  -- IMPORTANT: In Supabase SQL Editor, you are usually 'postgres' (superuser).
  -- RLS is bypassed by default for superusers.
  -- To properly test RLS, we must switch to 'authenticated' role and set the request.jwt.claim.sub.
  
  ------------------------------------------------------------------------------------------------
  -- SCENARIO: User A links to User B
  ------------------------------------------------------------------------------------------------
  -- Mock User A context
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_a, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;

  -- Setup (ensure users exist in public.users - normally handled by trigger)
  -- Since we might have created them manually in Auth, trigger should have run.
  -- If not, we insert them manually here just in case (bypassing RLS for setup).
  RESET ROLE;
  INSERT INTO public.users (id, display_name) VALUES (user_id_a, 'User A'), (user_id_b, 'User B'), (user_id_c, 'User C') ON CONFLICT (id) DO NOTHING;
  
  -- Switch back to User A
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_a, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;
  
  UPDATE public.users SET partner_id = user_id_b, partner_emoji = '💕' WHERE id = user_id_a;
  
  -- Verify read access to partner
  PERFORM * FROM public.users WHERE id = user_id_b;
  IF NOT FOUND THEN
     RAISE WARNING 'User A COULD NOT read User B (Partner) profile! [FAIL]';
  ELSE
     RAISE NOTICE 'User A could read User B profile. [PASS]';
  END IF;

  ------------------------------------------------------------------------------------------------
  -- SCENARIO: User B links to User A
  ------------------------------------------------------------------------------------------------
  -- Mock User B context
  RESET ROLE; -- Reset to superuser to switch config
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_b, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;

  UPDATE public.users SET partner_id = user_id_a, partner_emoji = '❤️' WHERE id = user_id_b;
  RAISE NOTICE 'Partners linked.';

  -- ============================================================================
  -- TEST 2: Entry Creation & Access
  -- ============================================================================
  RAISE NOTICE 'TEST 2: Entry Creation...';
  
  -- User B creates an entry
  INSERT INTO public.entries (user_id, date, content) VALUES (user_id_b, CURRENT_DATE, 'User B secret') RETURNING id INTO entry_id;
  RAISE NOTICE 'User B created entry: %', entry_id;
  
  -- Switch to User A (Partner)
  RESET ROLE;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_a, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;
  
  -- Try to read User B's entry
  PERFORM * FROM public.entries WHERE id = entry_id;
  IF FOUND THEN
     RAISE NOTICE 'User A can see Partner B entry. [PASS]';
  ELSE
     RAISE WARNING 'User A CANNOT see Partner B entry. [FAIL]';
  END IF;
  
  -- Switch to User C (Stranger)
  RESET ROLE;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_c, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;
  
  -- Try to read User B's entry
  PERFORM * FROM public.entries WHERE id = entry_id;
  IF FOUND THEN
     RAISE WARNING 'User C (Stranger) SAW User B entry! [FAIL - SECURITY RISK]';
  ELSE
     RAISE NOTICE 'User C properly blocked from User B entry. [PASS]';
  END IF;

  -- ============================================================================
  -- TEST 3: Permissions (INSERT/UPDATE/DELETE)
  -- ============================================================================
  RAISE NOTICE 'TEST 3: Permissions Hardening...';
  
  -- Switch to User A
  RESET ROLE;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id_a, 'role', 'authenticated')::text, true);
  SET ROLE authenticated;

  -- 3.1 Try to INSERT new User (Should FAIL)
  BEGIN
    INSERT INTO public.users (id) VALUES (gen_random_uuid());
    RAISE WARNING 'Client-side User INSERT succeeded but should have FAILED! [FAIL]';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Client-side User INSERT blocked as expected. [PASS]';
  END;

  -- 3.2 Try to DELETE self (Should FAIL)
  BEGIN
    DELETE FROM public.users WHERE id = user_id_a;
    RAISE WARNING 'Client-side User DELETE succeeded but should have FAILED! [FAIL]';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Client-side User DELETE blocked as expected. [PASS]';
  END;
  
  RAISE NOTICE 'All tests completed.';
END $$;
