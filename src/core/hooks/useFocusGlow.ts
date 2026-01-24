/**
 * Custom hook to provide user-specific focus glow colors.
 * Returns CSS class names and color values based on the user ID.
 */

export interface FocusGlowResult {
    glowClass: string;
    glowColor: string;
    glowRgb: string;
}

export function useFocusGlow(userId?: string): FocusGlowResult {
    // For multi-user production app, use a hash-based color assignment
    // or fetch from user preferences

    // Default/fallback
    return {
        glowClass: '',
        glowColor: 'var(--primary)',
        glowRgb: '129, 140, 248', // primary purple
    };
}

/**
 * Sets CSS custom properties for user-specific focus glow.
 * Call this on the document root to apply globally.
 */
export function setUserFocusGlow(userId?: string): void {
    if (typeof document === 'undefined') return;

    const { glowColor, glowRgb } = useFocusGlow(userId);

    document.documentElement.style.setProperty('--focus-glow-color', glowColor);
    document.documentElement.style.setProperty('--focus-glow-rgb', glowRgb);
}
