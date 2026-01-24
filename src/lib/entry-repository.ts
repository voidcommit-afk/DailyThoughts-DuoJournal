import { createSupabaseClient } from '@/lib/supabase/client';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { EntryRepository, Entry, EntryFilters } from '@/core';

export class SupabaseEntryRepository implements EntryRepository {
    private async getClient() {
        if (typeof window === 'undefined') {
            return await createSupabaseServerClient();
        }
        return createSupabaseClient();
    }

    async getEntries(userId: string, filters?: EntryFilters): Promise<Entry[]> {
        const supabase = await this.getClient();
        let query = supabase
            .from('entries')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (filters?.startDate) {
            query = query.gte('date', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('date', filters.endDate);
        }

        if (filters?.searchQuery) {
            query = query.ilike('content', `%${filters.searchQuery}%`);
        }

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return (data || []).map(this.mapToEntry);
    }

    async getEntry(id: string, userId: string): Promise<Entry | null> {
        const supabase: any = await this.getClient();
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntry(data);
    }

    async createEntry(entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Promise<Entry> {
        const supabase: any = await this.getClient();
        const { data, error } = await supabase
            .from('entries')
            .insert({
                user_id: entry.userId,
                date: entry.date,
                content: entry.content,
                images: entry.images || [],
                audio_notes: entry.audioNotes || [],
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return this.mapToEntry(data);
    }

    async updateEntry(id: string, userId: string, updates: Partial<Entry>): Promise<Entry> {
        const supabase: any = await this.getClient();
        const { data, error } = await supabase
            .from('entries')
            .update({
                content: updates.content,
                images: updates.images,
                audio_notes: updates.audioNotes,
                date: updates.date,
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return this.mapToEntry(data);
    }

    async deleteEntry(id: string, userId: string): Promise<void> {
        const supabase: any = await this.getClient();
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            throw new Error(error.message);
        }
    }

    async bulkImportEntries(entries: Entry[], userId: string): Promise<void> {
        const supabase: any = await this.getClient();
        const { error } = await supabase
            .from('entries')
            .insert(
                entries.map(entry => ({
                    user_id: userId,
                    date: entry.date,
                    content: entry.content,
                    images: entry.images || [],
                    audio_notes: entry.audioNotes || [],
                }))
            );

        if (error) {
            throw new Error(error.message);
        }
    }

    async getPartnerEntries(partnerId: string, filters?: EntryFilters): Promise<Entry[]> {
        const supabase: any = await this.getClient();
        let query = supabase
            .from('entries')
            .select('*')
            .eq('user_id', partnerId)
            .order('date', { ascending: false });

        if (filters?.startDate) {
            query = query.gte('date', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('date', filters.endDate);
        }

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return (data || []).map(this.mapToEntry);
    }

    private mapToEntry(data: any): Entry {
        return {
            id: data.id,
            userId: data.user_id,
            date: data.date,
            content: data.content,
            images: Array.isArray(data.images) ? data.images : [],
            audioNotes: Array.isArray(data.audio_notes) ? data.audio_notes : [],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    }
}

// Export singleton instance
export const entryRepository = new SupabaseEntryRepository();
