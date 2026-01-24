'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface CommandItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    keywords: string[];
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const commands: CommandItem[] = [
        {
            id: 'today',
            title: 'Write Today\'s Entry',
            description: 'Open today\'s journal entry',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            action: () => router.push(`/entry/${format(new Date(), 'yyyy-MM-dd')}`),
            keywords: ['new', 'write', 'entry', 'today', 'journal'],
        },
        {
            id: 'calendar',
            title: 'Go to Calendar',
            description: 'View your journal calendar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            action: () => router.push('/journal'),
            keywords: ['calendar', 'journal', 'home'],
        },
        {
            id: 'search',
            title: 'Search Entries',
            description: 'Find past journal entries',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            action: () => router.push('/search'),
            keywords: ['search', 'find', 'query'],
        },
        {
            id: 'settings',
            title: 'Settings',
            description: 'Customize your experience',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            action: () => router.push('/settings'),
            keywords: ['settings', 'preferences', 'theme', 'font'],
        },
        {
            id: 'export',
            title: 'Export Entries',
            description: 'Download your journal entries',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            action: () => router.push('/export'),
            keywords: ['export', 'download', 'backup', 'pdf', 'txt'],
        },
    ];

    const filteredCommands = query
        ? commands.filter((cmd) =>
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description.toLowerCase().includes(query.toLowerCase()) ||
            cmd.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
        )
        : commands;

    const executeCommand = useCallback((index: number) => {
        const cmd = filteredCommands[index];
        if (cmd) {
            onClose();
            cmd.action();
        }
    }, [filteredCommands, onClose]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                executeCommand(selectedIndex);
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, filteredCommands.length, selectedIndex, executeCommand, onClose]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed z-50 top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg mx-4"
                    >
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                                <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type a command..."
                                    className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] outline-none text-base"
                                />
                                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono bg-[var(--border)] text-[var(--muted)] rounded">
                                    ESC
                                </kbd>
                            </div>

                            {/* Command List */}
                            <div className="max-h-72 overflow-y-auto py-2">
                                {filteredCommands.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-[var(--muted)]">
                                        No commands found
                                    </div>
                                ) : (
                                    filteredCommands.map((cmd, index) => (
                                        <button
                                            key={cmd.id}
                                            onClick={() => executeCommand(index)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedIndex === index
                                                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                                    : 'hover:bg-[var(--border)] text-[var(--foreground)]'
                                                }`}
                                        >
                                            <span className={selectedIndex === index ? 'text-[var(--primary)]' : 'text-[var(--muted)]'}>
                                                {cmd.icon}
                                            </span>
                                            <div className="flex-1">
                                                <div className="font-medium">{cmd.title}</div>
                                                <div className="text-sm text-[var(--muted)]">{cmd.description}</div>
                                            </div>
                                            {selectedIndex === index && (
                                                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono bg-[var(--primary)]/20 text-[var(--primary)] rounded">
                                                    ↵
                                                </kbd>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--muted)]">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">↑↓</kbd>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">↵</kbd>
                                    Select
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-[var(--border)] rounded">Esc</kbd>
                                    Close
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
