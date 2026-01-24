# Production App - Multi-User Daily Journal

This is the production-ready multi-user version of the Daily Journal app, built with Supabase for authentication and database.

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.local.template` to `.env.local` and fill in your Supabase credentials
3. Run database migrations (see `/supabase/migrations/`)
4. Install dependencies: `npm install` (from root)
5. Run dev server: `npm run dev:production` (from root)

## Architecture

- **Auth**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Shared Code**: Uses `@daily-journal/core` for UI components and business logic

## Development

```bash
# From root directory
npm run dev:production

# Or from this directory
npm run dev
```

The app will run on http://localhost:3001 (port 3001 to avoid conflicts with private-app on 3000).
