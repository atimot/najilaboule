import { motion } from 'motion/react';
import styles from './BrandDots.module.css';

interface BrandDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const DOT_COLORS = [
  styles.dotWhite,
  styles.dotBlack,
  styles.dotRed,
  styles.dotBlue,
  styles.dotYellow,
  styles.dotGreen,
  styles.dotOrange,
  styles.dotPink,
  styles.dotPurple,
] as const;

const SIZE_CLASSES = {
  sm: styles.dotSm,
  md: styles.dotMd,
  lg: styles.dotLg,
};

const GAP_CLASSES = {
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
};

export function BrandDots({ size = 'md', className = '', animated = false }: BrandDotsProps) {
  const dotClass = SIZE_CLASSES[size];
  const gapClass = GAP_CLASSES[size];

  return (
    <div className={`${styles.grid} ${gapClass} ${className}`}>
      {DOT_COLORS.map((colorClass, index) => (
        animated ? (
          <motion.div
            key={index}
            className={`${dotClass} ${colorClass}`}
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
            className={`${dotClass} ${colorClass}`}
          />
        )
      ))}
    </div>
  );
}
