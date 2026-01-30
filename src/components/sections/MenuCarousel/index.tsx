import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { useDragScroll } from '../../../hooks/useDragScroll';
import { fadeInUp } from '../../../constants/animations';
import { MENU_ITEMS } from './menuItems';
import { MenuCard } from './MenuCard';
import styles from './MenuCarousel.module.css';

export function MenuCarousel() {
  const { t } = useLanguage();
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });
  const { containerRef, isDragging, handlers } = useDragScroll();

  return (
    <section id="menu" className={styles.section}>
      <div className={styles.backgroundDecor} />

      <div className={styles.header}>
        <motion.div
          ref={titleRef}
          initial={fadeInUp.initial}
          animate={isTitleInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <span className={styles.label}>MENU</span>
          <h3 className={styles.title}>{t.menu_riz_title}</h3>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className={`${styles.carousel} ${isDragging ? styles.grabbing : styles.grab}`}
        {...handlers}
      >
        {MENU_ITEMS.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            index={index}
            isInView={isTitleInView}
          />
        ))}
      </div>
    </section>
  );
}
