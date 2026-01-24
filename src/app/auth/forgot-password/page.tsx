'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send reset email');
            }

            setStatus('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden touch-manipulation">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -top-32 -left-32 animate-float" />
                    <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -bottom-32 -right-32 animate-float-delayed" />
                </div>

                <div className="w-full max-w-md glass-panel rounded-[32px] p-8 sm:p-10 relative z-10 text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl animate-bounce-slow">
                        ✉️
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-4">Check your email</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        We've sent a password reset link to <br />
                        <span className="text-white font-medium">{email}</span>.
                    </p>
                    <Link
                        href="/login"
                        className="block w-full py-4 bg-white text-slate-900 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-white/10"
                    >
                        Back to Login
                    </Link>
                </div>
                <style jsx>{`
                    .glass-panel {
                        background: rgba(15, 23, 42, 0.7);
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                    @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                    .animate-float { animation: float 6s ease-in-out infinite; }
                    .animate-float-delayed { animation: float-delayed 6s ease-in-out 3s infinite; }
                    .animate-bounce-slow { animation: bounce 3s infinite; }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden touch-manipulation">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-32 -left-32 animate-float" />
                <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -bottom-32 -right-32 animate-float-delayed" />
            </div>

            <Link href="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/5 transition z-20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>

            <div className="w-full max-w-md glass-panel rounded-[32px] p-8 sm:p-10 relative z-10">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🔑</div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Reset Password</h2>
                    <p className="text-slate-400">Enter your email to receive a reset link.</p>
                </div>

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:shadow-white/10"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <Link href="/login" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 6s ease-in-out 3s infinite; }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
