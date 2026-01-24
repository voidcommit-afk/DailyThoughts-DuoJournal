# Supabase Database Setup

This directory contains database migrations for the production app.

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for initial setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/20260118000000_initial_schema.sql`
4. Paste and run in the SQL editor

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref wedzoyibwymcpdpvhcxj

# Run migrations
supabase db push
```

## Schema Overview

### Tables

1. **users** - User profiles (extends auth.users)
   - Stores display name, emoji, theme preferences
   - Supports partner linking for shared journals

2. **entries** - Journal entries
   - One entry per user per date
   - Supports images and audio notes (stored as JSON arrays)
   - Full-text search on content

3. **reactions** - Partner reactions to entries
   - Emoji reactions on partner's entries
   - One reaction per user per entry

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Users can only view/edit their own data
- Users can view their partner's entries (if partnered)
- Users can react to their partner's entries
- Complete isolation between unrelated users

### Indexes

Optimized indexes for:
- User entry lookups
- Date-based queries
- Partner entry access
