'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef } from 'react';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function FloatingElement({ children, duration = 4, range = 10 }: { children: React.ReactNode; duration?: number; range?: number }) {
    return (
        <motion.div
            animate={{ y: [-range, range, -range] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

export default function LandingPage() {
    const { scrollY } = useScroll();
    const heroRef = useRef(null);
    const isHeroInView = useInView(heroRef);

    const rotate = useTransform(scrollY, [0, 500], [0, 5]);
    const headerBg = useTransform(scrollY, [0, 100], [0, 1]);
    const springScroll = useSpring(scrollY, { stiffness: 100, damping: 30 });
    const parallaxY = useTransform(springScroll, [0, 500], [0, -50]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg-primary)]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] mix-blend-screen"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -40, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[100px] mix-blend-screen"
                    animate={{
                        y: [0, -60, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6 transition-all"
                style={{ backgroundColor: useTransform(headerBg, (v) => `rgba(2, 6, 23, ${v * 0.95})`) }}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel rounded-full px-4 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        DailyThoughts
                    </span>
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
                        >
                            <span className="hidden sm:inline">Get Started</span>
                            <span className="sm:hidden">Start</span>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen flex items-center">
                <motion.div style={{ y: parallaxY }} className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                        <FadeIn>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-sm font-medium text-blue-300">
                                <motion.span
                                    className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                Your quiet space
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight text-white">
                                A quiet place for <br />
                                <motion.span
                                    className="text-slate-500 italic"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                >
                                    your thoughts.
                                </motion.span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                                Just you, and the ones who matter most. A private journal to write deeply, reflect honestly, and connect authentically.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/auth/signup"
                                    className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white overflow-hidden shadow-lg shadow-purple-500/20 transition-all active:scale-95 text-center hover:shadow-purple-500/30"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ y: "100%" }}
                                        whileHover={{ y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative flex items-center justify-center gap-3">
                                        Start Shared Journal
                                        <motion.svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            whileHover={{ x: 5 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </motion.svg>
                                    </span>
                                </Link>
                                <Link
                                    href="/auth/signup?mode=solo"
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/10 hover:bg-white/5 font-medium transition-all flex items-center justify-center gap-3 group text-white text-center hover:border-white/20"
                                >
                                    <span>Begin Solo Journey</span>
                                </Link>
                            </div>
                        </FadeIn>

                        {/* Trust indicators */}
                        <FadeIn delay={0.4}>
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-2">
                                    {['😊', '🌟', '💫', '✨'].map((emoji, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-sm">
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-400">
                                    <span className="text-white font-semibold">10,000+</span> thoughtful writers
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end py-6 lg:py-0">
                        <FadeIn delay={0.2} className="relative w-full max-w-[500px] h-[320px] sm:h-[350px] flex justify-center items-center">
                            <motion.div
                                style={{ rotate }}
                                className="relative w-full h-full flex"
                            >
                                {/* Left Page */}
                                <div className="flex-1 bg-[#fdfbf7] rounded-l-lg shadow-2xl border-l border-t border-b border-[#e2dcd6] relative overflow-hidden origin-right z-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />
                                    <div className="absolute inset-0 pt-8 pl-6 pr-3 bg-[repeating-linear-gradient(transparent_0px,transparent_23px,#e5e7eb_24px)]">
                                        <div className="font-handwriting text-slate-600 text-base sm:text-lg leading-[24px]" style={{ fontFamily: 'Caveat, cursive' }}>
                                            <p className="mb-4"><span className="text-amber-600/80 font-bold">Dear Diary,</span></p>
                                            <p>Today felt lighter. The sun came through the window and I finally took a moment to just breathe.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Spine */}
                                <div className="w-5 sm:w-6 bg-[#e5e5e5] shadow-[inset_2px_0_5px_rgba(0,0,0,0.1)] relative z-0" />

                                {/* Right Page */}
                                <div className="flex-1 bg-[#fdfbf7] rounded-r-lg shadow-2xl border-r border-t border-b border-[#e2dcd6] relative overflow-hidden origin-left z-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.02)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.15)_100%)] pointer-events-none" />
                                    <div className="absolute inset-0 pt-8 pl-3 pr-6 bg-[repeating-linear-gradient(transparent_0px,transparent_23px,#e5e7eb_24px)]">
                                        <div className="font-handwriting text-slate-600 text-base sm:text-lg leading-[24px]" style={{ fontFamily: 'Caveat, cursive' }}>
                                            <p>It's nice to have a place that's just mine. No noise, just thoughts.</p>
                                            <p className="mt-6 text-amber-700/60 text-sm sm:text-base transform -rotate-2">✨ Finding peace in the little things.</p>
                                        </div>
                                        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-6 opacity-80 rotate-[-6deg]">
                                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border border-dashed border-amber-400/50 flex items-center justify-center">
                                                <span className="text-[8px] sm:text-[10px] text-amber-500 font-serif">DT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Pen */}
                                <FloatingElement duration={4} range={8}>
                                    <div className="absolute -right-4 sm:-right-6 top-0 text-4xl sm:text-5xl filter drop-shadow-xl z-20">
                                        🖊️
                                    </div>
                                </FloatingElement>
                            </motion.div>
                        </FadeIn>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white mb-4">
                                Built for <span className="text-slate-500 italic">presence</span>
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                                No algorithms. No notifications. Just a quiet space for your thoughts.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: "📅",
                                title: "Your Timeline",
                                desc: "Visualize your journey. Every day is a page in your story.",
                                gradient: "from-blue-500/20 to-indigo-500/20",
                            },
                            {
                                icon: "✨",
                                title: "Emotional Sync",
                                desc: "Track your moods and rhythms over time. Understand yourself better.",
                                gradient: "from-purple-500/20 to-pink-500/20",
                            },
                            {
                                icon: "🔒",
                                title: "Private Vault",
                                desc: "End-to-end encryption for your most personal memories.",
                                gradient: "from-emerald-500/20 to-teal-500/20",
                            }
                        ].map((feature, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <motion.div
                                    className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/5 hover:border-white/10 transition-all group h-full`}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        className="text-4xl sm:text-5xl mb-4 sm:mb-6 inline-block"
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-serif">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-base">{feature.desc}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white mb-4">
                                How it <span className="text-slate-500 italic">works</span>
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="space-y-10 sm:space-y-16">
                        {[
                            { step: "01", title: "Create your space", desc: "Sign up in seconds. No email verification required." },
                            { step: "02", title: "Write freely", desc: "Capture your thoughts, feelings, and moments. Add photos or voice notes." },
                            { step: "03", title: "Share (if you want)", desc: "Invite a partner, family member, or friend to share your journey." },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="flex gap-6 sm:gap-8 items-start group">
                                    <div className="flex-shrink-0 w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-mono text-lg sm:text-xl font-bold text-white group-hover:scale-110 transition-transform">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-serif">{item.title}</h3>
                                        <p className="text-slate-400 text-base sm:text-lg">{item.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="glass-panel rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                            <div className="relative">
                                <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">💭</div>
                                <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif text-white leading-relaxed mb-6 sm:mb-8">
                                    "DailyThoughts helped me reconnect with my partner in ways I didn't expect. There's something magical about sharing thoughts, not just moments."
                                </blockquote>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                                        💑
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-white">Sarah & Mike</p>
                                        <p className="text-sm text-slate-400">Together 3 years</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white mb-6">
                            Ready to start your journey?
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Start writing today. It's free, private, and takes less than a minute to begin.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth/signup"
                                className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white overflow-hidden shadow-lg shadow-purple-500/20 transition-all active:scale-95 hover:shadow-purple-500/30"
                            >
                                <span className="relative flex items-center justify-center gap-3 text-base sm:text-lg">
                                    Get Started Free
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                DailyThoughts
                            </span>
                            <p className="text-slate-500 text-sm mt-2">A quiet place for your thoughts.</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} DailyThoughts. Made with 💜 for thoughtful writers.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
