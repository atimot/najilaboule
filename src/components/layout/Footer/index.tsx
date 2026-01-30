import { SITE_CONFIG } from '../../../constants/config';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      &copy; {currentYear} {SITE_CONFIG.name}. All Rights Reserved.
    </footer>
  );
}
