import { NextRequest, NextResponse } from 'next/server';
import { authProvider } from '@/lib/auth-provider';

export async function GET(request: NextRequest) {
    // Already implemented elsewhere? No, settings page fetches /api/auth/user 
    // But partner page fetches /api/auth/user too.
    // Let's just create a simple user details handler if needed, but for now 
    // auth-provider usually handles getting the current user.
    // The previous code might have been using /api/auth/user.
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await authProvider.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Allowed updates
        const updates: any = {};
        if (body.display_name !== undefined) updates.displayName = body.display_name;
        if (body.emoji !== undefined) updates.emoji = body.emoji;
        if (body.partner_id !== undefined) updates.partnerId = body.partner_id;

        const updatedUser = await authProvider.updateProfile(user.id, updates);

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update user' },
            { status: 500 }
        );
    }
}
