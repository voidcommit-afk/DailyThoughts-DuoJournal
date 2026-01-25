'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Entry {
    id: string;
    content: string;
    date: string;
    images?: string[];
    audio_notes?: string[];
}

export default function DashboardPage() {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [weather, setWeather] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [partnerEntries, setPartnerEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const editorRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // EXISTING LOGIC: Fetch user and entries data
    useEffect(() => {
        async function fetchData() {
            try {
                const [userRes, entriesRes] = await Promise.all([
                    fetch('/api/auth/user'),
                    fetch('/api/entries?limit=10'),
                ]);

                const userData = await userRes.json();
                const entriesData = await entriesRes.json();

                if (userData.user) {
                    setUser(userData.user);
                    if (userData.user.streak) {
                        setStreak(userData.user.streak);
                    }

                    // Fetch partner entries if partner exists
                    if (userData.user.partnerId) {
                        const partnerRes = await fetch(`/api/entries?userId=${userData.user.partnerId}&limit=10`);
                        const partnerData = await partnerRes.json();
                        if (partnerData.entries) {
                            setPartnerEntries(partnerData.entries);
                        }
                    }
                }
                if (entriesData.entries) {
                    setEntries(entriesData.entries);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // EXISTING LOGIC: Save entry
    const handleSave = async () => {
        if (!content.trim()) return;
        setIsSaving(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: today, content, images: [], audio_notes: [] }),
            });

            const entriesRes = await fetch('/api/entries?limit=10');
            const entriesData = await entriesRes.json();
            if (entriesData.entries) {
                setEntries(entriesData.entries);
            }

            setContent('');
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
        } catch (err) {
            console.error('Failed to save entry:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const selectMood = (emoji: string) => setMood(emoji);
    const selectWeather = (emoji: string) => setWeather(emoji);

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    // Combine and sort entries
    const displayedEntries = [...entries, ...partnerEntries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-24 flex flex-col">
            {/* Header */}
            <header className="flex-none sticky top-0 z-30 bg-[var(--glass-bg)] backdrop-blur-xl px-4 sm:px-6 py-4 border-b border-[var(--glass-border)] flex justify-between items-center transition-colors">
                <div>
                    <h2 className="text-[10px] sm:text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">{formatDate()}</h2>
                    <Link href="/dashboard" className="block focus:outline-none hover:opacity-80 transition-opacity">
                        <h1 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                            DailyThoughts
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-bold border border-orange-500/20"
                    >
                        🔥 {streak}
                    </motion.div>
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/signout', { method: 'POST' });
                            router.push('/');
                            router.refresh();
                        }}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition"
                        aria-label="Sign out"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full">
                <div className="px-4 sm:px-6 pt-6">
                    {/* Today's Entry CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group cursor-pointer overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/40 p-1"
                        onClick={() => router.push(`/dashboard/entry/${new Date().toISOString().split('T')[0]}`)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50 transition-opacity group-hover:opacity-100" />
                        <div className="relative p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/60 rounded-[31px]">
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">How was your day?</h2>
                                <p className="text-slate-400 text-sm">Capture your thoughts, feelings, and moments.</p>
                            </div>
                            <Button
                                className="bg-primary text-slate-950 font-black uppercase tracking-widest px-8 h-14 rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] group-hover:scale-105"
                            >
                                Write Entry
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="px-4 sm:px-6 space-y-6 pt-10">
                    <AnimatePresence>
                        {/* Persistent Welcome Message when User has no entries */}
                        {!isLoading && entries.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="relative overflow-hidden p-8 rounded-[32px] border border-primary/20 bg-primary/5 text-center group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                                <div className="relative">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-xl text-primary animate-pulse">✨</div>
                                    <h3 className="text-xl font-serif font-bold text-white mb-2">The space for your story is ready.</h3>
                                    <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                                        Whenever you&apos;re ready to share a piece of your day, your partner will be here to listen.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Timeline Heading */}
                    {displayedEntries.length > 0 && (
                        <div className="pt-4">
                            <h2 className="text-xl font-serif font-bold text-white mb-6">
                                Journey Timeline
                            </h2>
                            <div className="grid gap-4">
                                {displayedEntries.map((entry, index) => {
                                    const isPartner = !entries.find(e => e.id === entry.id);
                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            className={`glass-panel p-6 rounded-2xl hover:border-slate-700 transition group ${isPartner ? 'border-purple-500/20 bg-purple-500/5' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-sm font-medium ${isPartner ? 'text-purple-400' : 'text-primary'}`}>
                                                    {new Date(entry.date).toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                                {isPartner && <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full font-bold uppercase tracking-widest text-[8px]">Partner</span>}
                                            </div>
                                            <div
                                                className="text-slate-200 whitespace-pre-wrap line-clamp-3 font-serif prose prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: entry.content }}
                                            />
                                            {entry.images && entry.images.length > 0 && (
                                                <div className="mt-4 flex gap-2">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        📷 {entry.images.length} Photo{entry.images.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* True Empty State (No entries from anyone) */}
                    {!isLoading && displayedEntries.length === 0 && (
                        <div className="py-20 text-center opacity-40">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Silence is also a story...</p>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .font-handwriting {
                    font-family: var(--font-handwriting, 'Caveat'), cursive;
                }
                [contenteditable]:empty:before {
                    content: 'How did the world feel today?';
                    color: rgb(100, 116, 139);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
