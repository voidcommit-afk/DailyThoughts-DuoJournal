'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import EmojiPicker from '../EmojiPicker';

interface ProfileEditorProps {
    displayName: string;
    setDisplayName: (name: string) => void;
    emoji: string;
    setEmoji: (emoji: string) => void;
    dailyGoal: number;
    setDailyGoal: (goal: number) => void;
}

export default function ProfileEditor({
    displayName,
    setDisplayName,
    emoji,
    setEmoji,
    dailyGoal,
    setDailyGoal,
}: ProfileEditorProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    return (
        <div className="space-y-6">
            {/* Profile Preview */}
            <div className="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 border-2 border-[var(--border)] flex items-center justify-center">
                    <span className="text-4xl">{emoji}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-medium">{displayName || 'Your Name'}</h3>
                    <p className="text-sm text-[var(--muted)]">Profile Preview</p>
                </div>
            </div>

            {/* Display Name */}
            <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input w-full focus-glow"
                    placeholder="Your name"
                    maxLength={50}
                />
            </div>

            {/* Emoji Customization */}
            <div>
                <label className="block text-sm font-medium mb-2">Profile Emoji</label>
                <p className="text-xs text-[var(--muted)] mb-3">
                    Choose an emoji to represent your profile
                </p>

                {/* Current Emoji Display */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] flex items-center justify-center">
                        <span className="text-4xl">{emoji}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="btn-primary px-4 py-2"
                    >
                        {showEmojiPicker ? 'Close Picker' : 'Change Emoji'}
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4"
                    >
                        <EmojiPicker
                            selectedEmoji={emoji}
                            onSelect={(e: string) => {
                                setEmoji(e);
                                setShowEmojiPicker(false);
                            }}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </motion.div>
                )}
            </div>

            {/* Daily Writing Goal */}
            <div>
                <label className="block text-sm font-medium mb-1">Daily Writing Goal</label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="flex-1 accent-[var(--primary)] h-2"
                    />
                    <div className="flex items-center gap-1 min-w-[80px]">
                        <input
                            type="number"
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(Math.max(0, Math.min(10000, Number(e.target.value))))}
                            className="input w-16 text-center text-sm py-1"
                            min="0"
                            max="10000"
                        />
                        <span className="text-xs text-[var(--muted)]">words</span>
                    </div>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                    {dailyGoal === 0 ? 'No goal set' : `Target: ${dailyGoal} words/day`}
                </p>
            </div>
        </div>
    );
}
