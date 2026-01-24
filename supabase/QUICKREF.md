# Task 0: Backend & Infrastructure - Quick Reference

## 📋 What Was Implemented

### Schema Changes
- ❌ Removed `cover_photo` from users table
- ❌ Removed redundant `email` from users table (use auth.users.email)
- ✅ Added NOT NULL constraints: `display_name`, `emoji`, `theme`, `color_preset`, `font_family`
- ✅ All defaults properly set in schema

### Security Enhancements
- ✅ Explicit DENY policies for users INSERT/DELETE
- ✅ RLS enabled on all tables
- ✅ Partner read-only access enforced
- ✅ Idempotent trigger with ON CONFLICT

### Code Updates
- ✅ TypeScript User interface aligned with DB (required fields marked)
- ✅ Auth provider fetches email from auth.users
- ✅ Entry repository robust array handling

---

## 📁 Files Changed/Created

### Modified
- `packages/production-app/supabase/migrations/20260118000000_initial_schema.sql`
- `packages/core/src/abstractions/auth.ts`
- `packages/production-app/src/lib/auth-provider.ts`

### Created
- `packages/production-app/supabase/migrations/20260119000000_harden_rls.sql`
- `packages/production-app/supabase/SCHEMA.md`
- `packages/production-app/supabase/DEPLOYMENT.md`
- `packages/production-app/supabase/verify-schema.sql`
- `packages/production-app/supabase/test-rls-policies.sql`

---

## 🚀 Deployment Commands

```bash
# 1. Navigate to production-app
cd packages/production-app

# 2. Link Supabase project (first time only)
npx supabase link --project-ref YOUR_PROJECT_REF

# 3. Push migrations
npx supabase db push

# 4. Verify (in Supabase SQL Editor)
# Run queries from verify-schema.sql

# 5. Test RLS (in Supabase SQL Editor)
# Follow scenarios in test-rls-policies.sql
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `users` table has 10 columns (no email, no cover_photo)
- [ ] All NOT NULL constraints enforced
- [ ] 5 RLS policies on users table
- [ ] 5 RLS policies on entries table
- [ ] Trigger `on_auth_user_created` exists
- [ ] Test signup creates user profile automatically
- [ ] Partner access works (read-only)
- [ ] DENY policies block unauthorized INSERT/DELETE

---

## 📖 Documentation

- **Schema Reference**: `packages/production-app/supabase/SCHEMA.md`
- **Deployment Guide**: `packages/production-app/supabase/DEPLOYMENT.md`
- **Walkthrough**: See artifacts in `.gemini/antigravity/brain/[conversation-id]/`

---

## 🐛 Common Issues

**Issue**: Email not found after schema update  
**Fix**: Email is now from `auth.users.email`, not `public.users.email`

**Issue**: TypeScript errors about optional fields  
**Fix**: Remove optional chaining - fields are now required (e.g., `user.emoji` not `user.emoji ?? '😊'`)

**Issue**: Trigger not creating user profiles  
**Fix**: Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created'`

---

## ⏭️ Next Tasks

Once deployed and verified:

1. Mark remaining items in `to-do.md` Task 0 as complete
2. Begin Task 1: Application Branding & MVP Split
3. Monitor Supabase logs for any RLS violations
4. Consider Edge Functions for advanced operations
