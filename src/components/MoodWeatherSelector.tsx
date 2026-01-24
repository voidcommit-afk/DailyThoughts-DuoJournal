'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '🥳', label: 'Excited' },
];

const WEATHER = [
    { emoji: '☀️', label: 'Sunny' },
    { emoji: '⛅', label: 'Partly Cloudy' },
    { emoji: '☁️', label: 'Cloudy' },
    { emoji: '🌧️', label: 'Rainy' },
    { emoji: '❄️', label: 'Snowy' },
];

interface MoodWeatherSelectorProps {
    mood: string;
    weather: string;
    onMoodChange: (mood: string) => void;
    onWeatherChange: (weather: string) => void;
    disabled?: boolean;
}

export default function MoodWeatherSelector({
    mood,
    weather,
    onMoodChange,
    onWeatherChange,
    disabled = false,
}: MoodWeatherSelectorProps) {
    return (
        <div className="space-y-4 mb-4">
            {/* Mood Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                <div className="flex gap-2 flex-wrap">
                    {MOODS.map(({ emoji, label }) => (
                        <motion.button
                            key={emoji}
                            type="button"
                            onClick={() => onMoodChange(mood === emoji ? '' : emoji)}
                            disabled={disabled}
                            className={`p-2 text-2xl rounded-lg border-luminous ${mood === emoji
                                ? 'bg-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]'
                                : 'bg-[var(--card)] hover:bg-[var(--border)]'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={label}
                            aria-label={label}
                            aria-pressed={mood === emoji}
                            whileHover={disabled ? {} : { scale: 1.1, y: -2 }}
                            whileTap={disabled ? {} : { scale: 0.9 }}
                            animate={mood === emoji ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, -10, 10, 0],
                            } : {}}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                            }}
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Weather Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">What&apos;s the weather like?</label>
                <div className="flex gap-2 flex-wrap">
                    {WEATHER.map(({ emoji, label }) => (
                        <motion.button
                            key={emoji}
                            type="button"
                            onClick={() => onWeatherChange(weather === emoji ? '' : emoji)}
                            disabled={disabled}
                            className={`p-2 text-2xl rounded-lg border-luminous ${weather === emoji
                                ? 'bg-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]'
                                : 'bg-[var(--card)] hover:bg-[var(--border)]'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={label}
                            aria-label={label}
                            aria-pressed={weather === emoji}
                            whileHover={disabled ? {} : { scale: 1.1, y: -2 }}
                            whileTap={disabled ? {} : { scale: 0.9 }}
                            animate={weather === emoji ? {
                                scale: [1, 1.2, 1],
                            } : {}}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 20,
                            }}
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { MOODS, WEATHER };

