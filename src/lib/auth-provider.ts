import { createSupabaseClient } from './supabase/client';
import { createSupabaseServerClient } from './supabase/server';
import type { AuthProvider, User, Credentials } from '@/core';
import type { Database } from './database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// This provider now needs to handle both server and client contexts
// But `AuthProvider` interface implies a single instance.
// For Next.js App Router, we should separate Server vs Client usage.
// However, to keep the contract, we will detect the environment.

export class SupabaseAuthProvider implements AuthProvider {

    // Helper to get the correct client based on context
    private async getClient() {
        if (typeof window === 'undefined') {
            // Server Context
            return await createSupabaseServerClient();
        } else {
            // Client Context
            return createSupabaseClient();
        }
    }

    async getUser(): Promise<User | null> {
        const supabase = await this.getClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // Fetch user profile from database
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single<Database['public']['Tables']['users']['Row']>();

        if (!profile) {
            return null;
        }

        return {
            id: user.id,
            email: user.email!,
            displayName: profile.display_name,
            emoji: profile.emoji,
            partnerId: profile.partner_id ?? undefined,
            partnerEmoji: profile.partner_emoji ?? undefined,
            theme: profile.theme,
            colorPreset: profile.color_preset,
            fontFamily: profile.font_family,
        };
    }

    // SignIn/SignUp/SignOut are typically called from Client Components (Event Handlers)
    // So using createSupabaseClient() is safe for these.

    async signIn(credentials: Credentials): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            throw new Error(error.message);
        }
    }

    async signOut(): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }
    }

    async signUp(credentials: Credentials): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            throw new Error(error.message);
        }
    }

    async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        const updateData = {
            display_name: updates.displayName,
            emoji: updates.emoji,
            partner_id: updates.partnerId ?? null,
            partner_emoji: updates.partnerEmoji ?? null,
            theme: updates.theme,
            color_preset: updates.colorPreset,
            font_family: updates.fontFamily,
        };

        // Use different code paths for server vs client to avoid TypeScript inference issues
        if (typeof window === 'undefined') {
            // Server context
            const supabase = await createSupabaseServerClient();
            const { data, error } = await (supabase
                .from('users') as any)
                .update({
                    ...(updates.displayName !== undefined && { display_name: updates.displayName }),
                    ...(updates.emoji !== undefined && { emoji: updates.emoji }),
                    ...(updates.partnerId !== undefined && { partner_id: updates.partnerId ?? null }),
                    ...(updates.partnerEmoji !== undefined && { partner_emoji: updates.partnerEmoji ?? null }),
                    ...(updates.theme !== undefined && { theme: updates.theme }),
                    ...(updates.colorPreset !== undefined && { color_preset: updates.colorPreset }),
                    ...(updates.fontFamily !== undefined && { font_family: updates.fontFamily }),
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            return {
                id: data.id,
                email: user.email!,
                displayName: data.display_name,
                emoji: data.emoji,
                partnerId: data.partner_id ?? undefined,
                partnerEmoji: data.partner_emoji ?? undefined,
                theme: data.theme,
                colorPreset: data.color_preset,
                fontFamily: data.font_family,
            };
        } else {
            // Client context
            const supabase = createSupabaseClient();
            const { data, error } = await (supabase
                .from('users') as any)
                .update({
                    ...(updates.displayName !== undefined && { display_name: updates.displayName }),
                    ...(updates.emoji !== undefined && { emoji: updates.emoji }),
                    ...(updates.partnerId !== undefined && { partner_id: updates.partnerId ?? null }),
                    ...(updates.partnerEmoji !== undefined && { partner_emoji: updates.partnerEmoji ?? null }),
                    ...(updates.theme !== undefined && { theme: updates.theme }),
                    ...(updates.colorPreset !== undefined && { color_preset: updates.colorPreset }),
                    ...(updates.fontFamily !== undefined && { font_family: updates.fontFamily }),
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            return {
                id: data.id,
                email: user.email!,
                displayName: data.display_name,
                emoji: data.emoji,
                partnerId: data.partner_id ?? undefined,
                partnerEmoji: data.partner_emoji ?? undefined,
                theme: data.theme,
                colorPreset: data.color_preset,
                fontFamily: data.font_family,
            };
        }
    }
}

// Export singleton instance
export const authProvider = new SupabaseAuthProvider();
