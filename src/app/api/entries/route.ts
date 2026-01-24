import { NextRequest, NextResponse } from 'next/server';
import { entryRepository } from '@/lib/entry-repository';
import { authProvider } from '@/lib/auth-provider';

export async function GET(request: NextRequest) {
    try {
        const user = await authProvider.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate') || undefined;
        const endDate = searchParams.get('endDate') || undefined;
        const searchQuery = searchParams.get('q') || undefined;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        const userIdParam = searchParams.get('userId');

        let entries;
        if (userIdParam && userIdParam === user.partnerId) {
            entries = await entryRepository.getPartnerEntries(user.partnerId, {
                startDate,
                endDate,
                searchQuery,
                limit,
            });
        } else {
            entries = await entryRepository.getEntries(user.id, {
                startDate,
                endDate,
                searchQuery,
                limit,
            });
        }

        return NextResponse.json({ entries });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch entries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await authProvider.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { date, content, images, audioNotes } = body;

        if (!date || !content) {
            return NextResponse.json(
                { error: 'Date and content are required' },
                { status: 400 }
            );
        }

        const entry = await entryRepository.createEntry({
            userId: user.id,
            date,
            content,
            images: images || [],
            audioNotes: audioNotes || [],
        });

        return NextResponse.json({ entry }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create entry' },
            { status: 500 }
        );
    }
}
