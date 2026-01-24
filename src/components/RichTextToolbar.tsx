'use client';

import React from 'react';

interface RichTextToolbarProps {
    onBold: () => void;
    onItalic: () => void;
    onBulletList: () => void;
    onNumberedList: () => void;
}

export default function RichTextToolbar({
    onBold,
    onItalic,
    onBulletList,
    onNumberedList
}: RichTextToolbarProps) {
    return (
        <div className="flex items-center gap-1 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg mb-2">
            <button
                type="button"
                onClick={onBold}
                className="p-2 hover:bg-[var(--border)] rounded transition-colors font-bold text-sm"
                title="Bold (Ctrl+B)"
                aria-label="Bold"
            >
                B
            </button>
            <button
                type="button"
                onClick={onItalic}
                className="p-2 hover:bg-[var(--border)] rounded transition-colors italic text-sm"
                title="Italic (Ctrl+I)"
                aria-label="Italic"
            >
                I
            </button>
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <button
                type="button"
                onClick={onBulletList}
                className="p-2 hover:bg-[var(--border)] rounded transition-colors text-sm"
                title="Bullet List"
                aria-label="Bullet List"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    <circle cx="2" cy="6" r="1" fill="currentColor" />
                    <circle cx="2" cy="12" r="1" fill="currentColor" />
                    <circle cx="2" cy="18" r="1" fill="currentColor" />
                </svg>
            </button>
            <button
                type="button"
                onClick={onNumberedList}
                className="p-2 hover:bg-[var(--border)] rounded transition-colors text-sm"
                title="Numbered List"
                aria-label="Numbered List"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13" />
                    <text x="1" y="8" fontSize="6" fill="currentColor">1</text>
                    <text x="1" y="14" fontSize="6" fill="currentColor">2</text>
                    <text x="1" y="20" fontSize="6" fill="currentColor">3</text>
                </svg>
            </button>
        </div>
    );
}
