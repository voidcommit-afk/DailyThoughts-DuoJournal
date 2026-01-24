// Types for the shared journal application

export interface User {
    id: number;
    name: string;
    display_name: string;
    emoji: string;
    username: string;
    password?: string;
    is_admin?: number; // 0 or 1

    // Personalization (Phase 2)
    theme?: string;
    primary_color?: string;
    accent_color?: string;
    background_color?: string;
    font_family?: string;
    font_size?: string;
    background_type?: string; // 'gradient' | 'solid' | 'image' | 'pattern'
    background_value?: string;
    background_blur?: number;
    avatar_url?: string;
    cover_url?: string;
    bio?: string;
    favorite_quote?: string;
    daily_goal?: number;
}

export interface Entry {
    id: number;
    user_id: number;
    date: string; // YYYY-MM-DD format
    content: string;
    images: string[]; // Array of image paths
    audio_notes?: string[]; // Array of audio file paths
    mood?: string; // Mood emoji
    weather?: string; // Weather emoji
    created_at: string;
    updated_at: string;
}

export interface Reaction {
    id: number;
    entry_id: number;
    user_id: number;
    emoji: string;
    created_at: string;
}

export interface SessionData {
    isLoggedIn: boolean;
    userId: number;
    userName: string;
    displayName: string;
    emoji: string;
    lastActivity: number;
    isAdmin?: boolean;
}

export interface EntryWithUser extends Entry {
    user: User;
}

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEntry: boolean;
    hasPartnerEntry: boolean;
}

export interface SearchParams {
    query?: string;
    startDate?: string;
    endDate?: string;
    userId?: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
