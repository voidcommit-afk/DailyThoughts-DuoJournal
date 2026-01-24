// Repository abstraction for database operations

export interface Entry {
    id: string;
    userId: string;
    content: string;
    date: string;
    images: string[];
    audioNotes: string[];
    createdAt: string;
    updatedAt: string;
}

export interface EntryFilters {
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
}

export interface EntryRepository {
    /**
     * Get all entries for a user with optional filters
     * @param userId User ID
     * @param filters Optional filters for date range, search, pagination
     */
    getEntries(userId: string, filters?: EntryFilters): Promise<Entry[]>;

    /**
     * Get a single entry by ID
     * @param id Entry ID
     * @param userId User ID (for authorization)
     */
    getEntry(id: string, userId: string): Promise<Entry | null>;

    /**
     * Create a new entry
     * @param entry Entry data without id, createdAt, updatedAt
     */
    createEntry(entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Promise<Entry>;

    /**
     * Update an existing entry
     * @param id Entry ID
     * @param userId User ID (for authorization)
     * @param updates Partial entry data to update
     */
    updateEntry(id: string, userId: string, updates: Partial<Entry>): Promise<Entry>;

    /**
     * Delete an entry
     * @param id Entry ID
     * @param userId User ID (for authorization)
     */
    deleteEntry(id: string, userId: string): Promise<void>;

    /**
     * Bulk import entries (for migration/import features)
     * @param entries Array of entries to import
     * @param userId User ID
     */
    bulkImportEntries(entries: Entry[], userId: string): Promise<void>;

    /**
     * Get partner's entries (for shared journal feature)
     * @param partnerId Partner's user ID
     * @param filters Optional filters
     */
    getPartnerEntries(partnerId: string, filters?: EntryFilters): Promise<Entry[]>;
}
