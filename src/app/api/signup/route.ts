import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We use the service role key here to bypass RLS for waitlist insertion 
// although we set a public insert policy, this is more robust
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { name, email } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Insert into waitlist_requests
        const { error } = await supabaseAdmin
            .from('waitlist_requests')
            .insert([{ name, email }]);

        if (error) {
            // Check for unique constraint violation (already on waitlist)
            if (error.code === '23505') {
                return NextResponse.json({ error: 'This email is already on the sanctuary waitlist.' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Waitlist submission error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
