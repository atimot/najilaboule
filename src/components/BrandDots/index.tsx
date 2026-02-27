import { motion } from 'motion/react';
import clsx from 'clsx';

interface BrandDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const DOT_COLORS = [
  'bg-dot-white shadow-[0_0_10px_rgba(255,255,255,0.5)]',
  'bg-dot-black border border-gray-600',
  'bg-dot-red shadow-[0_0_10px_rgba(230,0,18,0.3)]',
  'bg-dot-blue shadow-[0_0_10px_rgba(0,153,204,0.3)]',
  'bg-dot-yellow shadow-[0_0_10px_rgba(255,215,0,0.3)]',
  'bg-dot-green shadow-[0_0_10px_rgba(0,153,68,0.3)]',
  'bg-dot-orange shadow-[0_0_10px_rgba(243,152,0,0.3)]',
  'bg-dot-pink shadow-[0_0_10px_rgba(230,0,127,0.3)]',
  'bg-dot-purple shadow-[0_0_10px_rgba(146,7,131,0.3)]',
] as const;

const SIZE_CLASSES = {
  sm: 'size-2',
  md: 'size-3 md:size-4',
  lg: 'size-3',
} as const;

const GAP_CLASSES = {
  sm: 'gap-2',
  md: 'gap-3 md:gap-4',
  lg: 'gap-2',
} as const;

export function BrandDots({ size = 'md', className = '', animated = false }: BrandDotsProps) {
  return (
    <div aria-hidden="true" className={clsx('grid grid-cols-3', GAP_CLASSES[size], className)}>
      {DOT_COLORS.map((colorClass, index) => {
        const dotClass = clsx('rounded-full', SIZE_CLASSES[size], colorClass);
        return animated ? (
          <motion.div
            key={index}
            className={dotClass}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
          />
        ) : (
          <div key={index} className={dotClass} />
        );
      })}
    </div>
  );
}
