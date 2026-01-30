import { SITE_CONFIG } from '../../../constants/config';
import styles from './ReservationButton.module.css';

interface ReservationButtonProps {
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ReservationButton({
  variant = 'outline',
  size = 'md',
  className = '',
}: ReservationButtonProps) {
  const sizeClasses = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  const variantClasses = {
    outline: styles.outline,
    filled: styles.filled,
  };

  return (
    <a
      href={SITE_CONFIG.phoneLink}
      className={`${styles.button} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      RESERVATION
    </a>
  );
}
