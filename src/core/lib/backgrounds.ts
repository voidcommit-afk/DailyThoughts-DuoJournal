/**
 * Background configuration for the Daily Journal application
 * Supports gradients, solid colors, patterns, and uploaded images
 */

export interface Gradient {
    name: string;
    css: string;
}

export const GRADIENTS: Record<string, Gradient> = {
    midnight: {
        name: 'Midnight',
        css: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
    },
    aurora: {
        name: 'Aurora',
        css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    sunset: {
        name: 'Sunset',
        css: 'linear-gradient(to bottom, #1A1210 0%, #2D1F18 50%, #3D2D24 100%)',
    },
    forest: {
        name: 'Forest',
        css: 'linear-gradient(to bottom, #0F1A14 0%, #1E3A2F 100%)',
    },
    lavender: {
        name: 'Lavender',
        css: 'linear-gradient(to bottom, #1A1625 0%, #2E2639 100%)',
    },
    ocean: {
        name: 'Ocean',
        css: 'linear-gradient(to bottom, #0C1929 0%, #1E3A5F 100%)',
    },
    cosmic: {
        name: 'Cosmic',
        css: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #16213e 100%)',
    },
    ember: {
        name: 'Ember',
        css: 'linear-gradient(to bottom right, #1f1c1c 0%, #3d1a1a 50%, #1f1c1c 100%)',
    },
    arctic: {
        name: 'Arctic',
        css: 'linear-gradient(to bottom, #0a1628 0%, #1a3a52 100%)',
    },
    noir: {
        name: 'Noir',
        css: 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%)',
    },
};

export interface Pattern {
    name: string;
    css: string;
    backgroundSize?: string;
}

export const PATTERNS: Record<string, Pattern> = {
    dots: {
        name: 'Dots',
        css: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
    },
    grid: {
        name: 'Grid',
        css: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
    },
    diagonal: {
        name: 'Diagonal Lines',
        css: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)',
    },
    waves: {
        name: 'Waves',
        css: 'repeating-linear-gradient(to right, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 80px)',
    },
    honeycomb: {
        name: 'Honeycomb',
        css: 'radial-gradient(circle farthest-side at 0% 50%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 51%, transparent 51%), radial-gradient(circle farthest-side at 100% 50%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 51%, transparent 51%)',
        backgroundSize: '60px 35px',
    },
};

export type BackgroundType = 'gradient' | 'solid' | 'image' | 'pattern';

export interface BackgroundConfig {
    type: BackgroundType;
    value: string;
    blur: number;
}

/**
 * Get CSS for background based on type and value
 */
export function getBackgroundCSS(config: BackgroundConfig): { background: string; filter?: string } {
    const { type, value, blur } = config;

    switch (type) {
        case 'gradient':
            const gradient = GRADIENTS[value];
            return {
                background: gradient?.css || GRADIENTS.midnight.css,
            };

        case 'solid':
            return {
                background: value || '#0B0E17',
            };

        case 'image':
            return {
                background: `url(${value}) center/cover no-repeat fixed`,
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
            };

        case 'pattern':
            const pattern = PATTERNS[value];
            const baseGradient = GRADIENTS.midnight.css;
            if (pattern) {
                return {
                    background: `${pattern.css}, ${baseGradient}`,
                };
            }
            return { background: baseGradient };

        default:
            return { background: GRADIENTS.midnight.css };
    }
}

/**
 * Apply background to document
 */
export function applyBackground(config: BackgroundConfig) {
    if (typeof document === 'undefined') return;

    const { background, filter } = getBackgroundCSS(config);
    const root = document.documentElement;

    root.style.setProperty('--app-background', background);
    document.body.style.background = background;

    // For image backgrounds, we might need a blur overlay
    if (config.type === 'image' && config.blur > 0) {
        root.style.setProperty('--background-blur', `${config.blur}px`);
    } else {
        root.style.setProperty('--background-blur', '0px');
    }
}
