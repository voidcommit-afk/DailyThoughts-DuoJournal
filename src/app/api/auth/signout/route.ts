import { NextRequest, NextResponse } from 'next/server';
import { authProvider } from '@/lib/auth-provider';

export async function POST(request: NextRequest) {
    try {
        await authProvider.signOut();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Sign out failed' },
            { status: 500 }
        );
    }
}
