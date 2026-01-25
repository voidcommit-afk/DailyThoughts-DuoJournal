'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { AudioPlayer } from '@/components/VoiceRecorder';
import ImageLightbox from '@/components/ImageLightbox';

interface Entry {
    id: string;
    date: string;
    content: string;
    mood?: string;
    weather?: string;
    images?: string[];
    audio_notes?: string[];
}

export default function CalendarPage() {
    const [viewDate, setViewDate] = useState(new Date());
    const [userEntries, setUserEntries] = useState<Entry[]>([]);
    const [partnerEntries, setPartnerEntries] = useState<Entry[]>([]);
    const [user, setUser] = useState<any>(null);
    const [partner, setPartner] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [lightbox, setLightbox] = useState<{ isOpen: boolean; images: string[]; index: number }>({
        isOpen: false,
        images: [],
        index: 0
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const userRes = await fetch('/api/auth/user');
            const userData = await userRes.json();

            if (userData.user) {
                setUser(userData.user);

                const start = format(startOfMonth(viewDate), 'yyyy-MM-dd');
                const end = format(endOfMonth(viewDate), 'yyyy-MM-dd');

                // Fetch User Entries
                const uRes = await fetch(`/api/entries?startDate=${start}&endDate=${end}`);
                const uData = await uRes.json();
                setUserEntries(uData.entries || []);

                // Fetch Partner Entries if applicable
                if (userData.user.partnerId) {
                    const pRes = await fetch(`/api/entries?userId=${userData.user.partnerId}&startDate=${start}&endDate=${end}`);
                    const pData = await pRes.json();
                    setPartnerEntries(pData.entries || []);

                    // Also try to get partner display name (custom endpoint or logic)
                    // For now we'll use a placeholder or check if it was included
                    setPartner({ display_name: 'Partner' }); // Fallback
                }
            }
        } catch (err) {
            console.error('Failed to load calendar data:', err);
            toast.error("Failed to load your journal rhythm.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [viewDate]);

    const goToPreviousMonth = () => setViewDate(subMonths(viewDate, 1));
    const goToNextMonth = () => setViewDate(addMonths(viewDate, 1));

    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);

    // Padding for the grid
    const calendarGrid = [...Array(startDay).fill(null), ...days];

    const getEntryForDate = (date: Date, entries: Entry[]) => {
        return entries.find(e => isSameDay(new Date(e.date), date));
    };

    const getDayStyle = (date: Date) => {
        const hasUser = getEntryForDate(date, userEntries);
        const hasPartner = getEntryForDate(date, partnerEntries);

        if (hasUser && hasPartner) return 'bg-[#D4AF37] text-[#0A0F1E] shadow-[0_0_15px_rgba(212,175,55,0.4)] ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[var(--bg-primary)]';
        if (hasUser) return 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30';
        if (hasPartner) return 'bg-[#1e1b4b] text-white border border-[#312e81] shadow-lg';
        return 'bg-white/5 text-slate-600 hover:bg-white/10';
    };

    const selectedEntry = selectedDate ? {
        user: getEntryForDate(selectedDate, userEntries),
        partner: getEntryForDate(selectedDate, partnerEntries)
    } : null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-white selection:bg-[#D4AF37]/30">
            <main className="pt-12 pb-32 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="space-y-12">
                        {/* Month Selector */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-serif italic text-white flex items-center gap-4">
                                {format(viewDate, 'MMMM')}
                                <span className="text-slate-600 not-italic font-sans text-xl">{format(viewDate, 'yyyy')}</span>
                            </h1>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="hover:bg-white/5">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-white/5">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 sm:gap-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                                    {d}
                                </div>
                            ))}
                            {calendarGrid.map((day, i) => (
                                <div key={i} className="aspect-square">
                                    {day ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedDate(day)}
                                            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition-all relative overflow-hidden ${getDayStyle(day)}`}
                                        >
                                            {format(day, 'd')}
                                            {getEntryForDate(day, userEntries) && getEntryForDate(day, partnerEntries) && (
                                                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--bg-primary)] rounded-full animate-pulse" />
                                            )}
                                        </motion.button>
                                    ) : (
                                        <div className="w-full h-full" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40" />
                                {user?.display_name || 'You'}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-[#1e1b4b] border border-[#312e81]" />
                                {partner?.display_name || 'Partner'}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>

            {/* Sanctuary Drawer */}
            <AnimatePresence>
                {selectedDate && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDate(null)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#0D1224] border-t border-white/5 rounded-t-[40px] z-50 overflow-y-auto no-scrollbar shadow-2xl"
                        >
                            <div className="sticky top-0 bg-[#0D1224]/80 backdrop-blur-3xl px-8 py-6 flex justify-between items-center border-b border-white/5">
                                <div>
                                    <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-1">
                                        Sanctuary Log
                                    </h3>
                                    <p className="font-serif text-2xl italic text-white">{format(selectedDate, 'EEEE, MMMM do')}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="rounded-full hover:bg-white/5">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </div>

                            <div className="p-8 space-y-12">
                                {/* User Entry */}
                                {selectedEntry?.user ? (
                                    <div className="space-y-6">
                                        <div className="flex items-baseline justify-between">
                                            <h4 className="text-xl font-serif text-white italic">Your Thoughts</h4>
                                            <div className="flex gap-4 text-xl">
                                                <span>{selectedEntry.user.mood}</span>
                                                <span>{selectedEntry.user.weather}</span>
                                            </div>
                                        </div>
                                        <div className="text-slate-400 font-light leading-relaxed text-lg italic bg-white/5 p-8 rounded-[32px] border border-white/5">
                                            "{selectedEntry.user.content}"
                                        </div>
                                        {selectedEntry.user.images && selectedEntry.user.images.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                {selectedEntry.user.images.map((img, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setLightbox({ isOpen: true, images: selectedEntry.user!.images!, index: i })}
                                                        className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-white/10"
                                                    >
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                        {selectedEntry.user.audio_notes && selectedEntry.user.audio_notes.length > 0 && (
                                            <div className="space-y-3">
                                                {selectedEntry.user.audio_notes.map((src, i) => (
                                                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                                        <AudioPlayer src={src} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 opacity-30 italic font-light text-slate-500">
                                        No entry from you on this day.
                                    </div>
                                )}

                                {/* Partner Entry */}
                                {selectedEntry?.partner && (
                                    <div className="space-y-6 pt-12 border-t border-white/5">
                                        <div className="flex items-baseline justify-between">
                                            <h4 className="text-xl font-serif text-slate-500 italic">Partner's Reflection</h4>
                                            <div className="flex gap-4 text-xl">
                                                <span>{selectedEntry.partner.mood}</span>
                                                <span>{selectedEntry.partner.weather}</span>
                                            </div>
                                        </div>
                                        <div className="text-slate-500 font-light leading-relaxed text-lg italic bg-white/5 p-8 rounded-[32px] border border-white/5">
                                            "{selectedEntry.partner.content}"
                                        </div>
                                        {selectedEntry.partner.images && selectedEntry.partner.images.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                {selectedEntry.partner.images.map((img, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setLightbox({ isOpen: true, images: selectedEntry.partner!.images!, index: i })}
                                                        className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-white/10 opacity-60 hover:opacity-100 transition-opacity"
                                                    >
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                        {selectedEntry.partner.audio_notes && selectedEntry.partner.audio_notes.length > 0 && (
                                            <div className="space-y-3">
                                                {selectedEntry.partner.audio_notes.map((src, i) => (
                                                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 opacity-60 hover:opacity-100 transition-opacity">
                                                        <AudioPlayer src={src} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ImageLightbox
                isOpen={lightbox.isOpen}
                images={lightbox.images}
                initialIndex={lightbox.index}
                onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
