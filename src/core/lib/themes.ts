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
        card: '#1E293B', // Broken rgba fixed to hex
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
        card: '#3D2D24', // Broken rgba fixed to hex
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
        card: '#1E3A2F', // Broken rgba fixed to hex
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
        card: '#2E2639', // Broken rgba fixed to hex
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
        card: '#27272A', // Broken rgba fixed to hex
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
        card: '#1E3A5F', // Broken rgba fixed to hex
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
    inter: {
        name: 'Inter',
        family: "'Inter', sans-serif",
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

    // Helper to convert Hex to HSL channels (e.g. "222.2 84% 4.9%")
    const toHsl = (hex: string) => {
        let c = hex.substring(1).split('');
        if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        const cVal = parseInt(c.join(''), 16);
        const r = (cVal >> 16) & 255;
        const g = (cVal >> 8) & 255;
        const b = cVal & 255;

        const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                case bNorm: h = (rNorm - gNorm) / d + 4; break;
            }
            h /= 6;
        }

        return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
    };

    // Apply HSL values for Tailwind/Shadcn compatibility
    root.style.setProperty('--background', toHsl(customColors?.background || themeObj.background));
    root.style.setProperty('--foreground', toHsl(themeObj.foreground));
    root.style.setProperty('--primary', toHsl(customColors?.primary || themeObj.primary));
    root.style.setProperty('--primary-hover', toHsl(themeObj.primaryHover));
    root.style.setProperty('--accent', toHsl(customColors?.accent || themeObj.accent));
    root.style.setProperty('--border', toHsl(themeObj.border));
    root.style.setProperty('--card', toHsl(themeObj.card.startsWith('#') ? themeObj.card : '#1e293b'));
    root.style.setProperty('--muted', toHsl(themeObj.muted));

    // Also set raw hex for components using var(--color-xxx) if needed, but globals uses HSL
    // If globals.css has background-color: hsl(var(--background)), we must provide channels.
    // If we want to support direct hex usage too, we'd need different vars.
    // For now, this fixes the "theme color change doesn't take effect" issue.
}

/**
 * Apply font settings to document root
 */
export function applyFont(fontFamily: string, fontSize: string) {
    if (typeof document === 'undefined') return;

    const font = FONTS[fontFamily] || FONTS.roboto;
    const size = FONT_SIZES[fontSize] || FONT_SIZES.medium;
    const root = document.documentElement;

    // Set the data-font attribute for our "Atomic Overrides" in CSS
    root.setAttribute('data-font', fontFamily);

    // Legacy sync (still useful for components using the variables)
    root.style.setProperty('--font-family', font.family);
    root.style.setProperty('--font-sans', font.family);
    root.style.setProperty('--font-serif', font.family);
    root.style.setProperty('--font-handwriting', font.family);

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
