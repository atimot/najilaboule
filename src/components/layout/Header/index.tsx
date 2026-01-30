import { useState } from 'react';
import { motion } from 'motion/react';
import { MobileNav } from '../MobileNav';
import { LanguageSwitch } from '../../ui/LanguageSwitch';
import { fadeIn } from '../../../constants/animations';
import { SITE_CONFIG } from '../../../constants/config';
import { DesktopNav } from './DesktopNav';
import { HamburgerButton } from './HamburgerButton';
import styles from './Header.module.css';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={styles.header}
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div className={styles.logo} onClick={scrollToTop}>
          {SITE_CONFIG.name}
          <span className={styles.logoSub}>ナジラブール</span>
        </div>

        <div className={styles.rightSection}>
          <LanguageSwitch className={styles.languageSwitchDesktop} />
          <DesktopNav />
        </div>
      </motion.header>

      <HamburgerButton
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
