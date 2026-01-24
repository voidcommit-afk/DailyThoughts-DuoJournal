'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    // Don't show on login or landing page
    if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/auth')) {
        return null;
    }

    const navItems: NavItem[] = [
        {
            id: 'journal',
            label: 'Journal',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            path: '/dashboard',
        },
        {
            id: 'search',
            label: 'Search',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            path: '/search', // We might need to implement this page
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            path: '/dashboard/settings',
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--background)]/95 backdrop-blur-lg border-t border-[var(--border)] pb-safe">
            <div className="flex items-center justify-around px-2 py-1">
                {navItems.map((item) => {
                    const active = pathname === item.path;
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] p-2 rounded-xl transition-colors ${active
                                ? 'text-[var(--primary)]'
                                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                            whileTap={{ scale: 0.9 }}
                        >
                            {item.icon}
                            <span className="text-xs mt-0.5 font-medium">{item.label}</span>
                            {active && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--primary)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
}
