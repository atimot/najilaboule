import clsx from 'clsx';
import { SITE_CONFIG } from '../../constants';

interface ReservationButtonProps {
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  outline:
    'border border-white/50 bg-transparent text-inherit hover:bg-accent hover:border-accent hover:text-brand',
  filled:
    'bg-white/5 border border-white/20 text-inherit hover:bg-white hover:text-brand',
} as const;

const sizeClasses = {
  sm: 'py-2 px-6 text-xs',
  md: 'py-3 px-8 text-sm',
  lg: 'py-4 px-8 text-sm w-full',
} as const;

export function ReservationButton({
  variant = 'outline',
  size = 'md',
  className = '',
}: ReservationButtonProps) {
  return (
    <a
      href={SITE_CONFIG.phoneLink}
      className={clsx(
        'inline-block text-center tracking-widest transition-[background-color,border-color,color] duration-500 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      RESERVATION
    </a>
  );
}
