import { useState } from 'react';
import { motion } from 'motion/react';
import { MobileNav } from './MobileNav';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { fadeIn } from '../../constants/animations';
import { SITE_CONFIG, NAVIGATION } from '../../constants/config';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 w-full z-40 p-6 md:p-10 flex justify-between items-start transition-all duration-500 bg-gradient-to-b from-base/90 to-transparent text-white backdrop-blur-[2px]"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div
          className="logo font-serif text-xl md:text-2xl tracking-widest cursor-pointer"
          onClick={scrollToTop}
        >
          {SITE_CONFIG.name}
          <br />
          <span className="text-xs md:text-sm tracking-[0.2em] block mt-1 text-gray-400">
            ナジラブール
          </span>
        </div>

        <div className="flex flex-col items-end gap-6">
          {/* Language Switch (PC) */}
          <LanguageSwitch className="hidden md:flex pointer-events-auto" />

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-sm tracking-widest">
              {NAVIGATION.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:text-accent transition">
                    {section.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SITE_CONFIG.phoneLink}
                  className="border border-white/50 px-6 py-2 hover:bg-accent hover:border-accent hover:text-base transition duration-500 text-xs"
                >
                  RESERVATION
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-6 right-6 z-[60]">
        <button
          className="relative flex flex-col justify-center items-center w-10 h-10 cursor-pointer z-[60]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="メニューを開く"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`hamburger-line w-7 h-[1px] bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'translate-y-[4px] rotate-45' : ''
            }`}
          />
          <span
            className={`hamburger-line w-7 h-[1px] bg-white mt-2 transition-all duration-300 ${
              isMobileMenuOpen ? '-translate-y-[4px] -rotate-45 mt-0' : ''
            }`}
          />
        </button>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
