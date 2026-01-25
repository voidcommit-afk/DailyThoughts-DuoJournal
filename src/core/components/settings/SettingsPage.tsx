'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PillToggle from '../PillToggle';
import ThemeSelector from './ThemeSelector';
import FontSelector from './FontSelector';
import ProfileEditor from './ProfileEditor';
import { useTheme } from '../ThemeProvider';

const TABS = [
    { value: 'profile', label: '👤 Profile' },
    { value: 'appearance', label: '🎨 Theme' },
    { value: 'typography', label: '🔤 Fonts' },
    { value: 'account', label: '🔐 Account' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const theme = useTheme();

    // Profile state
    const [displayName, setDisplayName] = useState('');
    const [emoji, setEmoji] = useState('❤️');
    const [dailyGoal, setDailyGoal] = useState(0);

    // Account state
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Fetch current settings
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();

                if (!data.success) {
                    router.push('/login');
                    return;
                }

                const d = data.data;
                setDisplayName(d.displayName || '');
                setEmoji(d.emoji || '❤️');
                setDailyGoal(d.dailyGoal || 0);

                // Load theme settings
                theme.loadUserSettings({
                    id: d.id,
                    name: d.name,
                    display_name: d.displayName,
                    emoji: d.emoji,
                    username: '',
                    theme: d.theme,
                    primary_color: d.primaryColor,
                    accent_color: d.accentColor,
                    background_color: d.backgroundColor,
                    font_family: d.fontFamily,
                    font_size: d.fontSize,
                    background_type: d.backgroundType,
                    background_value: d.backgroundValue,
                    background_blur: d.backgroundBlur,
                });
            } catch (err) {
                console.error('Fetch settings error:', err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Save profile & account settings
    const handleSaveProfile = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Save basic settings
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayName,
                    emoji,
                    username: username || undefined,
                    password: password || undefined,
                    currentPassword: currentPassword || undefined
                }),
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            // Save personalization settings
            const persRes = await fetch('/api/settings/personalization', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dailyGoal,
                    theme: theme.currentTheme,
                    primaryColor: theme.primaryColor,
                    accentColor: theme.accentColor,
                    backgroundColor: theme.backgroundColor,
                    fontFamily: theme.fontFamily,
                    fontSize: theme.fontSize,
                    backgroundType: theme.backgroundType,
                    backgroundValue: theme.backgroundValue,
                    backgroundBlur: theme.backgroundBlur,
                }),
            });
            const persData = await persRes.json();

            if (!persData.success) {
                throw new Error(persData.error);
            }

            setSuccess('Settings saved!');
            setCurrentPassword('');
            setPassword('');
            setUsername('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    // Auto-save theme settings when they change
    useEffect(() => {
        const timer = setTimeout(() => {
            theme.saveSettings();
        }, 1000); // Debounce for 1 second

        return () => clearTimeout(timer);
        // We only want to save when the actual values change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        theme.currentTheme,
        theme.primaryColor,
        theme.accentColor,
        theme.backgroundColor,
        theme.fontFamily,
        theme.fontSize,
        theme.backgroundType,
        theme.backgroundValue,
        theme.backgroundBlur
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[var(--background)]"
        >
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/journal')}
                            className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold">Settings</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Only show Save button for Profile and Account tabs */}
                        {(activeTab === 'profile' || activeTab === 'account') && (
                            <motion.button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    'Save Changes'
                                )}
                            </motion.button>
                        )}

                        {/* Automatic saving indicator for style tabs */}
                        {(activeTab === 'appearance' || activeTab === 'typography') && (
                            <span className="text-xs text-[var(--muted)] animate-pulse">
                                Changes saved automatically
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Status Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation */}
                <div className="mb-6 overflow-x-auto pb-2">
                    <PillToggle
                        options={TABS}
                        value={activeTab}
                        onChange={setActiveTab}
                        size="md"
                    />
                </div>

                {/* Tab Content */}
                <div className="card">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
                                <ProfileEditor
                                    displayName={displayName}
                                    setDisplayName={setDisplayName}
                                    emoji={emoji}
                                    setEmoji={setEmoji}
                                    dailyGoal={dailyGoal}
                                    setDailyGoal={setDailyGoal}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'appearance' && (
                            <motion.div
                                key="appearance"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-lg font-semibold mb-4">Theme & Colors</h2>
                                <ThemeSelector />
                            </motion.div>
                        )}

                        {activeTab === 'typography' && (
                            <motion.div
                                key="typography"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-lg font-semibold mb-4">Typography</h2>
                                <FontSelector />
                            </motion.div>
                        )}


                        {activeTab === 'account' && (
                            <motion.div
                                key="account"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-lg font-semibold mb-4">Account Security</h2>
                                <div className="space-y-6">
                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Change Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="input w-full focus-glow"
                                            placeholder="New username (optional)"
                                            minLength={3}
                                        />
                                        <p className="text-xs text-[var(--muted)] mt-1">Leave blank to keep current</p>
                                    </div>

                                    {/* Password Section */}
                                    <div className="pt-4 border-t border-[var(--border)]">
                                        <h3 className="text-sm font-medium mb-3">Change Password</h3>

                                        {/* Current Password */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="input w-full pr-10 focus-glow"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                                                >
                                                    {showCurrentPassword ? '🙈' : '👁️'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="input w-full pr-10 focus-glow"
                                                    placeholder="New password (min 6 characters)"
                                                    minLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                                                >
                                                    {showPassword ? '🙈' : '👁️'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-[var(--muted)] mt-1">
                                                Leave both password fields blank to keep current password
                                            </p>
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <div className="pt-4 border-t border-[var(--border)]">
                                        <button
                                            onClick={async () => {
                                                await fetch('/api/auth/logout', { method: 'POST' });
                                                router.push('/login');
                                            }}
                                            className="btn btn-danger"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Reset to Defaults Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            theme.resetToDefaults();
                            setSuccess('Theme reset to defaults');
                            setTimeout(() => setSuccess(''), 3000);
                        }}
                        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        Reset appearance to defaults
                    </button>
                </div>
            </main>
        </motion.div>
    );
}
