import { m, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BrandDots } from '@/components/BrandDots';
import { TIMING, SITE_CONFIG } from '@/constants';
import { useLanguage } from '@/i18n';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const duration = prefersReducedMotion
    ? TIMING.LOADER_DURATION_REDUCED
    : TIMING.LOADER_DURATION;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // 下にマウント済みのコンテンツがローダー表示中にスクロールされないようロック
  useBodyScrollLock(isVisible);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className="fixed inset-0 z-50 bg-brand flex flex-col items-center justify-center"
          role="status"
          aria-label={t.aria_loading}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 1, ease: 'easeInOut' }}
        >
          <BrandDots size="lg" className="mb-8" animated />

          <m.p
            className="text-2xl tracking-[0.3em] font-serif"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { delay: 0, duration: 0.2 }
                : { delay: 1, duration: 1 }
            }
          >
            {SITE_CONFIG.name}
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
