import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeInUp } from '../../constants/animations';

interface SectionHeaderProps {
  label: string;
  title: string;
  className?: string;
}

/**
 * アニメーション付きセクションヘッダー
 * スクロールで表示されるとフェードイン+スライドアップ
 */
export function SectionHeader({ label, title, className = '' }: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : {}}
      transition={fadeInUp.transition}
    >
      <span className="text-section-label block mb-2">{label}</span>
      <h3 className="text-heading-1 font-serif">{title}</h3>
    </motion.div>
  );
}
