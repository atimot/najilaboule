import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BrandDots } from '../BrandDots';
import { TIMING } from '../../../constants/animations';
import { SITE_CONFIG } from '../../../constants/config';
import styles from './Loader.module.css';

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, TIMING.LOADER_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <BrandDots size="lg" className={styles.dotsWrapper} animated />

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {SITE_CONFIG.name}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
