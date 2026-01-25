-- ==========================================
-- 1. VIP ACCESS WHITELIST (CONCIERGE LOCKDOWN)
-- ==========================================

-- Create the whitelist table
CREATE TABLE IF NOT EXISTS public.access_whitelist (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.access_whitelist ENABLE ROW LEVEL SECURITY;

-- Only service role / admins can see the whitelist (Default behavior)
-- We don't add any public/authenticated policies here.

-- Create the bouncer function
CREATE OR REPLACE FUNCTION public.check_whitelist()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the incoming user's email exists in the whitelist
    -- We use LOWER() to ensure case-insensitive matching
    IF NOT EXISTS (SELECT 1 FROM public.access_whitelist WHERE LOWER(email) = LOWER(NEW.email)) THEN
        RAISE EXCEPTION 'Access Denied: This is an invite-only service. Please contact support.';
    END IF;
    RETURN NEW;
END;
$$;

-- Attach the bouncer to the signup event
DROP TRIGGER IF EXISTS ensure_user_in_whitelist ON auth.users;
CREATE TRIGGER ensure_user_in_whitelist
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_whitelist();


-- ==========================================
-- 2. STORAGE HARDENING (MEDIA SECURITY)
-- ==========================================

-- Create the bucket if it doesn't exist (Journal Images)
-- Note: This requires the storage extension to be enabled
INSERT INTO storage.buckets (id, name, public)
SELECT 'journal-media', 'journal-media', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'journal-media'
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own media
DROP POLICY IF EXISTS "Users can upload their own journal media" ON storage.objects;
CREATE POLICY "Users can upload their own journal media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'journal-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own media
DROP POLICY IF EXISTS "Users can view their own journal media" ON storage.objects;
CREATE POLICY "Users can view their own journal media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'journal-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their partner's media
DROP POLICY IF EXISTS "Users can view their partner's journal media" ON storage.objects;
CREATE POLICY "Users can view their partner's journal media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'journal-media' AND
    (storage.foldername(name))[1] = public.get_auth_partner_id()::text
);

-- Policy: Users can delete their own media
DROP POLICY IF EXISTS "Users can delete their own journal media" ON storage.objects;
CREATE POLICY "Users can delete their own journal media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'journal-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
