-- Add personalization columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#818cf8',
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#6366f1',
ADD COLUMN IF NOT EXISTS background_color text DEFAULT '#0B0E17',
ADD COLUMN IF NOT EXISTS font_size text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS background_type text DEFAULT 'gradient',
ADD COLUMN IF NOT EXISTS background_value text DEFAULT 'midnight',
ADD COLUMN IF NOT EXISTS background_blur integer DEFAULT 0;

-- Comment on columns
COMMENT ON COLUMN public.users.primary_color IS 'User preferred primary color';
COMMENT ON COLUMN public.users.accent_color IS 'User preferred accent color';
COMMENT ON COLUMN public.users.background_color IS 'User preferred background color';
