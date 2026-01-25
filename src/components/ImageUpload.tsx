'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageLightbox from './ImageLightbox';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export default function ImageUpload({
    images,
    onImagesChange,
    maxImages = 3,
    disabled = false
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [lightbox, setLightbox] = useState<{ isOpen: boolean; index: number }>({
        isOpen: false,
        index: 0
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (images.length + files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images.`);
            return;
        }

        setUploading(true);
        setError('');

        try {
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('files', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();

                if (data.success) {
                    uploadedUrls.push(data.data.paths[0]);
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            }
            onImagesChange([...images, ...uploadedUrls]);
        } catch (err: any) {
            setError(err.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-400">Photos ({images.length}/{maxImages})</label>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            {/* Thumbnails row */}
            {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                        {images.map((url, index) => (
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setLightbox({ isOpen: true, index })}
                                className="relative w-20 h-20 rounded-xl overflow-hidden group border border-slate-800 cursor-pointer"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Button (Wide Style) */}
            {images.length < maxImages && !disabled && (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-4 p-4 w-full bg-slate-900/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-primary/20">
                        {uploading ? (
                            <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex flex-col items-start text-left">
                        <span className="text-slate-300 font-medium text-lg leading-tight">
                            {uploading ? 'Uploading...' : 'Click to upload photos'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            JPEG or PNG, max 5MB
                        </span>
                    </div>
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <ImageLightbox
                isOpen={lightbox.isOpen}
                images={images}
                initialIndex={lightbox.index}
                onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
