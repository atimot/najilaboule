import { motion } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { BrandDots } from '../../ui/BrandDots';
import { renderWithSeparator } from '../../../utils/renderMultiline';
import { fadeIn } from '../../../constants/animations';
import styles from './Hero.module.css';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={styles.background}>
        <img
          src="sake_01.JPG"
          alt="Ginza Bar Atmosphere"
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay} />
      </div>

      <div className={styles.content}>
        <motion.div
          className={styles.dotsWrapper}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 3, duration: 2 }}
        >
          <BrandDots size="md" />
        </motion.div>

        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 2 }}
        >
          {renderWithSeparator(t.hero_title, '、')}
        </motion.h2>

        <motion.p
          className={styles.subtitle}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 4, duration: 2 }}
        >
          Riz et Soupe, et un peu d'alcool.
        </motion.p>
      </div>
    </section>
  );
}
