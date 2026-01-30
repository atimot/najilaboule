import styles from './HamburgerButton.module.css';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={onClick}
        aria-label="メニューを開く"
        aria-expanded={isOpen}
      >
        <span
          className={`${styles.line} ${isOpen ? styles.lineTopOpen : styles.lineTop}`}
        />
        <span
          className={`${styles.line} ${isOpen ? styles.lineBottomOpen : styles.lineBottom}`}
        />
      </button>
    </div>
  );
}
