'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Entry {
    id: string;
    content: string;
    date: string;
    mood?: string;
    weather?: string;
    isPartner?: boolean;
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch('/api/auth/user').then(res => res.json()).then(data => setUser(data.user));
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            // Fetch User Entries
            const userRes = await fetch(`/api/entries?q=${encodeURIComponent(query)}`);
            const userData = await userRes.json();
            const uEntries = (userData.entries || []).map((e: any) => ({ ...e, isPartner: false }));

            // Fetch Partner Entries if applicable
            let pEntries: Entry[] = [];
            if (user?.partnerId) {
                const partnerRes = await fetch(`/api/entries?userId=${user.partnerId}&q=${encodeURIComponent(query)}`);
                const partnerData = await partnerRes.json();
                pEntries = (partnerData.entries || []).map((e: any) => ({ ...e, isPartner: true }));
            }

            // Combine and sort
            const combined = [...uEntries, ...pEntries].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setResults(combined);
            if (combined.length === 0) {
                toast.info("No shared memories found for that query.");
            }
        } catch (err) {
            console.error('Search failed:', err);
            toast.error("Failed to search entries.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-6 pb-32">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif italic text-white leading-tight">Search Memories.</h1>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
                        Rediscover your shared journey.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search by keywords, moods, or moments..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-16 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:bg-white/10 transition-all placeholder:text-slate-600 focus:ring-[#D4AF37]/50"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 w-16 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0F1E] rounded-2xl shrink-0 transition-transform active:scale-95 shadow-xl"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-[#0A0F1E]/30 border-t-[#0A0F1E] rounded-full animate-spin" />
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="space-y-6 pt-6">
                    <AnimatePresence mode="popLayout">
                        {results.map((entry, idx) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-6 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group ${entry.isPartner ? 'ring-1 ring-[#D4AF37]/10' : ''}`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">
                                            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        {entry.isPartner && (
                                            <span className="text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                                Partner
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 text-lg">
                                        <span>{entry.mood}</span>
                                        <span>{entry.weather}</span>
                                    </div>
                                </div>
                                <div
                                    className="text-slate-300 font-serif leading-relaxed line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity"
                                    dangerouslySetInnerHTML={{ __html: entry.content }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {!isLoading && results.length === 0 && query && (
                        <div className="text-center py-20 opacity-30 italic font-light text-slate-500">
                            No shared history matches your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
