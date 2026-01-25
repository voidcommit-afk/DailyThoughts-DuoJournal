'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function LandingPage() {
    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 100], [0, 1]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0F1E] selection:bg-[#D4AF37]/30 selection:text-white">
            {/* Ambient Background - Deep Midnight & Gold Grain */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute -top-[20%] -left-[10%] w-[100vw] h-[100vw] bg-[#D4AF37]/5 rounded-full blur-[180px] mix-blend-screen"
                    animate={{
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-[#E0E0E0]/5 rounded-full blur-[150px] mix-blend-screen"
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all"
                style={{ backgroundColor: useTransform(headerBg, (v) => `rgba(10, 15, 30, ${v * 0.95})`) }}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                            <span className="text-[#D4AF37] text-xl font-bold font-serif">DT</span>
                        </div>
                        <span className="font-serif text-2xl font-bold text-white tracking-tight">
                            DailyThoughts
                        </span>
                    </div>
                    <div>
                        <Link
                            href="/login"
                            className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0A0F1E] text-sm font-black uppercase tracking-widest hover:bg-[#C4A030] transition-all shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95"
                        >
                            Enter
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section - Centered & Professional */}
            <section className="relative pt-48 pb-20 px-6 min-h-[85vh] flex items-center justify-center text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <FadeIn>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                            </span>
                            A Concierge Experience
                        </div>
                    </FadeIn>

                    <div className="space-y-8">
                        <FadeIn delay={0.1}>
                            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-serif font-medium leading-[0.85] tracking-tight text-white italic">
                                Quietly <br />
                                <span className="text-slate-500 not-italic">yours.</span>
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                                Imagine a journal that feels like a conversation with a close friend. <br className="hidden sm:block" />
                                No noise, no ads, just a sacred space for your story and the ones you hold dear.
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.3}>
                        <div className="flex flex-col items-center gap-8">
                            <Link
                                href="/signup"
                                className="w-full sm:w-auto px-12 py-6 bg-[#D4AF37] text-[#0A0F1E] rounded-2xl font-black uppercase tracking-[0.2em] text-lg hover:bg-[#C4A030] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95"
                            >
                                Begin Your Story
                            </Link>
                            <p className="text-slate-500 italic text-sm">
                                "The most intimate app you will ever use."
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Path Decorator */}
            <div className="h-24 flex justify-center">
                <div className="w-px h-full bg-gradient-to-b from-[#D4AF37]/40 to-transparent" />
            </div>

            {/* The Concierge Experience */}
            <section className="py-32 px-6 bg-[#080B14]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="space-y-10 text-center lg:text-left">
                            <FadeIn>
                                <h2 className="text-5xl sm:text-6xl font-serif font-medium text-white leading-tight">
                                    The <span className="italic text-[#D4AF37]">Concierge</span> <br />
                                    Experience.
                                </h2>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <div className="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                                    <p>
                                        In a world where apps compete for your attention with pings and buzzes, DailyThoughts waits for you.
                                    </p>
                                    <p>
                                        Our Concierge model ensures that only mindful, intentional souls enter this space. This isn't about numbers; it's about the quality of the quiet.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="relative">
                            <FadeIn>
                                <div className="glass-panel p-8 sm:p-12 rounded-[40px] border-[#D4AF37]/20 bg-[#D4AF37]/5 space-y-8">
                                    <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-2xl border border-[#D4AF37]/20">🤝</div>
                                    <h3 className="text-2xl font-serif text-white leading-tight italic">
                                        "We don't believe in accounts. <br />
                                        We believe in invitations."
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed font-light">
                                        Every diary at DailyThoughts is curated. When you join, you're not just a user in a database; you're a guest in a private sanctuary.
                                    </p>
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        {[
                                            "Human-led approval process",
                                            "Personalized sanctuary setup",
                                            "Privacy-first intimacy tools"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Grid */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-serif text-white">Three Simple Truths.</h2>
                            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] font-bold">How we protect your sanctuary</p>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Zero Noise",
                                desc: "No likes, no comments, no counts. Just the raw, beautiful truth of your own words.",
                                //icon: "🕊️"
                            },
                            {
                                title: "Shared Silence",
                                desc: "Invite a partner into your world. A delicate connection that bridges distances without the clutter.",
                                //icon: "🕯️"
                            },
                            {
                                title: "Forever Private",
                                desc: "Your thoughts belong to you. We use the highest industry standards to keep them that way.",
                                //icon: "🔐"
                            }
                        ].map((truth, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-10 rounded-[40px] border border-white/5 bg-slate-900/20 hover:bg-slate-900/40 transition-all group h-full text-center sm:text-left">
                                    <h4 className="text-2xl font-serif text-white mb-4">{truth.title}</h4>
                                    <p className="text-slate-400 font-light leading-relaxed">{truth.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <FadeIn>
                        <h2 className="text-5xl sm:text-7xl font-serif text-white leading-tight">Your sanctuary <br /> is waiting.</h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="text-slate-400 text-lg sm:text-xl font-light max-w-2xl mx-auto">
                            The Concierge is ready to welcome you. Step away from the noise and begin the most important conversation of your life.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <Link
                            href="/signup"
                            className="inline-block px-12 py-6 bg-[#D4AF37] text-[#0A0F1E] rounded-2xl font-black uppercase tracking-[0.2em] text-lg hover:bg-[#C4A030] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                        >
                            Request Your Key
                        </Link>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <p className="text-slate-600 text-sm italic font-light">
                            Limited invitations available to preserve the quiet.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Simplified Footer */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center gap-12 text-center">
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center border border-[#D4AF37]/20">
                                    <span className="text-[#D4AF37] font-serif">DT</span>
                                </div>
                                <span className="font-serif text-xl font-bold text-white tracking-tight">
                                    DailyThoughts
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">A human-first sanctuary created for the mindful writer. No noise. No ads. Just heart.</p>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <p className="text-slate-700 text-[10px] uppercase font-bold tracking-widest">
                            © {new Date().getFullYear()} DailyThoughts. All rights reserved.
                        </p>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                            v1.0 Concierge Release
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
