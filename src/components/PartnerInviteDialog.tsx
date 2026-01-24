'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RelationshipType = 'partner' | 'family' | 'bestfriend' | 'other';

interface PartnerInviteDialogProps {
    onInviteCreated?: (inviteCode: string, relationship: RelationshipType) => void;
    onInviteJoined?: (inviteCode: string) => void;
    trigger?: React.ReactNode;
}

const relationshipOptions: { value: RelationshipType; label: string; emoji: string; description: string }[] = [
    { value: 'partner', label: 'Partner', emoji: '💑', description: 'Romantic partner or spouse' },
    { value: 'family', label: 'Family', emoji: '👨‍👩‍👧', description: 'Family member' },
    { value: 'bestfriend', label: 'Best Friend', emoji: '👯', description: 'Close friend' },
    { value: 'other', label: 'Other', emoji: '🤝', description: 'Someone special' },
];

export function PartnerInviteDialog({
    onInviteCreated,
    onInviteJoined,
    trigger,
}: PartnerInviteDialogProps) {
    const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
    const [relationship, setRelationship] = useState<RelationshipType>('partner');
    const [inviteCode, setInviteCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const generateInviteCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateSpace = async () => {
        setIsLoading(true);
        setError('');

        try {
            const code = generateInviteCode();
            // In production, this would call the API to create the invite
            // For now, we just simulate a successful creation
            await new Promise(resolve => setTimeout(resolve, 500));
            setGeneratedCode(code);
            onInviteCreated?.(code, relationship);
        } catch (err) {
            setError('Failed to create invite. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinSpace = async () => {
        if (inviteCode.length < 6) {
            setError('Please enter a valid invite code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // In production, this would call the API to join the space
            await new Promise(resolve => setTimeout(resolve, 500));
            onInviteJoined?.(inviteCode);
        } catch (err) {
            setError('Invalid invite code. Please check and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const resetState = () => {
        setMode('choose');
        setRelationship('partner');
        setInviteCode('');
        setGeneratedCode('');
        setError('');
        setCopied(false);
    };

    return (
        <Dialog onOpenChange={(open) => !open && resetState()}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="glass" size="default">
                        <span className="mr-2">💝</span>
                        Invite Someone
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                {mode === 'choose' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Create a Shared Space</DialogTitle>
                            <DialogDescription>
                                Share your journal with someone special. Create a new shared space or join an existing one.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMode('create')}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all text-left"
                            >
                                <span className="text-3xl">✨</span>
                                <div>
                                    <div className="font-semibold text-white">Create New Space</div>
                                    <div className="text-sm text-slate-400">Generate an invite code to share</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMode('join')}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
                            >
                                <span className="text-3xl">🔗</span>
                                <div>
                                    <div className="font-semibold text-white">Join Existing Space</div>
                                    <div className="text-sm text-slate-400">Enter an invite code</div>
                                </div>
                            </motion.button>
                        </div>
                    </>
                )}

                {mode === 'create' && !generatedCode && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Who are you inviting?</DialogTitle>
                            <DialogDescription>
                                Choose the relationship type for your shared space.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2 py-4">
                            {relationshipOptions.map((option) => (
                                <motion.button
                                    key={option.value}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setRelationship(option.value)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${relationship === option.value
                                            ? 'border-purple-400 bg-purple-500/10'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-2xl">{option.emoji}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">{option.label}</div>
                                        <div className="text-xs text-slate-400">{option.description}</div>
                                    </div>
                                    {relationship === option.value && (
                                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setMode('choose')}>Back</Button>
                            <Button onClick={handleCreateSpace} disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Invite'}
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {mode === 'create' && generatedCode && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Your Invite Code</DialogTitle>
                            <DialogDescription>
                                Share this code with your {relationshipOptions.find(r => r.value === relationship)?.label.toLowerCase()}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="flex items-center justify-center gap-3">
                                <div className="text-3xl font-mono font-bold tracking-[0.3em] text-white bg-slate-800/50 px-6 py-4 rounded-xl border border-white/10">
                                    {generatedCode}
                                </div>
                                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                    {copied ? (
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </Button>
                            </div>
                            <p className="text-center text-sm text-slate-400 mt-4">
                                This code expires in 24 hours
                            </p>
                        </div>
                    </>
                )}

                {mode === 'join' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Join a Shared Space</DialogTitle>
                            <DialogDescription>
                                Enter the invite code you received.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Label htmlFor="invite-code" className="sr-only">Invite Code</Label>
                            <Input
                                id="invite-code"
                                placeholder="Enter invite code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                className="text-center text-lg font-mono tracking-widest"
                                maxLength={8}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setMode('choose')}>Back</Button>
                            <Button onClick={handleJoinSpace} disabled={isLoading || inviteCode.length < 6}>
                                {isLoading ? 'Joining...' : 'Join Space'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default PartnerInviteDialog;
