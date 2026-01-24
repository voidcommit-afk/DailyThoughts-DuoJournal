'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SpaceSwitcherProps {
    activeSpace: 'solo' | 'shared';
    onSpaceChange: (space: 'solo' | 'shared') => void;
    hasPartner: boolean;
    partnerEmoji?: string;
    userEmoji?: string;
}

export function SpaceSwitcher({
    activeSpace,
    onSpaceChange,
    hasPartner,
    partnerEmoji = '💫',
    userEmoji = '✨',
}: SpaceSwitcherProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-button text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <span className="text-lg">{activeSpace === 'solo' ? userEmoji : `${userEmoji}${partnerEmoji}`}</span>
                    <span>{activeSpace === 'solo' ? 'My Space' : 'Our Space'}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Switch Space</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => onSpaceChange('solo')}
                    className={activeSpace === 'solo' ? 'bg-blue-500/10 text-blue-300' : ''}
                >
                    <span className="text-lg mr-2">{userEmoji}</span>
                    <div className="flex flex-col">
                        <span className="font-medium">My Space</span>
                        <span className="text-xs text-slate-400">Personal journal entries</span>
                    </div>
                    {activeSpace === 'solo' && (
                        <svg className="w-4 h-4 ml-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </DropdownMenuItem>

                {hasPartner ? (
                    <DropdownMenuItem
                        onClick={() => onSpaceChange('shared')}
                        className={activeSpace === 'shared' ? 'bg-purple-500/10 text-purple-300' : ''}
                    >
                        <span className="text-lg mr-2">{userEmoji}{partnerEmoji}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">Our Space</span>
                            <span className="text-xs text-slate-400">Shared with your partner</span>
                        </div>
                        {activeSpace === 'shared' && (
                            <svg className="w-4 h-4 ml-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem disabled className="opacity-50">
                        <span className="text-lg mr-2">💝</span>
                        <div className="flex flex-col">
                            <span className="font-medium">Shared Space</span>
                            <span className="text-xs text-slate-400">Invite someone to unlock</span>
                        </div>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SpaceSwitcher;
