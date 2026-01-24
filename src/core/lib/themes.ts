/**
 * Theme configuration for the Daily Journal application
 * Each theme defines colors for all UI elements
 */

export interface Theme {
    name: string;
    background: string;
    foreground: string;
    primary: string;
    primaryHover: string;
    accent: string;
    border: string;
    card: string;
    muted: string;
}

export const THEMES: Record<string, Theme> = {
    midnight: {
        name: 'Midnight Blue',
        background: '#0B0E17',
        foreground: '#F8FAFC',
        primary: '#818cf8',
        primaryHover: '#6366f1',
        accent: '#6366f1',
        border: '#1E293B',
        card: 'rgba(30, 41, 59, 0.6)',
        muted: '#94a3b8',
    },
    sunset: {
        name: 'Sunset Orange',
        background: '#1A1210',
        foreground: '#FEF3E2',
        primary: '#F97316',
        primaryHover: '#EA580C',
        accent: '#FB923C',
        border: '#3D2D24',
        card: 'rgba(61, 45, 36, 0.6)',
        muted: '#A8A29E',
    },
    forest: {
        name: 'Forest Green',
        background: '#0F1A14',
        foreground: '#ECFDF5',
        primary: '#22C55E',
        primaryHover: '#16A34A',
        accent: '#4ADE80',
        border: '#1E3A2F',
        card: 'rgba(30, 58, 47, 0.6)',
        muted: '#9CA3AF',
    },
    lavender: {
        name: 'Lavender Dreams',
        background: '#1A1625',
        foreground: '#FAF5FF',
        primary: '#A855F7',
        primaryHover: '#9333EA',
        accent: '#C084FC',
        border: '#2E2639',
        card: 'rgba(46, 38, 57, 0.6)',
        muted: '#A78BFA',
    },
    monochrome: {
        name: 'Monochrome',
        background: '#0A0A0A',
        foreground: '#FAFAFA',
        primary: '#A1A1AA',
        primaryHover: '#71717A',
        accent: '#D4D4D8',
        border: '#27272A',
        card: 'rgba(39, 39, 42, 0.6)',
        muted: '#71717A',
    },
    ocean: {
        name: 'Ocean Breeze',
        background: '#0C1929',
        foreground: '#F0F9FF',
        primary: '#0EA5E9',
        primaryHover: '#0284C7',
        accent: '#38BDF8',
        border: '#1E3A5F',
        card: 'rgba(30, 58, 95, 0.6)',
        muted: '#7DD3FC',
    },
};

export interface Font {
    name: string;
    family: string;
    googleFont?: string; // Google Fonts import name
}

export const FONTS: Record<string, Font> = {
    papyrus: {
        name: 'Papyrus',
        family: "Papyrus, 'Segoe Print', 'Comic Sans MS', cursive",
        // System font - no Google Font needed
    },
    helvetica: {
        name: 'Helvetica',
        family: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        // System font - no Google Font needed
    },
    roboto: {
        name: 'Roboto',
        family: "'Roboto', sans-serif",
        googleFont: 'Roboto:wght@400;500;700',
    },
    timesNewRoman: {
        name: 'Times New Roman',
        family: "'Times New Roman', Times, Georgia, serif",
        // System font - no Google Font needed
    },
    classic: {
        name: 'Classic',
        family: "Georgia, Palatino, 'Times New Roman', serif",
        // Uses Georgia as the classic serif
    },
    gothic: {
        name: 'Gothic',
        family: "'Century Gothic', 'Avant Garde', Futura, sans-serif",
        // System font - no Google Font needed
    },
};

export interface FontSize {
    name: string;
    scale: number;
    baseSize: string;
}

export const FONT_SIZES: Record<string, FontSize> = {
    small: { name: 'Small', scale: 0.875, baseSize: '14px' },
    medium: { name: 'Medium', scale: 1, baseSize: '16px' },
    large: { name: 'Large', scale: 1.125, baseSize: '18px' },
    xlarge: { name: 'Extra Large', scale: 1.25, baseSize: '20px' },
};

/**
 * Apply theme to document root via CSS custom properties
 */
export function applyTheme(theme: Theme | string, customColors?: {
    primary?: string;
    accent?: string;
    background?: string;
}) {
    if (typeof document === 'undefined') return;

    const themeObj = typeof theme === 'string' ? THEMES[theme] || THEMES.midnight : theme;
    const root = document.documentElement;

    root.style.setProperty('--background', customColors?.background || themeObj.background);
    root.style.setProperty('--foreground', themeObj.foreground);
    root.style.setProperty('--primary', customColors?.primary || themeObj.primary);
    root.style.setProperty('--primary-hover', themeObj.primaryHover);
    root.style.setProperty('--accent', customColors?.accent || themeObj.accent);
    root.style.setProperty('--border', themeObj.border);
    root.style.setProperty('--card', themeObj.card);
    root.style.setProperty('--muted', themeObj.muted);
}

/**
 * Apply font settings to document root
 */
export function applyFont(fontFamily: string, fontSize: string) {
    if (typeof document === 'undefined') return;

    const font = FONTS[fontFamily] || FONTS.roboto;
    const size = FONT_SIZES[fontSize] || FONT_SIZES.medium;
    const root = document.documentElement;

    root.style.setProperty('--font-family', font.family);
    root.style.setProperty('--font-scale', String(size.scale));
    root.style.setProperty('--base-font-size', size.baseSize);
    document.body.style.fontFamily = font.family;
    document.body.style.fontSize = size.baseSize;
}

/**
 * Get CSS variables for a theme (for SSR or preview)
 */
export function getThemeCSSVariables(themeName: string): Record<string, string> {
    const theme = THEMES[themeName] || THEMES.midnight;
    return {
        '--background': theme.background,
        '--foreground': theme.foreground,
        '--primary': theme.primary,
        '--primary-hover': theme.primaryHover,
        '--accent': theme.accent,
        '--border': theme.border,
        '--card': theme.card,
        '--muted': theme.muted,
    };
}
