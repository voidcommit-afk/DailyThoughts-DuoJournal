'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/core';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const [isCollapsed, setIsCollapsed] = useState(false);

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
            <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] text-white">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-8 h-8 animate-spin text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Entering Sanctuary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col lg:flex-row overflow-hidden touch-manipulation">
            {/* Sidebar */}
            <aside
                className={`hidden lg:flex flex-col h-screen border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl z-50 sticky top-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}
            >
                {/* Branding */}
                <div className="p-6 pt-8 flex items-center justify-between overflow-hidden">
                    <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center border border-[#D4AF37]/20 shrink-0">
                            <span className="text-[#D4AF37] text-xl font-bold font-serif">DT</span>
                        </div>
                        {!isCollapsed && (
                            <span className="font-serif text-xl font-bold text-white tracking-tight whitespace-nowrap">
                                DailyThoughts
                            </span>
                        )}
                    </Link>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[#D4AF37] text-[#0A0F1E] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 z-50 border-2 border-[#0A0F1E]"
                >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <nav className="flex-1 px-3 mt-8 space-y-2">
                    <NavButton
                        href="/dashboard"
                        icon="journal"
                        collapsed={isCollapsed}
                        isActive={pathname === '/dashboard' || pathname.startsWith('/dashboard/entry')}
                    >
                        Your Space
                    </NavButton>
                    <NavButton
                        href="/dashboard/partner"
                        icon="partner"
                        collapsed={isCollapsed}
                        isActive={pathname.startsWith('/dashboard/partner')}
                    >
                        Partner
                    </NavButton>
                    <NavButton
                        href="/dashboard/search"
                        icon="search"
                        collapsed={isCollapsed}
                        isActive={pathname === '/dashboard/search'}
                    >
                        Search
                    </NavButton>
                    <NavButton
                        href="/dashboard/calendar"
                        icon="calendar"
                        collapsed={isCollapsed}
                        isActive={pathname === '/dashboard/calendar'}
                    >
                        Calendar
                    </NavButton>
                    <NavButton
                        href="/dashboard/settings"
                        icon="settings"
                        collapsed={isCollapsed}
                        isActive={pathname === '/dashboard/settings'}
                    >
                        Settings
                    </NavButton>
                </nav>

                {/* Logout Button */}
                <div className="px-3 mb-4">
                    <button
                        onClick={async () => {
                            const promise = fetch('/api/auth/signout', { method: 'POST' });
                            toast.promise(promise, {
                                loading: 'Signing out...',
                                success: () => {
                                    router.push('/');
                                    router.refresh();
                                    return 'Signed out successfully';
                                },
                                error: 'Failed to sign out',
                            });
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 group relative ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <div className="shrink-0 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        {!isCollapsed && <span className="font-bold text-sm tracking-wide">Sign Out</span>}

                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] shadow-xl">
                                Sign Out
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            {/* Mobile Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--glass-bg)] backdrop-blur-2xl border-t border-[var(--glass-border)] z-50 safe-area-inset-bottom">
                <div className="flex justify-around items-center h-20 px-2 pb-safe">
                    <MobileNavButton
                        key="journal"
                        href={`/dashboard/entry/${new Date().toISOString().split('T')[0]}`}
                        icon="journal"
                        isActive={pathname === '/dashboard' || pathname.startsWith('/dashboard/entry')}
                    >
                        Journal
                    </MobileNavButton>
                    <MobileNavButton
                        key="partner"
                        href="/dashboard/partner"
                        icon="partner"
                        emoji={user?.partnerEmoji || undefined}
                        isActive={pathname.startsWith('/dashboard/partner')}
                    >
                        Partner
                    </MobileNavButton>
                    <MobileNavButton
                        key="search"
                        href="/dashboard/search"
                        icon="search"
                        isActive={pathname === '/dashboard/search'}
                    >
                        Search
                    </MobileNavButton>
                    <MobileNavButton
                        key="settings"
                        href="/dashboard/settings"
                        icon="settings"
                        isActive={pathname === '/dashboard/settings'}
                    >
                        Settings
                    </MobileNavButton>
                </div>
            </nav>
        </div>
    );
}

function NavButton({ href, icon, children, emoji, collapsed, isActive }: { href: string; icon: string; children: React.ReactNode; emoji?: string; collapsed?: boolean; isActive?: boolean }) {
    return (
        <Link
            href={href}
            className={`nav-item w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${collapsed ? 'justify-center px-0' : ''} ${isActive ? 'bg-white/10 text-white shadow-lg shadow-black/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#D4AF37]' : 'group-hover:scale-110'} ${collapsed ? '' : 'shrink-0'}`}>
                {emoji ? (
                    <span className="text-xl leading-none">{emoji}</span>
                ) : (
                    <NavIcon type={icon} />
                )}
            </div>
            {!collapsed && (
                <span className={`font-bold text-sm tracking-wide transition-colors whitespace-nowrap overflow-hidden ${isActive ? 'text-white' : ''}`}>
                    {children}
                </span>
            )}

            {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-[#D4AF37] text-[#0A0F1E] text-xs font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] shadow-xl">
                    {children}
                </div>
            )}
        </Link>
    );
}

function MobileNavButton({ href, icon, children, emoji, isActive }: { href: string; icon: string; children: React.ReactNode; emoji?: string; isActive?: boolean }) {
    return (
        <Link href={href} className={`mob-nav-item flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-300'}`}>
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {emoji ? (
                    <span className="text-xl leading-none">{emoji}</span>
                ) : (
                    <NavIcon type={icon} />
                )}
            </div>
            <span className={`text-[10px] font-bold mt-1 ${isActive ? 'font-black' : ''}`}>{children}</span>
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
        search: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    };
    return icons[type as keyof typeof icons] || null;
}
