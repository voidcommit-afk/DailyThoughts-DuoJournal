import { NextRequest, NextResponse } from 'next/server';
import { authProvider } from '@/lib/auth-provider';
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        await authProvider.signUp({ email, password });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Sign up failed' },
            { status: 400 }
        );
    }
}
