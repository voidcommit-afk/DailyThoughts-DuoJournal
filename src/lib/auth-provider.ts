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

        // Plan B: Concierge Approval Check
        // If the user is authenticated but not yet approved by the concierge, we return null to treat them as logged out/unauthorized
        // Note: You must add the 'is_approved' boolean column to your 'users' table in Supabase (default: true or false based on your preference)
        if ((profile as any).is_approved === false) {
            return null;
        }

        // Fetch partner's emoji if partner_id exists
        let partnerEmoji = profile.partner_emoji;
        if (profile.partner_id) {
            const { data: partner } = await supabase
                .from('users')
                .select('emoji')
                .eq('id', profile.partner_id)
                .single<{ emoji: string }>();

            if (partner) {
                partnerEmoji = partner.emoji;
            }
        }

        return {
            id: user.id,
            email: user.email!,
            displayName: profile.display_name,
            emoji: profile.emoji,
            partnerId: profile.partner_id ?? undefined,
            partnerEmoji: partnerEmoji ?? undefined,
            theme: profile.theme,
            colorPreset: profile.color_preset,
            fontFamily: profile.font_family,
            primaryColor: profile.primary_color,
            accentColor: profile.accent_color,
            backgroundColor: profile.background_color,
            fontSize: profile.font_size,
            backgroundType: profile.background_type,
            backgroundValue: profile.background_value,
            backgroundBlur: profile.background_blur,
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
                    ...(updates.primaryColor !== undefined && { primary_color: updates.primaryColor }),
                    ...(updates.accentColor !== undefined && { accent_color: updates.accentColor }),
                    ...(updates.backgroundColor !== undefined && { background_color: updates.backgroundColor }),
                    ...(updates.fontSize !== undefined && { font_size: updates.fontSize }),
                    ...(updates.backgroundType !== undefined && { background_type: updates.backgroundType }),
                    ...(updates.backgroundValue !== undefined && { background_value: updates.backgroundValue }),
                    ...(updates.backgroundBlur !== undefined && { background_blur: updates.backgroundBlur }),
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
                primaryColor: data.primary_color,
                accentColor: data.accent_color,
                backgroundColor: data.background_color,
                fontSize: data.font_size,
                backgroundType: data.background_type,
                backgroundValue: data.background_value,
                backgroundBlur: data.background_blur,
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
                    ...(updates.primaryColor !== undefined && { primary_color: updates.primaryColor }),
                    ...(updates.accentColor !== undefined && { accent_color: updates.accentColor }),
                    ...(updates.backgroundColor !== undefined && { background_color: updates.backgroundColor }),
                    ...(updates.fontSize !== undefined && { font_size: updates.fontSize }),
                    ...(updates.backgroundType !== undefined && { background_type: updates.backgroundType }),
                    ...(updates.backgroundValue !== undefined && { background_value: updates.backgroundValue }),
                    ...(updates.backgroundBlur !== undefined && { background_blur: updates.backgroundBlur }),
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
                primaryColor: data.primary_color,
                accentColor: data.accent_color,
                backgroundColor: data.background_color,
                fontSize: data.font_size,
                backgroundType: data.background_type,
                backgroundValue: data.background_value,
                backgroundBlur: data.background_blur,
            };
        }
    }
}

// Export singleton instance
export const authProvider = new SupabaseAuthProvider();
