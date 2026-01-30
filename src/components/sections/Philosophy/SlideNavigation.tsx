import { PHILOSOPHY_IMAGES } from './philosophyData';
import styles from './SlideNavigation.module.css';

interface SlideNavigationProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function SlideNavigation({ activeIndex, onSelect }: SlideNavigationProps) {
  return (
    <div className={styles.container}>
      {PHILOSOPHY_IMAGES.map((_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${index === activeIndex ? styles.active : styles.inactive}`}
          onClick={() => onSelect(index)}
          aria-label={`Slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
