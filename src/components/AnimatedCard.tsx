'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    hover?: 'lift' | 'glow' | 'both' | 'none';
    glowColor?: 'sanjeev' | 'channu' | 'default';
    clickable?: boolean;
    glass?: 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
    (
        {
            children,
            hover = 'both',
            glowColor = 'default',
            clickable = false,
            glass = 'md',
            className = '',
            ...props
        },
        ref
    ) => {
        const baseClasses = 'rounded-2xl p-6 border border-luminous bg-[var(--card)]';

        const glassClasses = {
            sm: 'glass-sm',
            md: 'glass-md',
            lg: 'glass-lg',
            xl: 'glass-xl',
        };

        const glowClasses = {
            sanjeev: 'focus-glow-sanjeev',
            channu: 'focus-glow-channu',
            default: '',
        };

        const hoverAnimation = {
            lift: { y: -4, scale: 1 },
            glow: { y: 0, scale: 1 },
            both: { y: -4, scale: 1.01 },
            none: {},
        };

        const combinedClasses = `${baseClasses} ${glassClasses[glass]} ${glowClasses[glowColor]} ${clickable ? 'cursor-pointer' : ''} ${className}`;

        return (
            <motion.div
                ref={ref}
                className={combinedClasses}
                whileHover={hoverAnimation[hover]}
                whileTap={clickable ? { scale: 0.98 } : {}}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                }}
                style={{
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
