import { motion, AnimatePresence } from 'motion/react';
import { LanguageSwitch } from '../../ui/LanguageSwitch';
import { NavLink, ReservationButton } from '../../common';
import { fadeIn } from '../../../constants/animations';
import { NAVIGATION } from '../../../constants/config';
import styles from './MobileNav.module.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className={styles.nav}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={{ duration: 0.5 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className={styles.content}>
            <motion.ul
              className={styles.list}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {NAVIGATION.sections.map((section) => (
                <motion.li
                  key={section.id}
                  className={styles.listItem}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <NavLink
                    href={`#${section.id}`}
                    onClick={onClose}
                    className={styles.link}
                  >
                    {section.label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                className={styles.reservationItem}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ReservationButton variant="outline" size="md" />
              </motion.li>
            </motion.ul>

            <motion.div
              className={styles.languageWrapper}
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ delay: 0.5 }}
            >
              <LanguageSwitch className={styles.languageSwitch} />
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
