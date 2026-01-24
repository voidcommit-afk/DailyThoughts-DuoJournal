# Supabase Migration Deployment Guide

## Overview

This guide walks through deploying the updated schema and security policies to your Supabase instance.

## Prerequisites

- Supabase project created
- Supabase CLI installed: `npm install -g supabase`
- Environment variables configured in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## Deployment Steps

### Option 1: Fresh Database (Recommended for Development)

If you're setting up a new Supabase project or can reset your database:

1. **Navigate to project directory:**
   ```bash
   cd packages/production-app
   ```

2. **Link to your Supabase project:**
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Apply migrations:**
   ```bash
   npx supabase db push
   ```
   
   This will apply both migrations in order:
   - `20260118000000_initial_schema.sql`
   - `20260119000000_harden_rls.sql`

4. **Verify deployment:**
   - Open Supabase SQL Editor
   - Run queries from `verify-schema.sql`
   - Confirm all tables, policies, and triggers are present

---

### Option 2: Existing Database Migration

If you already have data and need to migrate the schema:

> [!WARNING]
> This will modify existing tables. **Backup your database first!**

1. **Backup existing data:**
   ```bash
   npx supabase db dump -f backup.sql
   ```

2. **Manually run migration in Supabase SQL Editor:**
   
   **Step 1: Remove deprecated columns**
   ```sql
   -- Remove cover_photo column
   ALTER TABLE public.users DROP COLUMN IF EXISTS cover_photo;
   
   -- Remove email column (redundant with auth.users.email)
   ALTER TABLE public.users DROP COLUMN IF EXISTS email;
   ```

   **Step 2: Add NOT NULL constraints**
   ```sql
   -- Set defaults for existing rows first
   UPDATE public.users SET display_name = '' WHERE display_name IS NULL;
   UPDATE public.users SET emoji = '😊' WHERE emoji IS NULL;
   UPDATE public.users SET theme = 'midnight' WHERE theme IS NULL;
   UPDATE public.users SET color_preset = 'default' WHERE color_preset IS NULL;
   UPDATE public.users SET font_family = 'roboto' WHERE font_family IS NULL;
   
   -- Now add NOT NULL constraints
   ALTER TABLE public.users ALTER COLUMN display_name SET NOT NULL;
   ALTER TABLE public.users ALTER COLUMN display_name SET DEFAULT '';
   ALTER TABLE public.users ALTER COLUMN emoji SET NOT NULL;
   ALTER TABLE public.users ALTER COLUMN emoji SET DEFAULT '😊';
   ALTER TABLE public.users ALTER COLUMN theme SET NOT NULL;
   ALTER TABLE public.users ALTER COLUMN theme SET DEFAULT 'midnight';
   ALTER TABLE public.users ALTER COLUMN color_preset SET NOT NULL;
   ALTER TABLE public.users ALTER COLUMN color_preset SET DEFAULT 'default';
   ALTER TABLE public.users ALTER COLUMN font_family SET NOT NULL;
   ALTER TABLE public.users ALTER COLUMN font_family SET DEFAULT 'roboto';
   ```

   **Step 3: Update trigger function**
   ```sql
   -- Replace the handle_new_user function
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER
   SECURITY DEFINER
   SET search_path = public
   LANGUAGE plpgsql
   AS $$
   BEGIN
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
   ```

   **Step 4: Add RLS hardening policies**
   ```sql
   -- Run the entire 20260119000000_harden_rls.sql file
   -- Or copy-paste from that file
   ```

3. **Verify migration:**
   - Run `verify-schema.sql` to confirm structure
   - Test with a new auth signup to verify trigger works

---

## Post-Deployment Verification

### 1. Schema Validation

Run queries from `verify-schema.sql` in Supabase SQL Editor:

```bash
# Copy contents of verify-schema.sql and run in SQL Editor
```

**Expected checks:**
- ✅ `users` table has 10 columns (no email, no cover_photo)
- ✅ `display_name`, `emoji`, `theme`, `color_preset`, `font_family` are NOT NULL
- ✅ `entries` table has UNIQUE constraint on (user_id, date)
- ✅ 5 RLS policies on `users` table
- ✅ 5 RLS policies on `entries` table
- ✅ Trigger `on_auth_user_created` exists

### 2. RLS Policy Testing

Follow the test scenarios in `test-rls-policies.sql`:

1. Create 3 test users (A, B, C) via Supabase Dashboard
2. Link A ↔ B as partners
3. Run SELECT/INSERT/UPDATE/DELETE tests as each user
4. Verify partner access works correctly
5. Verify DENY policies block unauthorized actions

### 3. Application Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test signup flow:**
   - Sign up a new user
   - Verify profile auto-created in database
   - Check all default values are set

3. **Test profile updates:**
   - Update display name, emoji, theme
   - Verify changes persist
   - Check email is still accessible (from auth.users)

4. **Test journal entries:**
   - Create an entry
   - Verify UNIQUE constraint works (can't create duplicate for same date)
   - Test image/audio array handling

---

## Rollback Plan

If something goes wrong:

### Quick Rollback (Fresh Database)

```bash
# Reset database to previous state
npx supabase db reset
```

### Manual Rollback (Production with Data)

1. **Restore from backup:**
   ```bash
   psql -h your-db-host -U postgres -d postgres < backup.sql
   ```

2. **Or manually revert changes:**
   ```sql
   -- Add back email column
   ALTER TABLE public.users ADD COLUMN email TEXT;
   UPDATE public.users u SET email = a.email FROM auth.users a WHERE u.id = a.id;
   
   -- Add back cover_photo
   ALTER TABLE public.users ADD COLUMN cover_photo TEXT;
   
   -- Remove NOT NULL constraints if needed
   ALTER TABLE public.users ALTER COLUMN display_name DROP NOT NULL;
   -- etc.
   ```

---

## Common Issues

### Issue: Trigger not firing

**Symptom:** New auth users don't get profile in `public.users`

**Fix:**
1. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Manually create profile for existing users:
   ```sql
   INSERT INTO public.users (id, display_name, emoji, theme, color_preset, font_family)
   SELECT id, split_part(email, '@', 1), '😊', 'midnight', 'default', 'roboto'
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public.users)
   ON CONFLICT (id) DO NOTHING;
   ```

### Issue: RLS policies blocking valid operations

**Symptom:** Getting "policy violation" errors in application

**Fix:**
1. Check which policy is blocking: Look at error message
2. Verify auth.uid() is set (user is authenticated)
3. Test policy manually in SQL Editor while authenticated
4. Review policy logic in `SCHEMA.md`

### Issue: TypeScript errors after User interface change

**Symptom:** Type errors about optional properties

**Fix:**
- Update code that uses `User` interface
- Remove optional chaining where fields are now required:
  ```typescript
  // Before: user.emoji ?? '😊'
  // After: user.emoji (always defined)
  ```

---

## Production Checklist

Before deploying to production:

- [ ] Backup existing database
- [ ] Test all migrations on staging environment first
- [ ] Run `verify-schema.sql` and confirm all checks pass
- [ ] Run `test-rls-policies.sql` test scenarios
- [ ] Test signup flow creates user profile automatically
- [ ] Test partner linking and access permissions
- [ ] Verify email is accessible from auth.users
- [ ] Monitor Supabase logs for any policy violations
- [ ] Update environment variables if needed
- [ ] Document any custom changes made during deployment

---

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard → Logs
2. Review `SCHEMA.md` for expected structure
3. Run verification queries from `verify-schema.sql`
4. Test RLS with scenarios from `test-rls-policies.sql`
