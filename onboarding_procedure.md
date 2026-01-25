# Concierge Onboarding Procedure

This document outlines the step-by-step process for onboarding a new couple (Client) into the DailyThoughts platform. This app operates as a managed concierge service; users do not create their own connections or invite each other.

---

## Prerequisites
1. Access to the **Supabase Dashboard** for the project.
2. The **email addresses** for both users in the couple.

---

## Step 1: Create Authentication Accounts (Supabase)
Since public signups are disabled, you must manually create accounts for your clients.

1. Navigate to the **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create new user**.
3. Enter the email and a temporary password for **User A**.
4. Repeat for **User B**.
5. *Note: Ensure "Auto-confirm User" is checked if you don't want them to have to verify their email immediately.*

---

## Step 2: Establish the Intimacy Link (Database Layer)
To link the couple together so they can see each other's entries, you must manually connect their database profiles in the `users` table.

1. In Supabase, go to the **Table Editor** and select the `users` table.
2. **Retrieve UUIDs**:
   - Copy the `id` (UUID) for **User A**.
   - Copy the `id` (UUID) for **User B**.
3. **Configure User A**:
   - Find User A's row.
   - Set `partner_id` to User B's UUID.
   - Set `is_approved` to `true` (Plan B Security).
4. **Configure User B**:
   - Find User B's row.
   - Set `partner_id` to User A's UUID.
   - Set `is_approved` to `true` (Plan B Security).

---

## Step 3: Security - approval Layer (Plan B)
The app includes a check for the `is_approved` column. If a user tries to log in but `is_approved` is `false` (or missing), they will be treated as unauthorized.

**First-time Setup:**
If you haven't already, add the column to your `users` table:
- **Name**: `is_approved`
- **Type**: `bool`
- **Default Value**: `false`

---

## Step 4: Verification
1. Log in as **User A** in an incognito window.
2. Verify the Sidebar says **"Coupled"**.
3. Go to the **Partner Space**; it should show "Partner's Timeline".
4. Repeat for **User B**.

---

## Step 5: Handover
Send the credentials (Email + Temporary Password) to the clients with a link to the login page.
