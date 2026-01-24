'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiPicker, ProfileEditor, ThemeSelector, FontSelector, useTheme } from '@/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [emoji, setEmoji] = useState('😊');
    const [dailyGoal, setDailyGoal] = useState(500);
    const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'account'>('profile');

    const { saveSettings } = useTheme();
    const router = useRouter();

    // Fetch user data
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/user');
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                    setDisplayName(data.user.display_name || '');
                    setEmoji(data.user.emoji || '😊');
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        }
        fetchUser();
    }, []);

    // EXISTING LOGIC: Save user settings (unchanged)
    const handleSave = async (updates: any) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                await saveSettings();
                router.refresh();
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    const sections = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'appearance', label: 'Appearance', icon: '🎨' },
        { id: 'account', label: 'Account', icon: '🔐' },
    ] as const;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-24">
            {/* Header */}
            <header className="flex-none sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-4 border-b border-white/5">
                <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate()}</h2>
                <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Settings</h1>
            </header>

            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 py-4">
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 gap-1">
                    {sections.map((section) => (
                        <motion.button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                ? 'bg-slate-800 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="mr-1.5">{section.icon}</span>
                            <span className="hidden sm:inline">{section.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-40 lg:pb-12 space-y-6 no-scrollbar">
                <AnimatePresence mode="wait">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-white mb-6">Profile Settings</h2>
                                <ProfileEditor
                                    displayName={displayName}
                                    setDisplayName={setDisplayName}
                                    emoji={emoji}
                                    setEmoji={setEmoji}
                                    dailyGoal={dailyGoal}
                                    setDailyGoal={setDailyGoal}
                                />
                                <div className="flex justify-end pt-6">
                                    <Button
                                        onClick={() => handleSave({ display_name: displayName, emoji })}
                                        disabled={isSaving}
                                        size="lg"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Profile'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Appearance Section */}
                    {activeSection === 'appearance' && (
                        <motion.div
                            key="appearance"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-white mb-6">Theme</h2>
                                <ThemeSelector />
                            </div>

                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-white mb-6">Typography</h2>
                                <FontSelector />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => saveSettings()}
                                    disabled={isSaving}
                                    size="lg"
                                >
                                    Save Appearance
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Account Section */}
                    {activeSection === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-white mb-6">Account Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-white">Email</p>
                                            <p className="text-sm text-slate-400">{user?.email || 'Loading...'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-white">Account Status</p>
                                            <p className="text-sm text-emerald-400">Active</p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/20">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-white mb-4">Security</h2>
                                <p className="text-sm text-slate-400 mb-4">Manage your account security settings</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/auth/update-password')}
                                        className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-left hover:bg-slate-800 transition group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-white">Change Password</p>
                                                <p className="text-sm text-slate-400">Update your login password</p>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="glass-panel rounded-[24px] p-6">
                                <h2 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h2>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={async () => {
                                        await fetch('/api/auth/signout', { method: 'POST' });
                                        router.push('/');
                                        router.refresh();
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
