import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { language, setLanguage } = useLanguage();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className="fixed inset-0 z-50 bg-base/80 backdrop-blur-[28px] backdrop-saturate-150 overflow-y-auto overscroll-contain md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                { href: '#philosophy', label: 'Philosophy' },
                { href: '#menu', label: 'Menu' },
                { href: '#access', label: 'Access' },
              ].map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={item.href}
                    className="hover:text-accent transition"
                    onClick={handleLinkClick}
                  >
                    {item.label}
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
                  href="#"
                  className="border border-white/50 px-8 py-3 hover:bg-accent hover:border-accent hover:text-[#241816] transition duration-500 text-sm"
                >
                  RESERVATION
                </a>
              </motion.li>
            </motion.ul>

            {/* Language Switch */}
            <motion.div
              className="flex space-x-6 text-sm tracking-widest font-serif mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                className={`hover:opacity-70 transition pb-1 ${language === 'ja' ? 'lang-active' : ''}`}
                onClick={() => setLanguage('ja')}
              >
                JP
              </button>
              <span className="opacity-50">|</span>
              <button
                className={`hover:opacity-70 transition pb-1 ${language === 'en' ? 'lang-active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

