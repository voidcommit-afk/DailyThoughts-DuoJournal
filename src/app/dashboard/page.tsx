'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ImageLightbox from '@/components/ImageLightbox';
import { AudioPlayer } from '@/components/VoiceRecorder';

interface Entry {
    id: string;
    content: string;
    date: string;
    images?: string[];
    audio_notes?: string[];
}

export default function DashboardPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [partnerEntries, setPartnerEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const [lightbox, setLightbox] = useState<{ isOpen: boolean; images: string[]; index: number }>({
        isOpen: false,
        images: [],
        index: 0
    });
    const router = useRouter();

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
                toast.error("Failed to load sanctuary data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const formatDateHeader = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    const displayedEntries = [...entries, ...partnerEntries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-24 flex flex-col">
            {/* Header */}
            <header className="flex-none sticky top-0 z-30 bg-[var(--glass-bg)] backdrop-blur-xl px-4 sm:px-6 py-4 border-b border-[var(--glass-border)] flex justify-between items-center transition-colors">
                <div>
                    <h2 className="text-[10px] sm:text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-0.5">{formatDateHeader()}</h2>
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
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-2xl text-base font-black border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                    >
                        <span className="text-xl">🔥</span> {streak} Day Streak
                    </motion.div>
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
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#1e1b4b]/20 opacity-50 transition-opacity group-hover:opacity-100" />
                        <div className="relative p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/60 rounded-[31px]">
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">How was your day?</h2>
                                <p className="text-slate-400 text-sm">Capture your thoughts, feelings, and moments.</p>
                            </div>
                            <Button
                                className="bg-[#D4AF37] text-slate-950 font-black uppercase tracking-widest px-8 h-12 rounded-2xl hover:bg-[#D4AF37]/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                            >
                                Write Entry
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="px-4 sm:px-6 space-y-6 pt-10">
                    <AnimatePresence>
                        {/* Empty State: Only shown if 0 entries exist */}
                        {!isLoading && displayedEntries.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden p-12 rounded-[40px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-50" />
                                <div className="relative">
                                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 mx-auto text-3xl">✨</div>
                                    <h3 className="text-2xl font-serif italic text-white mb-3">A sacred silence awaits...</h3>
                                    <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                                        This is your shared sanctuary. When you're ready to capture a piece of your story, it will appear here for you and your partner to cherish.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Timeline */}
                    {displayedEntries.length > 0 && (
                        <div className="pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-14 text-center sm:text-left max-w-2xl"
                            >
                                <h3 className="text-[10px] sm:text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4 opacity-70">Your Sanctuary</h3>
                                <h2 className="text-4xl sm:text-5xl font-serif italic text-white leading-[1.1] tracking-tight">
                                    Welcome back to your <br className="hidden sm:block" />
                                    shared sanctuary. <br />
                                    <span className="text-slate-500 not-italic font-sans text-lg sm:text-xl font-light mt-5 block tracking-normal">Here are your recent reflections together.</span>
                                </h2>
                            </motion.div>

                            <div className="grid gap-6">
                                {displayedEntries.map((entry, index) => {
                                    const isPartner = !entries.some(e => e.id === entry.id);
                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            className={`relative p-8 rounded-[32px] border transition-all duration-300 group ${isPartner
                                                ? 'bg-[#1e1b4b]/20 border-[#1e1b4b] hover:bg-[#1e1b4b]/30'
                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isPartner ? 'text-[#a5b4fc]' : 'text-[#D4AF37]'}`}>
                                                        {isPartner ? 'Partner Space' : 'Your Thought'}
                                                    </span>
                                                    <span className="text-sm font-serif italic text-white opacity-60">
                                                        {new Date(entry.date).toLocaleDateString(undefined, {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="text-slate-300 whitespace-pre-wrap line-clamp-4 font-serif text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity"
                                                dangerouslySetInnerHTML={{ __html: entry.content }}
                                            />
                                            {entry.images && entry.images.length > 0 && (
                                                <div className="mt-6">
                                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                        {entry.images.map((img, i) => (
                                                            <motion.div
                                                                key={i}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setLightbox({ isOpen: true, images: entry.images!, index: i });
                                                                }}
                                                                className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border border-white/10 shadow-lg"
                                                            >
                                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2 text-[#D4AF37]/50 text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {entry.images.length} Captured Moment{entry.images.length > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            )}

                                            {entry.audio_notes && entry.audio_notes.length > 0 && (
                                                <div className="mt-6 space-y-3">
                                                    {entry.audio_notes.map((src, i) => (
                                                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <svg className="w-3 h-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                                                </svg>
                                                                <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">Voice Memo</span>
                                                            </div>
                                                            <AudioPlayer src={src} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ImageLightbox
                isOpen={lightbox.isOpen}
                images={lightbox.images}
                initialIndex={lightbox.index}
                onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
            />

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
