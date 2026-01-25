'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit request');
            }

            setIsSubmitted(true);
            toast.success("Request sent to the Concierge.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group z-50"
            >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </Link>

            <div className="w-full max-w-sm relative z-10">
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            <div className="text-center space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20">
                                        <span className="text-[#D4AF37] text-2xl font-bold font-serif">DT</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-serif italic">Request Your Key.</h1>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    To maintain the quiet, we carefully curate every new sanctuary. <br />
                                    Leave your details to begin the process.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preferred Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="How shall we address you?"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#D4AF37] text-[#0A0F1E] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:bg-[#C4A030] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Requesting...' : 'Submit Interest'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto text-4xl border border-[#D4AF37]/20">✉️</div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-serif italic text-white">Application Received.</h2>
                                <p className="text-slate-400 leading-relaxed font-light">
                                    Thank you, <span className="text-[#D4AF37]">{name}</span>. <br />
                                    The Concierge will review your request shortly. You'll receive an invitation once a key is ready for you.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/')}
                                className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs hover:underline pt-4"
                            >
                                Return to Landing
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center w-full px-6">
                <p className="text-slate-700 text-[10px] uppercase font-bold tracking-[0.3em]">
                    © {new Date().getFullYear()} DailyThoughts Sanctuary
                </p>
            </div>
        </div>
    );
}
