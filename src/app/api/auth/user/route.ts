import { NextRequest, NextResponse } from 'next/server';
import { authProvider } from '@/lib/auth-provider';

export async function GET(request: NextRequest) {
    try {
        const user = await authProvider.getUser();

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get user' },
            { status: 500 }
        );
    }
}
