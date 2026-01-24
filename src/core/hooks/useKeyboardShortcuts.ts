'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';

export interface KeyboardShortcutsOptions {
    onCommandPaletteOpen?: () => void;
    onFocusModeToggle?: () => void;
}

export function useKeyboardShortcuts({
    onCommandPaletteOpen,
    onFocusModeToggle
}: KeyboardShortcutsOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ignore if user is typing in an input
        const target = e.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            // Only allow Escape in inputs for focus mode
            if (e.key === 'Escape' && onFocusModeToggle) {
                onFocusModeToggle();
            }
            return;
        }

        // Ctrl/Cmd + K: Command Palette
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            onCommandPaletteOpen?.();
        }

        // Ctrl/Cmd + N: New entry (today)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            router.push(`/entry/${format(new Date(), 'yyyy-MM-dd')}`);
        }

        // Ctrl/Cmd + F: Search (when not in input)
        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.shiftKey) {
            // Only prevent if we're going to handle it
            if (pathname !== '/search') {
                e.preventDefault();
                router.push('/search');
            }
        }

        // Ctrl/Cmd + ,: Settings
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            router.push('/settings');
        }

        // F11: Toggle focus mode (on entry pages)
        if (e.key === 'F11' && pathname.startsWith('/entry/')) {
            e.preventDefault();
            onFocusModeToggle?.();
        }

        // Escape: Exit focus mode
        if (e.key === 'Escape' && onFocusModeToggle) {
            onFocusModeToggle();
        }

    }, [router, pathname, onCommandPaletteOpen, onFocusModeToggle]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Hook to manage command palette state
 */
export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    // Global Ctrl+K listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    return { isOpen, open, close, toggle };
}
