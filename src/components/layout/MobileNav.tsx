import { motion, AnimatePresence } from 'motion/react';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { fadeIn } from '../../constants/animations';
import { SITE_CONFIG, NAVIGATION } from '../../constants/config';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className="fixed inset-0 z-50 bg-base/80 backdrop-blur-[28px] backdrop-saturate-150 overflow-y-auto overscroll-contain md:hidden"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={{ duration: 0.5 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="min-h-[100dvh] flex flex-col items-center justify-center py-20 px-6">
            <motion.ul
              className="flex flex-col items-center space-y-8 text-lg tracking-widest"
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
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={`#${section.id}`}
                    className="hover:text-accent transition"
                    onClick={onClose}
                  >
                    {section.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                className="mt-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <a
                  href={SITE_CONFIG.phoneLink}
                  className="border border-white/50 px-8 py-3 hover:bg-accent hover:border-accent hover:text-base transition duration-500 text-sm"
                >
                  RESERVATION
                </a>
              </motion.li>
            </motion.ul>

            {/* Language Switch */}
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <LanguageSwitch className="space-x-6 text-sm" />
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
