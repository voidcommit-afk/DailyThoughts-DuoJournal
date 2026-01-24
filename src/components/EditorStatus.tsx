'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface EditorStatusProps {
    content: string;
    saveStatus: SaveStatus;
    lastSaved?: Date;
}

export default function EditorStatus({ content, saveStatus, lastSaved }: EditorStatusProps) {
    // Calculate word count from HTML content
    const wordCount = useMemo(() => {
        if (!content) return 0;
        // Strip HTML tags and count words
        const textContent = content.replace(/<[^>]*>/g, ' ').trim();
        if (!textContent) return 0;
        return textContent.split(/\s+/).filter(word => word.length > 0).length;
    }, [content]);

    const statusConfig = {
        saved: {
            icon: '✓',
            text: 'Saved',
            className: 'save-status-saved',
        },
        saving: {
            icon: '↻',
            text: 'Saving...',
            className: 'save-status-saving',
        },
        unsaved: {
            icon: '○',
            text: 'Unsaved changes',
            className: 'save-status-unsaved',
        },
    };

    const currentStatus = statusConfig[saveStatus];

    return (
        <div className="editor-status">
            {/* Word count */}
            <div className="flex items-center gap-2">
                <span className="text-[var(--muted)]">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
            </div>

            {/* Save status */}
            <div className={`save-status ${currentStatus.className}`}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={saveStatus}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                    >
                        {saveStatus === 'saving' ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                {currentStatus.icon}
                            </motion.span>
                        ) : (
                            <span>{currentStatus.icon}</span>
                        )}
                        <span>{currentStatus.text}</span>
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
