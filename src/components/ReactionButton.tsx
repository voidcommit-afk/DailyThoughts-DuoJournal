'use client';

import React, { useState } from 'react';

interface ReactionButtonProps {
    entryId: number;
    initialHasReacted: boolean;
    initialReactionCount: number;
    onToggle?: (hasReacted: boolean) => void;
}

export default function ReactionButton({
    entryId,
    initialHasReacted,
    initialReactionCount,
    onToggle,
}: ReactionButtonProps) {
    const [hasReacted, setHasReacted] = useState(initialHasReacted);
    const [count, setCount] = useState(initialReactionCount);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;

        setLoading(true);
        try {
            if (hasReacted) {
                // Remove reaction
                const res = await fetch(`/api/reactions?entryId=${entryId}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    setHasReacted(false);
                    setCount((c) => Math.max(0, c - 1));
                    onToggle?.(false);
                }
            } else {
                // Add reaction
                const res = await fetch('/api/reactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ entryId, emoji: '❤️' }),
                });
                if (res.ok) {
                    setHasReacted(true);
                    setCount((c) => c + 1);
                    onToggle?.(true);
                }
            }
        } catch (error) {
            console.error('Reaction error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${hasReacted
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    : 'bg-[var(--card)] hover:bg-[var(--border)] border border-[var(--border)]'
                } ${loading ? 'opacity-50' : 'hover:scale-105'}`}
            aria-label={hasReacted ? 'Remove reaction' : 'Add reaction'}
            aria-pressed={hasReacted}
        >
            <span className={`text-xl transition-transform ${hasReacted ? 'scale-110' : ''}`}>
                {hasReacted ? '❤️' : '🤍'}
            </span>
            {count > 0 && <span className="text-sm font-medium">{count}</span>}
        </button>
    );
}
