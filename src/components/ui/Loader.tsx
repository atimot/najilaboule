import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BrandDots } from './BrandDots';
import { TIMING } from '../../constants/animations';
import { SITE_CONFIG } from '../../constants/config';

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
          className="fixed inset-0 z-50 bg-base flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <BrandDots size="lg" className="mb-8" animated />

          <motion.h1
            className="text-2xl tracking-[0.3em] font-serif"
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
