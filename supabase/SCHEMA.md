# Database Schema Documentation

## Overview

This document defines the exact database schema for the Daily Journal production app, including all tables, constraints, RLS policies, and triggers.

---

## Tables

### `public.users`

Extends Supabase `auth.users` with application-specific profile data.

#### Columns

| Column Name    | Type        | Nullable | Default      | Notes                           |
|----------------|-------------|----------|--------------|----------------------------------|
| `id`           | UUID        | NO       | -            | PK, FK → `auth.users.id`        |
| `display_name` | TEXT        | NO       | `''`         | User's display name              |
| `emoji`        | TEXT        | NO       | `'😊'`       | Profile emoji (Unicode)          |
| `partner_id`   | UUID        | YES      | NULL         | FK → `public.users.id`          |
| `partner_emoji`| TEXT        | YES      | NULL         | Partner's emoji                  |
| `theme`        | TEXT        | NO       | `'midnight'` | UI theme preference              |
| `color_preset` | TEXT        | NO       | `'default'`  | Color preset preference          |
| `font_family`  | TEXT        | NO       | `'roboto'`   | Font family preference           |
| `created_at`   | TIMESTAMPTZ | YES      | `NOW()`      | Record creation timestamp        |
| `updated_at`   | TIMESTAMPTZ | YES      | `NOW()`      | Record update timestamp          |

#### Constraints

- **Primary Key**: `id`
- **Foreign Keys**:
  - `id` → `auth.users(id)` ON DELETE CASCADE
  - `partner_id` → `public.users(id)` ON DELETE SET NULL

#### Indexes

- Automatic index on `id` (primary key)

---

### `public.entries`

Stores journal entries for users.

#### Columns

| Column Name   | Type        | Nullable | Default              | Notes                       |
|---------------|-------------|----------|----------------------|-----------------------------|
| `id`          | UUID        | NO       | `uuid_generate_v4()` | Primary key                 |
| `user_id`     | UUID        | NO       | -                    | FK → `public.users.id`     |
| `date`        | DATE        | NO       | -                    | Entry date                  |
| `content`     | TEXT        | NO       | `''`                 | Entry content               |
| `images`      | JSONB       | YES      | `'[]'::jsonb`        | Array of image URLs         |
| `audio_notes` | JSONB       | YES      | `'[]'::jsonb`        | Array of audio note URLs    |
| `created_at`  | TIMESTAMPTZ | YES      | `NOW()`              | Record creation timestamp   |
| `updated_at`  | TIMESTAMPTZ | YES      | `NOW()`              | Record update timestamp     |

#### Constraints

- **Primary Key**: `id`
- **Foreign Keys**:
  - `user_id` → `public.users(id)` ON DELETE CASCADE
- **Unique Constraints**:
  - `UNIQUE(user_id, date)` - One entry per user per day

#### Indexes

- `idx_entries_user_id` ON `user_id`
- `idx_entries_date` ON `date`
- `idx_entries_user_date` ON `(user_id, date DESC)`

---

### `public.reactions`

Stores partner reactions to journal entries.

#### Columns

| Column Name | Type        | Nullable | Default              | Notes                    |
|-------------|-------------|----------|----------------------|--------------------------|
| `id`        | UUID        | NO       | `uuid_generate_v4()` | Primary key              |
| `entry_id`  | UUID        | NO       | -                    | FK → `public.entries.id`|
| `user_id`   | UUID        | NO       | -                    | FK → `public.users.id`  |
| `emoji`     | TEXT        | NO       | -                    | Reaction emoji           |
| `created_at`| TIMESTAMPTZ | YES      | `NOW()`              | Record creation timestamp|

#### Constraints

- **Primary Key**: `id`
- **Foreign Keys**:
  - `entry_id` → `public.entries(id)` ON DELETE CASCADE
  - `user_id` → `public.users(id)` ON DELETE CASCADE
- **Unique Constraints**:
  - `UNIQUE(entry_id, user_id)` - One reaction per user per entry

#### Indexes

- `idx_reactions_entry_id` ON `entry_id`

---

## Row Level Security (RLS) Policies

### `public.users`

| Policy Name                          | Command | Description                                    |
|--------------------------------------|---------|------------------------------------------------|
| Users can view their own profile     | SELECT  | Allow users to view their own profile         |
| Users can view their partner's profile| SELECT | Allow users to view their partner's profile   |
| Users can update their own profile   | UPDATE  | Allow users to update only their own profile  |
| **Deny client-side user creation**   | INSERT  | **Prevent client from creating user records** |
| **Deny client-side user deletion**   | DELETE  | **Prevent client from deleting user records** |

**Security Model:**
- Users are created ONLY via the `handle_new_user()` trigger when auth.users INSERT occurs
- Users cannot create or delete user records directly
- Users can only update their own profile
- Partner visibility is bidirectional (if A is partner of B, B can see A)

