import { motion } from 'motion/react';

interface BrandDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const dotColors = [
  'bg-dot-white shadow-[0_0_10px_rgba(255,255,255,0.5)]',
  'bg-dot-black border border-gray-600',
  'bg-dot-red shadow-[0_0_10px_rgba(230,0,18,0.3)]',
  'bg-dot-blue shadow-[0_0_10px_rgba(0,153,204,0.3)]',
  'bg-dot-yellow shadow-[0_0_10px_rgba(255,215,0,0.3)]',
  'bg-dot-green shadow-[0_0_10px_rgba(0,153,68,0.3)]',
  'bg-dot-orange shadow-[0_0_10px_rgba(243,152,0,0.3)]',
  'bg-dot-pink shadow-[0_0_10px_rgba(230,0,127,0.3)]',
  'bg-dot-purple shadow-[0_0_10px_rgba(146,7,131,0.3)]',
];

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3 md:w-4 md:h-4',
  lg: 'w-3 h-3',
};

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-3 md:gap-4',
  lg: 'gap-2',
};

export function BrandDots({ size = 'md', className = '', animated = false }: BrandDotsProps) {
  return (
    <div className={`grid grid-cols-3 ${gapClasses[size]} ${className}`}>
      {dotColors.map((colorClass, index) => (
        animated ? (
          <motion.div
            key={index}
            className={`${sizeClasses[size]} rounded-full ${colorClass}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
          />
        ) : (
          <div
            key={index}
            className={`${sizeClasses[size]} rounded-full ${colorClass}`}
          />
        )
      ))}
    </div>
  );
}

