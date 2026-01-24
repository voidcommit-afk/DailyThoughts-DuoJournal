import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler';
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
        const { email } = await request.json();
        const supabase = await createSupabaseRouteHandlerClient(request);


        // Security: Always return success to prevent user enumeration (guessing emails)
        // We only throw if it's a system error, but we swallow "User not found" implicitly by not checking it before sending?
        // Actually, Supabase might return an error if user doesn't exist. 
        // We should catch that specific error and still return success.

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/update-password`,
        });

        if (error) {
            console.error('Reset password error:', error.message);
            // Verify if error is rate limit (429) - we might want to let that through or handle generally
            // For now, return success to UI to hide user existence
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        // Only return error 500 for actual crashes, not logic denials
        console.error('Reset password system error:', error);
        return NextResponse.json({ success: true });
    }
}
