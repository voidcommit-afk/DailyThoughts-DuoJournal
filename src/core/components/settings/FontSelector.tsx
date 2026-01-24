'use client';

import { motion } from 'framer-motion';
import { FONTS, FONT_SIZES, Font, FontSize } from '../../lib/themes';
import { useTheme } from '../ThemeProvider';

export default function FontSelector() {
    const { fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();

    return (
        <div className="space-y-6">
            {/* Font Family */}
            <div>
                <h3 className="text-sm font-medium mb-3">Font Family</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(FONTS).map(([key, font]) => (
                        <motion.button
                            key={key}
                            onClick={() => setFontFamily(key)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${fontFamily === key
                                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                                : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                }`}
                            style={{ fontFamily: font.family }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="block text-lg mb-1">Aa</span>
                            <span className="text-sm font-medium">{font.name}</span>
                            {fontFamily === key && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-[var(--primary)] block mt-1"
                                >
                                    Selected
                                </motion.span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Font Size */}
            <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium mb-3">Font Size</h3>
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(FONT_SIZES).map(([key, size]) => (
                        <motion.button
                            key={key}
                            onClick={() => setFontSize(key)}
                            className={`px-4 py-2 rounded-lg border transition-all ${fontSize === key
                                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                }`}
                            style={{ fontSize: size.baseSize }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {size.name}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium mb-3">Preview</h3>
                <div
                    className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                    style={{
                        fontFamily: FONTS[fontFamily]?.family || FONTS.roboto.family,
                        fontSize: FONT_SIZES[fontSize]?.baseSize || '16px'
                    }}
                >
                    <p className="mb-2">
                        <strong>The quick brown fox jumps over the lazy dog.</strong>
                    </p>
                    <p className="text-[var(--muted)]">
                        This is how your journal entries will appear. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </div>
        </div>
    );
}
