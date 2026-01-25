'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import VoiceRecorder from '@/components/VoiceRecorder';
import { useTheme } from '@/core';

export default function EntryPage() {
    const params = useParams();
    const router = useRouter();
    const { primaryColor } = useTheme();

    const [user, setUser] = useState<any>(null);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [weather, setWeather] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [audioNotes, setAudioNotes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isSaved, setIsSaved] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedData = useRef<string>('');

    const dateStr = params.date as string;
    const dateObj = new Date(dateStr);

    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Load initial data and localStorage backup
    useEffect(() => {
        async function fetchData() {
            try {
                const [userRes, entryRes] = await Promise.all([
                    fetch('/api/auth/user'),
                    fetch(`/api/entries?startDate=${dateStr}&endDate=${dateStr}`)
                ]);

                const userData = await userRes.json();
                const entryData = await entryRes.json();

                if (userData.user) setUser(userData.user);

                let initialContent = '';
                let initialMood = '';
                let initialWeather = '';
                let initialImages: string[] = [];
                let initialAudioNotes: string[] = [];

                if (entryData.entries && entryData.entries.length > 0) {
                    const entry = entryData.entries[0];
                    initialContent = entry.content;
                    initialMood = entry.mood || '';
                    initialWeather = entry.weather || '';
                    initialImages = entry.images || [];
                    initialAudioNotes = entry.audioNotes || [];
                }

                // Check localStorage backup
                const backup = localStorage.getItem(`entry_backup_${dateStr}`);
                if (backup) {
                    const parsed = JSON.parse(backup);
                    // Only use backup if it's more recent or different and user confirms (simplifying for now: just use whichever has content)
                    if (!initialContent && parsed.content) {
                        initialContent = parsed.content;
                        initialMood = parsed.mood || initialMood;
                        initialWeather = parsed.weather || initialWeather;
                        initialImages = parsed.images || initialImages;
                        initialAudioNotes = parsed.audioNotes || initialAudioNotes;
                    }
                }

                setContent(initialContent);
                setMood(initialMood);
                setWeather(initialWeather);
                setImages(initialImages);
                setAudioNotes(initialAudioNotes);
                lastSavedData.current = JSON.stringify({ content: initialContent, mood: initialMood, weather: initialWeather, images: initialImages, audioNotes: initialAudioNotes });

                if (editorRef.current) {
                    editorRef.current.innerHTML = initialContent;
                }
            } catch (err) {
                console.error('Failed to fetch entry:', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [dateStr]);

    // Auto-save logic
    useEffect(() => {
        if (isLoading) return;

        const currentData = { content, mood, weather, images, audioNotes };
        const dataStr = JSON.stringify(currentData);

        // Update localStorage backup immediately
        localStorage.setItem(`entry_backup_${params.date}`, dataStr);

        // If data hasn't changed since last save, skip
        if (dataStr === lastSavedData.current) return;

        // Clear existing timeout
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setSaveStatus('idle');

        // Debounce: wait 1 second after change
        saveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus('saving');
            try {
                const res = await fetch('/api/entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: params.date,
                        ...currentData
                    })
                });

                if (res.ok) {
                    lastSavedData.current = dataStr;
                    setSaveStatus('saved');
                    // Remove backup on successful save
                    localStorage.removeItem(`entry_backup_${params.date}`);
                    setTimeout(() => setSaveStatus('idle'), 3000);
                } else {
                    setSaveStatus('error');
                }
            } catch (err) {
                setSaveStatus('error');
                console.error('Auto-save failed:', err);
            }
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [content, mood, weather, images, audioNotes, isLoading, params.date]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    content,
                    mood,
                    weather,
                    images,
                    audioNotes
                })
            });

            if (res.ok) {
                localStorage.removeItem(`entry_backup_${dateStr}`);
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Failed to save:', err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="w-8 h-8 border-2 border-slate-800 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="text-center">
                    <h1 className="text-base font-bold text-white leading-tight">{formattedDate}</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{dayName}</p>
                </div>

                <div className="flex items-center gap-2 min-w-[60px] justify-end">
                    {saveStatus === 'saving' && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Saving...</span>}
                    {saveStatus === 'saved' && <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Saved</span>}
                    {saveStatus === 'error' && <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Sync Error</span>}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                    <span className="text-sm leading-none">{user?.emoji || '🦄'}</span>
                    <span className="text-xs font-bold text-primary">{user?.display_name || 'Sanju'}'s Journal</span>
                </div>

                <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-slate-900/20 space-y-8">
                    {/* Mood Section */}
                    <section className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">How are you feeling?</label>
                        <div className="flex gap-3">
                            {['😊', '😐', '😢', '😠', '🥳'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl border-2 transition-all ${mood === m
                                        ? 'border-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20'
                                        : 'border-slate-800 bg-slate-800/20 hover:border-slate-700'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Weather Section */}
                    <section className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">What's the weather like?</label>
                        <div className="flex gap-3">
                            {['🌞', '⛅', '🌧️', '⛈️', '❄️'].map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setWeather(w)}
                                    className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl border-2 transition-all ${weather === w
                                        ? 'border-blue-400 bg-blue-400/10 scale-110 shadow-lg shadow-blue-400/20'
                                        : 'border-slate-800 bg-slate-800/20 hover:border-slate-700'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Write your thoughts...</label>
                        <div className="rounded-2xl border border-slate-800 bg-black/20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-1 bg-slate-900/40">
                                <button onClick={() => document.execCommand('bold', false)} className="w-8 h-8 rounded-lg hover:bg-slate-800 font-bold text-slate-400 transition">B</button>
                                <button onClick={() => document.execCommand('italic', false)} className="w-8 h-8 rounded-lg hover:bg-slate-800 italic font-serif text-slate-400 transition">I</button>
                            </div>
                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                className="min-h-[300px] p-6 outline-none font-sans text-lg text-slate-200 leading-relaxed cursor-text"
                                style={{ fontFamily: 'inherit' }}
                                data-placeholder="Start typing your heart out..."
                            />
                            <div className="px-6 py-3 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>{content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length} words</span>
                                {saveStatus === 'saved' && <span className="text-primary flex items-center gap-1">✓ Saved</span>}
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium italic">Use the toolbar or Ctrl+B for bold, Ctrl+I for italic</p>
                    </section>

                    {/* Media Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ImageUpload images={images} onImagesChange={setImages} maxImages={3} />
                        <VoiceRecorder audioNotes={audioNotes} onAudioChange={setAudioNotes} maxNotes={1} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 py-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                        className="flex-[2] py-4 bg-primary rounded-2xl text-slate-950 font-black uppercase tracking-widest hover:bg-primary/90 transition shadow-[0_0_20px_rgba(var(--primary),0.3)] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
                    >
                        {isSaving ? 'Saving...' : 'Finish Entry'}
                    </button>
                </div>
            </main>

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #475569;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}

