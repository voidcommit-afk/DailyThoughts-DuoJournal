'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/core';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/user');
                const data = await res.json();

                if (!data.user) {
                    router.push('/login');
                    return;
                }
                setUser(data.user);

                // Load theme settings
                if (data.user) {
                    theme.loadUserSettings({
                        id: data.user.id,
                        name: data.user.name,
                        display_name: data.user.displayName, // API returns displayName
                        emoji: data.user.emoji,
                        username: data.user.username,
                        theme: data.user.theme,
                        primary_color: data.user.primaryColor, // API returns primaryColor
                        accent_color: data.user.accentColor,
                        background_color: data.user.backgroundColor,
                        font_family: data.user.fontFamily,
                        font_size: data.user.fontSize,
                        background_type: data.user.backgroundType,
                        background_value: data.user.backgroundValue,
                        background_blur: data.user.backgroundBlur,
                    });
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-400 text-sm">Loading your space...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col lg:flex-row overflow-hidden touch-manipulation">
            <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md z-50 sticky top-0 overflow-y-auto">
                <div className="p-8">
                    <h1 className="font-serif text-2xl font-bold tracking-tight">
                        Daily<span className="text-rose-400">Thoughts</span>.
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavButton href="/dashboard" icon="journal">Today's Entry</NavButton>
                    <NavButton href="/dashboard/partner" icon="partner">Partner Space</NavButton>
                    <NavButton href="/dashboard/calendar" icon="calendar">Calendar</NavButton>
                    <NavButton href="/dashboard/settings" icon="settings">Settings</NavButton>
                </nav>

                <div className="p-6 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] flex items-center justify-center text-xl">
                            {user?.emoji || '😊'}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-[var(--text-primary)]">{user?.display_name || 'User'}</p>
                            <p className="text-xs text-[var(--muted)] font-medium">
                                {user?.partner_id ? 'Coupled' : 'Private Journal'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--glass-bg)] backdrop-blur-xl border-t border-[var(--glass-border)] z-50 safe-area-inset-bottom">
                <div className="flex justify-around items-center h-16 px-2 pb-safe">
                    <MobileNavButton href="/dashboard" icon="journal">Today</MobileNavButton>
                    <MobileNavButton href="/dashboard/partner" icon="partner">Partner</MobileNavButton>
                    <MobileNavButton href="/dashboard/calendar" icon="calendar">Calendar</MobileNavButton>
                    <MobileNavButton href="/dashboard/settings" icon="settings">Settings</MobileNavButton>
                </div>
            </nav>
        </div>
    );
}

function NavButton({ href, icon, children, emoji }: { href: string; icon: string; children: React.ReactNode; emoji?: string }) {
    return (
        <Link
            href={href}
            className="nav-item w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
            {emoji ? (
                <span className="text-xl leading-none">{emoji}</span>
            ) : (
                <NavIcon type={icon} />
            )}
            <span className="font-medium">{children}</span>
        </Link>
    );
}

function MobileNavButton({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="mob-nav-item flex flex-col items-center justify-center w-full h-full text-slate-400">
            <NavIcon type={icon} />
            <span className="text-[10px] font-bold mt-1">{children}</span>
        </Link>
    );
}

function NavIcon({ type }: { type: string }) {
    const icons = {
        journal: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
        partner: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        calendar: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        settings: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    };
    return icons[type as keyof typeof icons] || null;
}
