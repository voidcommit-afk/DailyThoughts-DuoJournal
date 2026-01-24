'use client';

import { useEffect, useState } from 'react';

export default function PartnerPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [partnerCode, setPartnerCode] = useState('');
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/user');
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    const copyCode = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id);
            alert('Invite code copied to clipboard!');
        }
    };

    const handleConnect = async () => {
        if (!partnerCode.trim()) return;
        setInviteStatus('loading');

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partner_id: partnerCode }),
            });

            if (!res.ok) throw new Error('Failed to connect partner');

            setInviteStatus('success');
            setStatusMessage('Partner connected successfully! Refreshing...');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setInviteStatus('error');
            setStatusMessage('Invalid code or connection failed.');
        }
    };

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    if (isLoading) return null; // Or a loading spinner

    return (
        <>
            <header className="flex-none sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-800">
                <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate()}</h2>
                <h1 className="font-serif text-2xl font-bold text-white">
                    {user?.partner_id ? 'Partner' : 'Invite'}
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40 lg:pb-12 no-scrollbar">
                <div className="glass-panel rounded-[32px] p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[50vh]">
                    {user?.partner_id ? (
                        <>
                            <div className="w-16 h-16 bg-slate-700 rounded-full shadow-md mb-6 flex items-center justify-center text-3xl">
                                {user.partner_emoji || '👩'}
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-white mb-2">Partner Connected</h2>
                            <p className="text-slate-400 text-sm mb-8">You are sharing your journey.</p>
                            <div className="w-full max-w-md glass-inner p-8 rounded-2xl border border-slate-700 cursor-pointer hover:scale-[1.02] transition">
                                <p className="font-handwriting text-xl text-slate-400 blur-sm hover:blur-none transition duration-500">
                                    &quot;Recent thoughts hidden...&quot;
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <div className="w-16 h-16 bg-slate-700 rounded-full shadow-md mb-6 flex items-center justify-center text-3xl mx-auto">💌</div>
                                <h2 className="font-serif text-2xl font-bold text-white mb-2">Connect with a Partner</h2>
                                <p className="text-slate-400 text-sm">Share your code or enter theirs to start your shared journal.</p>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Invite Code</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 bg-black/30 p-3 rounded-lg text-slate-300 font-mono text-sm truncate border border-white/5">
                                            {user?.id}
                                        </code>
                                        <button
                                            onClick={copyCode}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-slate-900 px-2 text-slate-500">Or enter code</span>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Paste partner's code here"
                                        value={partnerCode}
                                        onChange={(e) => setPartnerCode(e.target.value)}
                                        className="w-full p-3 bg-black/30 rounded-lg border border-white/5 text-white placeholder-slate-600 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                                <button
                                    onClick={handleConnect}
                                    disabled={!partnerCode || inviteStatus === 'loading'}
                                    className="w-full bg-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-rose-600 transition active:scale-95 disabled:opacity-50"
                                >
                                    {inviteStatus === 'loading' ? 'Connecting...' : 'Connect Partner'}
                                </button>
                                {statusMessage && (
                                    <p className={`text-sm ${inviteStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                        {statusMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .glass-inner {
                    background: rgba(15, 23, 42, 0.7);
                }
                .font-handwriting {
                    font-family: 'Caveat', cursive;
                }
            `}</style>
        </>
    );
}
