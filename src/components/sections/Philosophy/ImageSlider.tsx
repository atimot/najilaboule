import { motion, AnimatePresence } from 'motion/react';
import { fadeIn } from '../../../constants/animations';
import { PHILOSOPHY_IMAGES } from './philosophyData';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  activeIndex: number;
}

export function ImageSlider({ activeIndex }: ImageSliderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.decorDot} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className={styles.slideWrapper}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={fadeIn.transition}
        >
          <img
            src={PHILOSOPHY_IMAGES[activeIndex]}
            alt={`Philosophy ${activeIndex + 1}`}
            className={styles.image}
          />
        </motion.div>
      </AnimatePresence>

      <div className={styles.mobileOverlay} />
    </div>
  );
}
