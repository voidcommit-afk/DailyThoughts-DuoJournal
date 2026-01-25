'use client';

import React, { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
    audioNotes: string[];
    onAudioChange: (notes: string[]) => void;
    disabled?: boolean;
    maxNotes?: number;
}

export default function VoiceRecorder({
    audioNotes,
    onAudioChange,
    disabled = false,
    maxNotes = 5,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                // Create blob and upload
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await uploadAudio(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Recording error:', err);
            setError('Could not access microphone. Please allow microphone access.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const uploadAudio = async (blob: Blob) => {
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('files', blob, `voice-note-${Date.now()}.webm`);
        formData.append('type', 'audio');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success && data.data.paths.length > 0) {
                onAudioChange([...audioNotes, ...data.data.paths]);
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload audio');
        } finally {
            setUploading(false);
        }
    };

    const removeAudio = (index: number) => {
        onAudioChange(audioNotes.filter((_, i) => i !== index));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
                Voice Notes ({audioNotes.length}/{maxNotes})
            </label>

            {error && (
                <div className="mb-2 p-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Record button */}
            {audioNotes.length < maxNotes && !disabled && (
                <div className="mb-3">
                    {isRecording ? (
                        <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl w-full">
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-all scale-105 shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-pulse"
                                aria-label="Stop recording"
                            >
                                <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                            </button>
                            <div className="flex flex-col items-start text-left">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Recording...</span>
                                </div>
                                <span className="text-xl font-mono text-white leading-none">{formatTime(recordingTime)}</span>
                            </div>
                        </div>
                    ) : uploading ? (
                        <div className="flex items-center gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl w-full">
                            <div className="w-14 h-14 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Processing your voice note...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={startRecording}
                            className="flex items-center gap-4 p-4 w-full bg-slate-900/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                        >
                            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-slate-300 font-medium text-lg leading-tight">Tap to record a voice note</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Voice Memo (0/1)
                                </span>
                            </div>
                        </button>
                    )}
                </div>
            )}

            {/* Audio list */}
            {audioNotes.length > 0 && (
                <div className="space-y-2">
                    {audioNotes.map((src, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg"
                        >
                            <div className="flex-1">
                                <audio
                                    controls
                                    src={src}
                                    className="w-full h-10"
                                    style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                                />
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeAudio(index)}
                                    className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    aria-label={`Remove voice note ${index + 1}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Enhanced audio player with duration display
export function AudioPlayer({ src }: { src: string }) {
    const [duration, setDuration] = React.useState<string>('--:--');
    const [error, setError] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const formatDuration = (seconds: number): string => {
        if (!isFinite(seconds) || seconds < 0 || isNaN(seconds)) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remainingMins = mins % 60;
            return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const updateDuration = React.useCallback(() => {
        const audio = audioRef.current;
        if (audio && audio.duration && isFinite(audio.duration) && !isNaN(audio.duration)) {
            setDuration(formatDuration(audio.duration));
        }
    }, []);

    // Try to get duration from metadata
    const handleLoadedMetadata = () => {
        updateDuration();
    };

    // WebM files may not have duration until more is loaded
    const handleDurationChange = () => {
        updateDuration();
    };

    // Also check when data is loaded
    const handleLoadedData = () => {
        updateDuration();
    };

    // Check duration when playback starts (fallback for WebM)
    const handleCanPlay = () => {
        updateDuration();
    };

    const handleError = () => {
        setError(true);
    };

    if (error) {
        return (
            <div className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Audio could not be loaded</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <audio
                ref={audioRef}
                controls
                src={src}
                className="flex-1 h-10"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                onLoadedMetadata={handleLoadedMetadata}
                onDurationChange={handleDurationChange}
                onLoadedData={handleLoadedData}
                onCanPlay={handleCanPlay}
                onError={handleError}
                preload="metadata"
            />
            <span className="text-xs text-[var(--muted)] font-mono min-w-[45px] text-right">
                {duration}
            </span>
        </div>
    );
}

