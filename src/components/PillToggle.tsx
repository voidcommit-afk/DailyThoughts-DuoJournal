'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface PillToggleOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface PillToggleProps {
    options: PillToggleOption[];
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function PillToggle({
    options,
    value,
    onChange,
    size = 'md',
    className = '',
}: PillToggleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const sizeClasses = {
        sm: 'text-xs py-1 px-2',
        md: 'text-sm py-2 px-4',
        lg: 'text-base py-2.5 px-5',
    };

    // Update indicator position when value changes
    useEffect(() => {
        if (!containerRef.current) return;

        const activeIndex = options.findIndex((opt) => opt.value === value);
        if (activeIndex === -1) return;

        const buttons = containerRef.current.querySelectorAll('button');
        const activeButton = buttons[activeIndex];

        if (activeButton) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();

            setIndicatorStyle({
                left: buttonRect.left - containerRect.left,
                width: buttonRect.width,
            });
        }
    }, [value, options]);

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            onChange(options[nextIndex].value);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + options.length) % options.length;
            onChange(options[prevIndex].value);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`pill-toggle relative ${className}`}
            role="radiogroup"
        >
            {/* Sliding indicator */}
            <motion.div
                className="pill-toggle-indicator"
                initial={false}
                animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                }}
            />

            {/* Options */}
            {options.map((option, index) => (
                <motion.button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={value === option.value}
                    className={`pill-toggle-option ${sizeClasses[size]} ${value === option.value ? 'active' : ''}`}
                    onClick={() => onChange(option.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <span className="flex items-center gap-1.5">
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
