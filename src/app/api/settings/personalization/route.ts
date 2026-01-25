import { NextRequest, NextResponse } from 'next/server';
import { authProvider } from '@/lib/auth-provider';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
    try {
        const user = await authProvider.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { theme, fontFamily, primaryColor, accentColor, backgroundColor, fontSize, backgroundType, backgroundValue, backgroundBlur } = body;

        const supabase = await createSupabaseServerClient();

        // Map frontend camelCase to DB snake_case
        const updates: any = {};
        if (theme) updates.theme = theme;
        if (fontFamily) updates.font_family = fontFamily;
        if (primaryColor) updates.primary_color = primaryColor;
        if (accentColor) updates.accent_color = accentColor;
        if (backgroundColor) updates.background_color = backgroundColor;
        if (fontSize) updates.font_size = fontSize;
        if (backgroundType) updates.background_type = backgroundType;
        if (backgroundValue) updates.background_value = backgroundValue;
        if (backgroundBlur !== undefined) updates.background_blur = backgroundBlur;

        if (Object.keys(updates).length > 0) {
            const { error } = await supabase
                .from('users')
                .update(updates as never)
                .eq('id', user.id);

            if (error) {
                console.error('Database update error:', error);
                throw new Error(error.message);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save settings' },
            { status: 500 }
        );
    }
}
