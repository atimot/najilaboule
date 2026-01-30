import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { renderMultiline } from '../../../utils/renderMultiline';
import { fadeInUp } from '../../../constants/animations';
import type { ExperienceItem } from './experienceData';
import styles from './ExperienceBlock.module.css';

interface ExperienceBlockProps {
  item: ExperienceItem;
}

export function ExperienceBlock({ item }: ExperienceBlockProps) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className={`${styles.block} ${item.reverse ? styles.reverse : ''}`}
    >
      <motion.div
        className={styles.imageWrapper}
        initial={fadeInUp.initial}
        animate={isInView ? fadeInUp.animate : {}}
        transition={fadeInUp.transition}
      >
        <div className={styles.imageContainer}>
          <img
            src={item.image}
            alt={item.imageAlt}
            className={styles.image}
          />
          <div className={styles.imageOverlay} />
        </div>
      </motion.div>

      <motion.div
        className={`${styles.content} ${item.reverse ? styles.contentReverse : styles.contentNormal}`}
        initial={fadeInUp.initial}
        animate={isInView ? fadeInUp.animate : {}}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
      >
        <span className={styles.label}>{item.label}</span>
        <h3 className={styles.title}>{t[item.titleKey]}</h3>
        <p className={styles.description}>
          {renderMultiline(t[item.descKey])}
        </p>
      </motion.div>
    </div>
  );
}
