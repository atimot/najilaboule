import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { fadeIn, SITE_CONFIG } from "@/constants";
import { useLanguage } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ReservationButton } from "@/components/ReservationButton";

const NAVIGATION_IDS = ["access"] as const;

function LanguageSwitch({
  className = "",
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={clsx(
        "flex gap-4 text-xs tracking-widest font-serif",
        className,
      )}
    >
      <button
        className={clsx(
          "bg-transparent border-none text-inherit cursor-pointer p-0 transition-opacity duration-300 hover:opacity-70",
          language === "ja" && "font-bold text-accent border-b border-accent",
        )}
        onClick={() => {
          setLanguage("ja");
          onClose?.();
        }}
      >
        JP
      </button>
      <span className="opacity-50">|</span>
      <button
        className={clsx(
          "bg-transparent border-none text-inherit cursor-pointer p-0 transition-opacity duration-300 hover:opacity-70",
          language === "en" && "font-bold text-accent border-b border-accent",
        )}
        onClick={() => {
          setLanguage("en");
          onClose?.();
        }}
      >
        EN
      </button>
    </div>
  );
}

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="fixed top-6 right-6 z-[60] md:hidden">
      <button
        className="relative flex flex-col justify-center items-center w-10 h-10 cursor-pointer z-[60] bg-transparent border-none p-0"
        onClick={onClick}
        aria-label={isOpen ? t.aria_menu_close : t.aria_menu_open}
        aria-expanded={isOpen}
      >
        <span
          className={clsx(
            "absolute w-7 h-px bg-white transition-transform duration-300 origin-center",
            isOpen ? "translate-y-0 rotate-45" : "-translate-y-1",
          )}
        />
        <span
          className={clsx(
            "absolute w-7 h-px bg-white transition-transform duration-300 origin-center",
            isOpen ? "translate-y-0 -rotate-45" : "translate-y-1",
          )}
        />
      </button>
    </div>
  );
}

function DesktopNav() {
  const { t } = useLanguage();
  const navLabels: Record<(typeof NAVIGATION_IDS)[number], string> = {
    access: t.nav_access,
  };
  return (
    <nav className="hidden md:block">
      <ul className="flex gap-8 text-sm tracking-widest items-center">
        {NAVIGATION_IDS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="transition-colors duration-300 hover:text-accent"
            >
              {navLabels[id]}
            </a>
          </li>
        ))}
        <li>
          <ReservationButton variant="outline" size="sm" />
        </li>
      </ul>
    </nav>
  );
}

function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const navLabels: Record<(typeof NAVIGATION_IDS)[number], string> = {
    access: t.nav_access,
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className="fixed inset-0 z-50 bg-brand/80 backdrop-blur-[28px] backdrop-saturate-150 overflow-y-auto overscroll-contain md:hidden"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={{ duration: 0.5 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="min-h-dvh flex flex-col items-center justify-center py-20 px-6">
            <motion.ul
              className="flex flex-col items-center gap-8 text-lg tracking-widest"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {NAVIGATION_IDS.map((id) => (
                <motion.li
                  key={id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={`#${id}`}
                    onClick={onClose}
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    {navLabels[id]}
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
                <ReservationButton variant="outline" size="md" />
              </motion.li>
            </motion.ul>

            <motion.div
              className="mt-12"
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ delay: 0.5 }}
            >
              <LanguageSwitch className="gap-6 text-sm" onClose={onClose} />
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobileMenuOpen]);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 w-full z-40 p-6 md:p-10 flex justify-between items-start bg-gradient-to-b from-brand/90 to-transparent text-white backdrop-blur-[2px]"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <a
          href="#top"
          onClick={handleHomeClick}
          aria-label={t.aria_home}
          className="font-serif text-xl md:text-2xl tracking-widest cursor-pointer text-left p-0"
        >
          {SITE_CONFIG.name}
          <span className="text-xs md:text-sm tracking-[0.2em] block mt-1 text-gray-400">
            ナジラブール
          </span>
        </a>

        <div className="flex flex-row items-center gap-6">
          <DesktopNav />
          <LanguageSwitch className="hidden md:flex pointer-events-auto" />
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
