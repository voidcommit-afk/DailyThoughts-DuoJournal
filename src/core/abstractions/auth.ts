// Auth abstraction for both iron-session and Supabase implementations

export interface User {
    id: string;
    email: string;
    displayName: string; // NOT NULL in DB
    emoji: string; // NOT NULL in DB
    partnerId?: string | null;
    partnerEmoji?: string;
    theme: string; // NOT NULL in DB
    colorPreset: string; // NOT NULL in DB
    fontFamily: string; // NOT NULL in DB
}

export interface Credentials {
    email: string;
    password: string;
}

export interface AuthProvider {
    /**
     * Get the currently authenticated user
     * @returns User object if authenticated, null otherwise
     */
    getUser(): Promise<User | null>;

    /**
     * Sign in with email and password
     * @param credentials User credentials
     */
    signIn(credentials: Credentials): Promise<void>;

    /**
     * Sign out the current user
     */
    signOut(): Promise<void>;

    /**
     * Sign up a new user
     * @param credentials User credentials
     */
    signUp(credentials: Credentials): Promise<void>;

    /**
     * Update user profile
     * @param userId User ID
     * @param updates Partial user data to update
     */
    updateProfile(userId: string, updates: Partial<User>): Promise<User>;
}
