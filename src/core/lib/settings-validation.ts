
export interface UserPersonalization {
    theme?: string;
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontSize?: string;
    backgroundType?: string;
    backgroundValue?: string;
    backgroundBlur?: number;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    favoriteQuote?: string;
    dailyGoal?: number;
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validatePersonalizationSettings(settings: UserPersonalization): ValidationResult {
    if (settings.bio && settings.bio.length > 150) {
        return { valid: false, error: 'Bio must be 150 characters or less' };
    }

    if (settings.favoriteQuote && settings.favoriteQuote.length > 200) {
        return { valid: false, error: 'Quote must be 200 characters or less' };
    }

    if (settings.dailyGoal !== undefined && (settings.dailyGoal < 0 || settings.dailyGoal > 10000)) {
        // We usually clamp this, but for strict validation we could error.
        // The original code clamps it: Math.max(0, Math.min(10000, Number(body.dailyGoal)))
        // Use a utility to clamp if needed, but for validation we can just check range.
        return { valid: false, error: 'Daily goal must be between 0 and 10000' };
    }

    return { valid: true };
}

export function sanitizePersonalizationSettings(body: any): UserPersonalization {
    const settings: UserPersonalization = {};

    if (body.theme !== undefined) settings.theme = body.theme;
    if (body.primaryColor !== undefined) settings.primaryColor = body.primaryColor;
    if (body.accentColor !== undefined) settings.accentColor = body.accentColor;
    if (body.backgroundColor !== undefined) settings.backgroundColor = body.backgroundColor;
    if (body.fontFamily !== undefined) settings.fontFamily = body.fontFamily;
    if (body.fontSize !== undefined) settings.fontSize = body.fontSize;
    if (body.backgroundType !== undefined) settings.backgroundType = body.backgroundType;
    if (body.backgroundValue !== undefined) settings.backgroundValue = body.backgroundValue;
    if (body.backgroundBlur !== undefined) settings.backgroundBlur = Number(body.backgroundBlur);
    if (body.avatarUrl !== undefined) settings.avatarUrl = body.avatarUrl;
    if (body.coverUrl !== undefined) settings.coverUrl = body.coverUrl;
    if (body.bio !== undefined) settings.bio = body.bio;
    if (body.favoriteQuote !== undefined) settings.favoriteQuote = body.favoriteQuote;
    if (body.dailyGoal !== undefined) {
        settings.dailyGoal = Math.max(0, Math.min(10000, Number(body.dailyGoal)));
    }

    return settings;
}
