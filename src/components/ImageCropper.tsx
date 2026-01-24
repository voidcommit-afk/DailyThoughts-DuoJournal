'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number; // 1 for square (avatar), 4 for 4:1 (cover)
    minWidth?: number;
    title?: string;
    mode?: 'avatar' | 'cover'; // Explicit mode for UI messaging
}

export default function ImageCropper({
    imageSrc,
    onCropComplete,
    onCancel,
    aspectRatio = 1, // Default to 1:1 square for safety
    minWidth = 200,
    title = 'Crop Image',
    mode = 'avatar',
}: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [saving, setSaving] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Helper to create centered crop with given aspect ratio
    const createCenteredCrop = useCallback((width: number, height: number, aspect: number): Crop => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: mode === 'avatar' ? 80 : 90, // Smaller initial crop for avatars
                },
                aspect,
                width,
                height
            ),
            width,
            height
        );
    }, [mode]);

    // Initialize crop when image loads
    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const newCrop = createCenteredCrop(width, height, aspectRatio);
        setCrop(newCrop);
        setImageLoaded(true);
    }, [aspectRatio, createCenteredCrop]);

    // Re-initialize crop if aspectRatio changes after image is loaded
    useEffect(() => {
        if (imageLoaded && imgRef.current) {
            const { width, height } = imgRef.current;
            const newCrop = createCenteredCrop(width, height, aspectRatio);
            setCrop(newCrop);
        }
    }, [aspectRatio, imageLoaded, createCenteredCrop]);

    // Generate cropped image
    const handleSave = async () => {
        if (!completedCrop || !imgRef.current) return;

        setSaving(true);

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate scaled dimensions
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        // Set canvas size to crop size, but ensure minimum width
        let outputWidth = cropWidth;
        let outputHeight = cropHeight;

        if (outputWidth < minWidth) {
            const scale = minWidth / outputWidth;
            outputWidth = minWidth;
            outputHeight = cropHeight * scale;
        }

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Draw the cropped image
        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            outputWidth,
            outputHeight
        );

        // Convert to blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCropComplete(blob);
                }
                setSaving(false);
            },
            'image/jpeg',
            0.9
        );
    };

    // Get mode-specific guidance text
    const getGuidanceText = () => {
        if (mode === 'avatar') {
            return 'Drag to select a square area for your profile picture.';
        }
        return 'Drag to select a landscape area for your cover photo.';
    };

    // Get mode indicator
    const getModeIndicator = () => {
        if (mode === 'avatar') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    <span>👤</span> Square (1:1)
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                <span>🖼️</span> Landscape (4:1)
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[var(--card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[var(--border)]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {getModeIndicator()}
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-[var(--border)] rounded-full transition-colors"
                        aria-label="Cancel"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Crop Area */}
                <div className="p-4 overflow-auto max-h-[60vh]">
                    <p className="text-sm text-[var(--muted)] mb-3">
                        {getGuidanceText()}
                    </p>
                    <div className="flex justify-center bg-black/20 rounded-lg p-2">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            minWidth={50}
                            className="max-w-full"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Upload preview"
                                onLoad={onImageLoad}
                                className="max-w-full max-h-[50vh] object-contain"
                            />
                        </ReactCrop>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-4 border-t border-[var(--border)]">
                    <button
                        onClick={onCancel}
                        className="btn btn-secondary flex-1"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary flex-1"
                        disabled={saving || !completedCrop}
                    >
                        {saving ? 'Processing...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
