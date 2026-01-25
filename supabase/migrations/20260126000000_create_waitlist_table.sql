-- Create waitlist_requests table
CREATE TABLE IF NOT EXISTS public.waitlist_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.waitlist_requests ENABLE ROW LEVEL SECURITY;

-- Note: No public select/update/delete.
-- Only allowing anonymous service role to insert (since it's a public request form)
CREATE POLICY "Anyone can submit a waitlist request" ON public.waitlist_requests
FOR INSERT WITH CHECK (true);

-- Only admins/service role can view requests
-- (Default behavior when no SELECT policy is defined)