---

### `public.entries`

| Policy Name                            | Command | Description                                  |
|----------------------------------------|---------|----------------------------------------------|
| Users can view their own entries       | SELECT  | Allow viewing own entries                    |
| Users can view their partner's entries | SELECT  | Allow viewing partner's entries              |
| Users can insert their own entries     | INSERT  | Allow creating entries for self only         |
| Users can update their own entries     | UPDATE  | Allow updating own entries only              |
| Users can delete their own entries     | DELETE  | Allow deleting own entries only              |

**Security Model:**
- Users can only INSERT/UPDATE/DELETE their own entries (`auth.uid() = user_id`)
- Users can SELECT both their own entries AND their partner's entries
- Partner access is read-only

---

### `public.reactions`

| Policy Name                                      | Command | Description                              |
|--------------------------------------------------|---------|------------------------------------------|
| Users can view reactions on their entries        | SELECT  | View reactions on own entries            |
| Users can view reactions on partner's entries    | SELECT  | View reactions on partner's entries      |
| Users can insert reactions on partner's entries  | INSERT  | React to partner's entries only          |
| Users can delete their own reactions             | DELETE  | Remove own reactions                     |

**Security Model:**
- Users can only react to their partner's entries, not their own
- Users can view all reactions on entries they can access
- Users can delete their own reactions

---

## Triggers

### `on_auth_user_created`

**Event**: `AFTER INSERT ON auth.users`  
**Function**: `public.handle_new_user()`  
**Purpose**: Automatically create a user profile in `public.users` when an auth user is created

**Behavior:**
- Inserts row into `public.users` with `id` from `auth.users`
- Sets `display_name` from metadata or derives from email
- Applies default values for emoji, theme, color_preset, font_family
- Idempotent: Uses `ON CONFLICT (id) DO NOTHING` to handle retries

---

### `update_users_updated_at`

**Event**: `BEFORE UPDATE ON public.users`  
**Function**: `update_updated_at_column()`  
**Purpose**: Automatically update `updated_at` timestamp on row modification

---

### `update_entries_updated_at`

**Event**: `BEFORE UPDATE ON public.entries`  
**Function**: `update_updated_at_column()`  
**Purpose**: Automatically update `updated_at` timestamp on row modification

---

## TypeScript Contract Mapping

### User Interface → public.users

```typescript
interface User {
    id: string;              // users.id (UUID)
    email: string;           // auth.users.email (NOT from public.users)
    displayName: string;     // users.display_name (NOT NULL)
    emoji: string;           // users.emoji (NOT NULL)
    partnerId?: string | null; // users.partner_id (nullable)
    partnerEmoji?: string;   // users.partner_emoji (nullable)
    theme: string;           // users.theme (NOT NULL)
    colorPreset: string;     // users.color_preset (NOT NULL)
    fontFamily: string;      // users.font_family (NOT NULL)
}
```

**Key Points:**
- `email` is fetched from `auth.users`, NOT stored in `public.users`
- All theme/personalization fields are required (NOT NULL)
- Only `partnerId` and `partnerEmoji` are optional

---

### Entry Interface → public.entries

```typescript
interface Entry {
    id: string;           // entries.id (UUID)
    userId: string;       // entries.user_id (UUID)
    content: string;      // entries.content (TEXT)
    date: string;         // entries.date (DATE)
    images: string[];     // entries.images (JSONB array)
    audioNotes: string[]; // entries.audio_notes (JSONB array)
    createdAt: string;    // entries.created_at (TIMESTAMPTZ)
    updatedAt: string;    // entries.updated_at (TIMESTAMPTZ)
}
```

**Key Points:**
- `images` and `audio_notes` are always arrays (never null)
- Database stores them as JSONB with default `'[]'::jsonb`
- Repository layer ensures array casting: `Array.isArray(data.images) ? data.images : []`

---

## Migration Files

1. **`20260118000000_initial_schema.sql`** - Core schema setup
   - Creates tables, indexes, constraints
   - Sets up RLS policies for basic access control
   - Creates triggers for user provisioning and timestamp updates

2. **`20260119000000_harden_rls.sql`** - Security hardening
   - Adds explicit DENY policies for user INSERT/DELETE
   - Prevents client-side user record manipulation
   - Enforces trigger-based user creation only

---

## Security Best Practices

### What's Enforced

✅ RLS enabled on all user-facing tables  
✅ Explicit DENY policies for dangerous operations  
✅ Trigger-based user provisioning (no client INSERT)  
✅ Partner access is read-only (no cross-user modifications)  
✅ All policies use server-side checks (`auth.uid()`)  
✅ Idempotent trigger functions  

