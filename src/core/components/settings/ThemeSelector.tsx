'use client';

import { motion } from 'framer-motion';
import { THEMES, Theme } from '../../lib/themes';
import { useTheme } from '../ThemeProvider';

interface ThemeSelectorProps {
    onThemeChange?: (theme: string) => void;
}

export default function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
    const { currentTheme, setTheme, primaryColor, setPrimaryColor, accentColor, setAccentColor, backgroundColor, setBackgroundColor } = useTheme();

    const handleThemeSelect = (themeKey: string) => {
        setTheme(themeKey);
        onThemeChange?.(themeKey);
    };

    return (
        <div className="space-y-6">
            {/* Theme Presets */}
            <div>
                <h3 className="text-sm font-medium mb-3">Theme Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(THEMES).map(([key, theme]) => (
                        <motion.button
                            key={key}
                            onClick={() => handleThemeSelect(key)}
                            className={`relative p-3 rounded-xl border-2 transition-all ${currentTheme === key
                                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                                : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Theme preview */}
                            <div
                                className="w-full h-16 rounded-lg mb-2 overflow-hidden"
                                style={{ background: theme.background }}
                            >
                                <div className="h-full flex items-center justify-center gap-1 p-2">
                                    <div
                                        className="w-8 h-3 rounded"
                                        style={{ background: theme.primary }}
                                    />
                                    <div
                                        className="w-6 h-3 rounded"
                                        style={{ background: theme.accent }}
                                    />
                                </div>
                            </div>
                            <span className="text-xs font-medium">{theme.name}</span>

                            {/* Selected indicator */}
                            {currentTheme === key && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center"
                                >
                                    <span className="text-white text-xs">✓</span>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Custom Colors */}
            <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium mb-3">Custom Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Primary Color */}
                    <div>
                        <label className="block text-xs text-[var(--muted)] mb-1">Primary Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="input flex-1 text-xs font-mono"
                                placeholder="#818cf8"
                            />
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                        <label className="block text-xs text-[var(--muted)] mb-1">Accent Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                            />
                            <input
                                type="text"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="input flex-1 text-xs font-mono"
                                placeholder="#6366f1"
                            />
                        </div>
                    </div>

                    {/* Background Color */}
                    <div>
                        <label className="block text-xs text-[var(--muted)] mb-1">Background Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                            />
                            <input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="input flex-1 text-xs font-mono"
                                placeholder="#0B0E17"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
