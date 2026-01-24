'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    glowColor?: 'sanjeev' | 'channu' | 'default';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            glowColor = 'default',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg cursor-pointer border-none outline-none focus-glow';

        const variantClasses = {
            primary: 'bg-[var(--primary)] text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:bg-[var(--primary-hover)]',
            secondary: 'bg-[rgba(30,41,59,0.8)] text-[var(--foreground)] border border-[var(--border)] backdrop-blur-sm hover:bg-[var(--border)]',
            danger: 'bg-[var(--danger)] text-white hover:bg-[#dc2626]',
            ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--border)]',
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        const glowClasses = {
            sanjeev: 'focus-glow-sanjeev',
            channu: 'focus-glow-channu',
            default: '',
        };

        const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses[glowColor]} ${className}`;

        return (
            <motion.button
                ref={ref}
                className={combinedClasses}
                disabled={disabled || isLoading}
                whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                }}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <motion.span
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Loading...
                    </span>
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
