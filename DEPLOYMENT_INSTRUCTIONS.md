# 🚀 Deployment & Configuration Guide

Since this is a new standalone repository, you need to update your Supabase and Vercel configurations to ensure everything works correctly.

## 1. Supabase Configuration (Database)
You added new features (Mood, Weather) that require database columns.

1.  **Go to your Supabase Dashboard** -> **SQL Editor**.
2.  **Run this SQL** to add the missing columns to your live database:
    ```sql
    ALTER TABLE public.entries
    ADD COLUMN IF NOT EXISTS mood TEXT,
    ADD COLUMN IF NOT EXISTS weather TEXT;
    ```
    *(Note: `audio_notes` and `images` are already JSONB columns in your existing schema, so they should work fine.)*

3.  **Storage Bucket**:
    *   Go to **Storage** in Supabase.
    *   Create a new public bucket named `media` if it doesn't exist.
    *   Set the policy to allow authenticated uploads.

## 2. Vercel Configuration (Hosting)
You cannot use the old Vercel project because it points to the old monorepo. You should create a **new Project** in Vercel.

1.  **Create New Project**:
    *   Import the `DailyThoughts-DuoJournal` repository.
    *   **Framework Preset**: Next.js.
    *   **Root Directory**: `./` (It is now at the root).

2.  **Environment Variables**:
    Copy these from your old project or `.env.local`:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY` (if used in API routes)

## 3. UI/UX Verification
*   **Parity**: The code has been ported 1:1. The `VoiceRecorder`, `ImageCropper`, and `MoodSelector` components are now fully integrated into the dashboard.
*   **Improvements**:
    *   We added a **dedicated private notes** section.
    *   We improved the **Calendar** UI to show partner entries more clearly.
    *   We added **loading states** and **toasts** (via Sonner/Toast) for better feedback.

## 4. Final Sanity Check
Before promoting to production:
1.  **Log in** with a real account.
2.  **Create an entry** with a mood and weather emoji.
3.  **Record a voice note** (tests the new `/api/upload` route).
4.  **Upload a photo** (tests Image Cropper + Storage).
