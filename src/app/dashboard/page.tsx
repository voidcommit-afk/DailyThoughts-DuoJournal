'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceSwitcher from '@/components/SpaceSwitcher';
import PartnerInviteDialog from '@/components/PartnerInviteDialog';
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
    const [activeSpace, setActiveSpace] = useState<'solo' | 'shared'>('solo');
    const [privateNote, setPrivateNote] = useState('');
    const [showPrivateNotes, setShowPrivateNotes] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const privateNoteRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    // Load private notes from localStorage
    useEffect(() => {
        const savedNote = localStorage.getItem('dailythoughts_private_note');
        if (savedNote) setPrivateNote(savedNote);
    }, []);

    // Save private notes to localStorage
    useEffect(() => {
        localStorage.setItem('dailythoughts_private_note', privateNote);
    }, [privateNote]);

    // EXISTING LOGIC: Fetch user and entries data (unchanged)
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
                    setStreak(12); // Mock streak for now

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

    // EXISTING LOGIC: Save entry (unchanged)
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
            if (editorRef.current) editorRef.current.innerText = '';
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

    // EXISTING LOGIC: Entry display logic (unchanged)
    const displayedEntries = activeSpace === 'solo'
        ? entries
        : [...entries, ...partnerEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-24">
            {/* Header */}
            <header className="flex-none sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 py-4 border-b border-white/5 flex justify-between items-center transition-colors">
                <div>
                    <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{formatDate()}</h2>
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

            {/* Space Switcher Section */}
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
                <SpaceSwitcher
                    activeSpace={activeSpace}
                    onSpaceChange={setActiveSpace}
                    hasPartner={!!user?.partnerId}
                    userEmoji={user?.emoji || '✨'}
                    partnerEmoji={user?.partnerEmoji || '💫'}
                />

                {!user?.partnerId && (
                    <PartnerInviteDialog
                        onInviteCreated={(code, relationship) => {
                            console.log('Created invite:', code, relationship);
                        }}
                        onInviteJoined={(code) => {
                            console.log('Joined with code:', code);
                        }}
                    />
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-6">
                {/* Mood & Weather Selector */}
                <AnimatePresence mode="wait">
                    {activeSpace === 'solo' && (
                        <motion.div
                            key="mood-selector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="glass-panel rounded-[24px] p-5"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">How are you feeling?</label>
                                    <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
                                        {['😊', '😐', '😢', '😠', '🥳'].map((emoji) => (
                                            <motion.button
                                                key={emoji}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => selectMood(emoji)}
                                                className={`min-w-[44px] h-11 rounded-full border-2 transition-all duration-300 text-lg flex items-center justify-center ${mood === emoji
                                                        ? 'border-rose-400 bg-gradient-to-br from-rose-500/20 to-pink-500/20 shadow-lg shadow-rose-500/30 scale-110'
                                                        : 'border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                {emoji}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Weather</label>
                                    <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
                                        {['🌞', '⛅', '🌧️', '❄️'].map((emoji) => (
                                            <motion.button
                                                key={emoji}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => selectWeather(emoji)}
                                                className={`min-w-[44px] h-11 rounded-full border-2 transition-all duration-300 text-lg flex items-center justify-center ${weather === emoji
                                                        ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/30 scale-110'
                                                        : 'border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                {emoji}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Private Notes Section (Shared Space Only) */}
                <AnimatePresence mode="wait">
                    {activeSpace === 'shared' && (
                        <motion.div
                            key="private-notes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="glass-panel rounded-[24px] overflow-hidden"
                        >
                            {/* Collapsible Header */}
                            <motion.button
                                onClick={() => setShowPrivateNotes(!showPrivateNotes)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                whileTap={{ scale: 0.995 }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">🔒</span>
                                    <div>
                                        <h3 className="font-medium text-white text-sm">Private Notes</h3>
                                        <p className="text-xs text-slate-400">Only visible to you</p>
                                    </div>
                                </div>
                                <motion.svg
                                    animate={{ rotate: showPrivateNotes ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </motion.button>

                            {/* Collapsible Content */}
                            <AnimatePresence>
                                {showPrivateNotes && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 pt-2 border-t border-white/5">
                                            <textarea
                                                ref={privateNoteRef}
                                                value={privateNote}
                                                onChange={(e) => setPrivateNote(e.target.value)}
                                                placeholder="Write private notes here... These won't be shared with anyone."
                                                className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs text-slate-500">
                                                    {privateNote.split(/\s+/).filter(w => w).length} words • Saved locally
                                                </span>
                                                {privateNote && (
                                                    <button
                                                        onClick={() => {
                                                            setPrivateNote('');
                                                            localStorage.removeItem('dailythoughts_private_note');
                                                        }}
                                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Clear notes
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Editor */}
                <AnimatePresence mode="wait">
                    {activeSpace === 'solo' && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="glass-panel rounded-[24px] p-1 sm:p-2 min-h-[300px] flex flex-col"
                        >
                            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-1">
                                <button
                                    onClick={() => document.execCommand('bold', false)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-800 font-bold text-slate-400 transition"
                                >
                                    B
                                </button>
                                <button
                                    onClick={() => document.execCommand('italic', false)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-800 italic font-serif text-slate-400 transition"
                                >
                                    I
                                </button>
                                <div className="w-px h-4 bg-slate-700 mx-1" />
                                <button
                                    onClick={() => document.execCommand('insertUnorderedList', false)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 transition flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={(e) => setContent(e.currentTarget.innerText)}
                                className="flex-1 w-full outline-none bg-transparent font-handwriting text-2xl sm:text-3xl text-slate-200 leading-loose p-5 overflow-y-auto cursor-text"
                                style={{ minHeight: '200px' }}
                                suppressContentEditableWarning
                            >
                                {content || ''}
                            </div>
                            <div className="px-5 pb-3 text-[10px] text-slate-400 font-medium text-right">
                                {content.split(/\s+/).filter(w => w).length} words
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button */}
                <AnimatePresence mode="wait">
                    {activeSpace === 'solo' && (
                        <motion.div
                            key="save-button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex justify-end pt-4"
                        >
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !content.trim()}
                                size="lg"
                            >
                                {isSaving ? 'Saving...' : 'Save Entry'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Entries List */}
                {displayedEntries.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4 pt-8"
                    >
                        <h2 className="text-xl font-serif font-bold text-white">
                            {activeSpace === 'solo' ? 'Recent Entries' : 'Shared Journey'}
                        </h2>
                        <div className="grid gap-4">
                            {displayedEntries.map((entry, index) => {
                                const isPartner = activeSpace === 'shared' && !entries.find(e => e.id === entry.id);
                                return (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className={`glass-panel p-6 rounded-2xl hover:border-slate-700 transition group ${isPartner ? 'border-purple-500/20 bg-purple-500/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-sm font-medium ${isPartner ? 'text-purple-400' : 'text-blue-400'}`}>
                                                {new Date(entry.date).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            {isPartner && <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">Partner</span>}
                                        </div>
                                        <p className="text-slate-200 whitespace-pre-wrap line-clamp-3 font-serif">{entry.content}</p>
                                        {entry.images && entry.images.length > 0 && (
                                            <div className="mt-4">
                                                <div className="text-xs px-2 py-1 bg-slate-800 rounded inline-block text-slate-300">
                                                    📷 {entry.images.length} Image{entry.images.length > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && displayedEntries.length === 0 && !content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl"
                    >
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl">✨</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
                        <p className="text-slate-400 max-w-sm">
                            {activeSpace === 'solo' ? 'Start writing above to capture your first moment.' : 'Your shared timeline is empty.'}
                        </p>
                    </motion.div>
                )}
            </div>

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
