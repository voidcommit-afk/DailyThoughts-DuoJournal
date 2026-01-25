'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Entry {
    id: string;
    content: string;
    date: string;
    images?: string[];
}

export default function PartnerPage() {
    const [user, setUser] = useState<any>(null);
    const [partnerEntries, setPartnerEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [partnerCode, setPartnerCode] = useState('');
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/auth/user');
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                    if (data.user.partnerId) {
                        const entriesRes = await fetch(`/api/entries?userId=${data.user.partnerId}&limit=20`);
                        const entriesData = await entriesRes.json();
                        if (entriesData.entries) {
                            setPartnerEntries(entriesData.entries);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const copyCode = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id);
            alert('Invite code copied to clipboard!');
        }
    };

    const handleConnect = async () => {
        if (!partnerCode.trim()) return;
        setInviteStatus('loading');

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partner_id: partnerCode }),
            });

            if (!res.ok) throw new Error('Failed to connect partner');

            setInviteStatus('success');
            setStatusMessage('Partner connected successfully! Refreshing...');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setInviteStatus('error');
            setStatusMessage('Invalid code or connection failed.');
        }
    };

    const formatDateHeader = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-rose-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            <header className="flex-none sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-800">
                <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDateHeader()}</h2>
                <h1 className="font-serif text-2xl font-bold text-white">
                    {user?.partner_id ? 'Partner Space' : 'Connect'}
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40 lg:pb-12 space-y-8 no-scrollbar">
                {user?.partner_id ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Partner Profile Card */}
                        <div className="glass-panel p-6 rounded-[24px] flex items-center gap-4 border border-rose-500/20 bg-rose-500/5">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl shadow-lg border border-white/5">
                                {user.partnerEmoji || '💫'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Your Partner</h2>
                                <p className="text-sm text-slate-400">Sharing the journey together</p>
                            </div>
                        </div>

                        {/* Partner Feed */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif font-bold text-white px-2">Partner's Timeline</h3>
                            {partnerEntries.length > 0 ? (
                                <div className="grid gap-4">
                                    {partnerEntries.map((entry, index) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            className="glass-panel p-6 rounded-2xl border-purple-500/20 bg-purple-500/5"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-sm font-medium text-purple-400">
                                                    {new Date(entry.date).toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div
                                                className="text-slate-200 whitespace-pre-wrap font-serif prose prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: entry.content }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                                    <p className="text-slate-400">No entries from your partner yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel rounded-[32px] p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[50vh] max-w-md mx-auto">
                        <div className="w-16 h-16 bg-slate-800 rounded-full shadow-md mb-6 flex items-center justify-center text-3xl border border-white/5 italic">
                            ✨
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-white mb-4">Your Shared Space</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Welcome to DailyThoughts. Your shared space is currently being prepared by our concierge.
                        </p>
                        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-white/5 text-xs text-slate-500 italic">
                            Once your partner is connected, their timeline will appear here automatically.
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
