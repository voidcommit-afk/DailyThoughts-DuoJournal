'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GRADIENTS, PATTERNS } from '../../lib/backgrounds';
import { useTheme } from '../ThemeProvider';
import PillToggle from '../PillToggle';

export default function BackgroundSelector() {
    const {
        backgroundType,
        setBackgroundType,
        backgroundValue,
        setBackgroundValue,
        backgroundBlur,
        setBackgroundBlur
    } = useTheme();

    const backgroundOptions = [
        { value: 'gradient', label: 'Gradient' },
        { value: 'solid', label: 'Solid' },
        { value: 'pattern', label: 'Pattern' },
    ];

    return (
        <div className="space-y-6">
            {/* Background Type Selector */}
            <div>
                <h3 className="text-sm font-medium mb-3">Background Type</h3>
                <PillToggle
                    options={backgroundOptions}
                    value={backgroundType}
                    onChange={(value) => setBackgroundType(value as 'gradient' | 'solid' | 'image' | 'pattern')}
                />
            </div>

            {/* Background Options based on type */}
            <div className="pt-4 border-t border-[var(--border)]">
                {backgroundType === 'gradient' && (
                    <div>
                        <h3 className="text-sm font-medium mb-3">Gradient Presets</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {Object.entries(GRADIENTS).map(([key, gradient]) => (
                                <motion.button
                                    key={key}
                                    onClick={() => setBackgroundValue(key)}
                                    className={`relative h-20 rounded-xl border-2 overflow-hidden ${backgroundValue === key
                                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                        }`}
                                    style={{ background: gradient.css }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="absolute bottom-1 left-2 text-xs text-white/80 drop-shadow-md">
                                        {gradient.name}
                                    </span>
                                    {backgroundValue === key && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center"
                                        >
                                            <span className="text-white text-xs">✓</span>
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {backgroundType === 'solid' && (
                    <div>
                        <h3 className="text-sm font-medium mb-3">Solid Color</h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={backgroundValue.startsWith('#') ? backgroundValue : '#0B0E17'}
                                onChange={(e) => setBackgroundValue(e.target.value)}
                                className="w-16 h-16 rounded-xl cursor-pointer border border-[var(--border)]"
                            />
                            <input
                                type="text"
                                value={backgroundValue.startsWith('#') ? backgroundValue : '#0B0E17'}
                                onChange={(e) => setBackgroundValue(e.target.value)}
                                className="input w-36 font-mono text-sm"
                                placeholder="#0B0E17"
                            />
                        </div>
                    </div>
                )}

                {backgroundType === 'pattern' && (
                    <div>
                        <h3 className="text-sm font-medium mb-3">Pattern Overlays</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.entries(PATTERNS).map(([key, pattern]) => (
                                <motion.button
                                    key={key}
                                    onClick={() => setBackgroundValue(key)}
                                    className={`relative h-20 rounded-xl border-2 overflow-hidden ${backgroundValue === key
                                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                        }`}
                                    style={{
                                        background: `${pattern.css}, linear-gradient(to bottom, #1a1a2e, #0a0a0f)`,
                                        backgroundSize: pattern.backgroundSize || 'auto',
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="absolute bottom-1 left-2 text-xs text-white/80 drop-shadow-md">
                                        {pattern.name}
                                    </span>
                                    {backgroundValue === key && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center"
                                        >
                                            <span className="text-white text-xs">✓</span>
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Blur Slider (for image backgrounds) */}
            <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium mb-3">Background Blur</h3>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={backgroundBlur}
                        onChange={(e) => setBackgroundBlur(Number(e.target.value))}
                        className="flex-1 accent-[var(--primary)]"
                    />
                    <span className="text-sm text-[var(--muted)] w-12">{backgroundBlur}px</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                    Adds a blur effect to improve text readability
                </p>
            </div>
        </div>
    );
}
