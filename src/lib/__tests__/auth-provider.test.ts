import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuthProvider } from '../auth-provider';

// Mock the Supabase client
const mockGetUser = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

vi.mock('./supabase/client', () => ({
    createSupabaseClient: () => ({
        auth: {
            getUser: mockGetUser,
            signInWithPassword: mockSignInWithPassword,
            signOut: mockSignOut,
        },
        from: mockFrom,
    }),
}));

vi.mock('./supabase/server', () => ({
    createSupabaseServerClient: () => ({
        auth: {
            getUser: mockGetUser,
        },
        from: mockFrom,
    }),
}));

describe('SupabaseAuthProvider', () => {
    let provider: SupabaseAuthProvider;

    beforeEach(() => {
        provider = new SupabaseAuthProvider();
        vi.clearAllMocks();

        // Setup chainable mocks
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: vi.fn(),
        });

        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                single: vi.fn(),
            }),
        });
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });

    it('should return null if no user is logged in', async () => {
        mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
        const user = await provider.getUser();
        expect(user).toBeNull();
    });

    // Add more tests as needed
});
