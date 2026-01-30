import { motion } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { getStaggeredFadeInUp } from '../../../constants/animations';
import type { MenuItem } from './menuItems';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  isInView: boolean;
}

const DOT_COLORS = {
  white: styles.dotWhite,
  orange: styles.dotOrange,
  red: styles.dotRed,
} as const;

export function MenuCard({ item, index, isInView }: MenuCardProps) {
  const { t } = useLanguage();
  const staggered = getStaggeredFadeInUp(index % 3);

  return (
    <motion.div
      className={styles.card}
      initial={staggered.initial}
      animate={isInView ? staggered.animate : {}}
      transition={staggered.transition}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.imageOverlay} />
        <img
          src={item.image}
          alt={t[item.nameKey]}
          className={styles.image}
          draggable={false}
        />
        {item.dotColor !== 'white' && (
          <div className={`${styles.dotGlow} ${DOT_COLORS[item.dotColor]}`} />
        )}
      </div>
      <div className={styles.content}>
        <h4 className={styles.name}>{t[item.nameKey]}</h4>
        <p className={styles.description}>{t[item.descKey]}</p>
        <div className={`${styles.dotIndicator} ${DOT_COLORS[item.dotColor]}`} />
      </div>
    </motion.div>
  );
}
