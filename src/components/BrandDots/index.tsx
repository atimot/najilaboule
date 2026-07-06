import { m } from 'motion/react';
import clsx from 'clsx';

interface BrandDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

// グローの色は @theme のドットトークンを color-mix で参照する (トークン変更に追従させる)
const DOT_COLORS = [
  'bg-dot-white shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-white)_50%,transparent)]',
  'bg-dot-black border border-gray-600',
  'bg-dot-red shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-red)_30%,transparent)]',
  'bg-dot-blue shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-blue)_30%,transparent)]',
  'bg-dot-yellow shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-yellow)_30%,transparent)]',
  'bg-dot-green shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-green)_30%,transparent)]',
  'bg-dot-orange shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-orange)_30%,transparent)]',
  'bg-dot-pink shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-pink)_30%,transparent)]',
  'bg-dot-purple shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-purple)_30%,transparent)]',
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
          <m.div
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
