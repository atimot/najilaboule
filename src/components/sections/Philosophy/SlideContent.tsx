import { motion, AnimatePresence } from 'motion/react';
import { renderMultiline, renderWithSeparator } from '../../../utils/renderMultiline';
import { fadeIn } from '../../../constants/animations';
import styles from './SlideContent.module.css';

interface SlideContentProps {
  activeIndex: number;
  title?: string;
  body?: string;
}

export function SlideContent({ activeIndex, title, body }: SlideContentProps) {
  return (
    <div className={styles.stack}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={fadeIn.transition}
        >
          <div className={styles.contentWrapper}>
            <h3 className={styles.title}>
              {title && renderWithSeparator(title, '、')}
            </h3>
            <div className={styles.body}>
              <p>{body && renderMultiline(body)}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
