-- Schema Verification Script
-- Run this in your Supabase SQL Editor to verify schema matches TypeScript contracts

-- ============================================================================
-- USERS TABLE VERIFICATION
-- ============================================================================

-- Check users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Expected output:
-- id              | uuid        | NO  | (FK to auth.users)
-- display_name    | text        | NO  | ''::text
-- emoji           | text        | NO  | '😊'::text
-- partner_id      | uuid        | YES | NULL
-- partner_emoji   | text        | YES | NULL
-- theme           | text        | NO  | 'midnight'::text
-- color_preset    | text        | NO  | 'default'::text
-- font_family     | text        | NO  | 'roboto'::text
-- created_at      | timestamptz | YES | now()
-- updated_at      | timestamptz | YES | now()

-- ============================================================================
-- ENTRIES TABLE VERIFICATION
-- ============================================================================

-- Check entries table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'entries'
ORDER BY ordinal_position;

-- Expected output:
-- id            | uuid        | NO  | uuid_generate_v4()
-- user_id       | uuid        | NO  | (FK to users)
-- date          | date        | NO  | NULL
-- content       | text        | NO  | ''::text
-- images        | jsonb       | YES | '[]'::jsonb
-- audio_notes   | jsonb       | YES | '[]'::jsonb
-- created_at    | timestamptz | YES | now()
-- updated_at    | timestamptz | YES | now()

-- ============================================================================
-- CONSTRAINTS VERIFICATION
-- ============================================================================

-- Check unique constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'UNIQUE'
  AND tc.table_name IN ('users', 'entries')
GROUP BY tc.constraint_name, tc.table_name;

-- Expected output:
-- entries_user_id_date_key | entries | user_id, date

-- ============================================================================
-- RLS POLICY VERIFICATION
-- ============================================================================

-- List all RLS policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- Expected policies:
-- 1. "Users can view their own profile" (SELECT)
-- 2. "Users can view their partner's profile" (SELECT)
-- 3. "Users can update their own profile" (UPDATE)
-- 4. "Deny client-side user creation" (INSERT)
-- 5. "Deny client-side user deletion" (DELETE)

-- List all RLS policies on entries table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'entries'
ORDER BY policyname;

-- Expected policies:
-- 1. "Users can view their own entries" (SELECT)
-- 2. "Users can view their partner's entries" (SELECT)
-- 3. "Users can insert their own entries" (INSERT)
-- 4. "Users can update their own entries" (UPDATE)
-- 5. "Users can delete their own entries" (DELETE)

-- ============================================================================
-- TRIGGERS VERIFICATION
-- ============================================================================

-- Check trigger exists on auth.users
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'auth' 
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';

-- Expected output:
-- on_auth_user_created | INSERT | users | EXECUTE FUNCTION public.handle_new_user() | AFTER

-- ============================================================================
-- FUNCTION VERIFICATION
-- ============================================================================

-- Check handle_new_user function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- Expected output:
-- handle_new_user | FUNCTION | trigger

-- ============================================================================
-- SECURITY TEST (RLS)
-- ============================================================================

-- Test 1: Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'entries', 'reactions');

-- All should return: rowsecurity = true

-- ============================================================================
-- VALIDATION COMPLETE
-- ============================================================================

SELECT 'Schema verification complete. Review results above.' as status;
