import { Fragment, useState, useEffect, useRef, type RefObject } from "react";
import { m, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { fadeIn, SITE_CONFIG } from "@/constants";
import { useLanguage, type Language, type Translations } from "@/i18n";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ReservationButton } from "@/components/ReservationButton";

const NAVIGATION_IDS = ["access"] as const;
const MOBILE_NAV_ID = "mobile-menu";

const LANGUAGE_OPTIONS: readonly { code: Language; label: string }[] = [
  { code: "ja", label: "JP" },
  { code: "en", label: "EN" },
];

const getNavLabels = (
  t: Translations,
): Record<(typeof NAVIGATION_IDS)[number], string> => ({
  access: t.nav_access,
});

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
      {LANGUAGE_OPTIONS.map(({ code, label }, index) => (
        <Fragment key={code}>
          {index > 0 && (
            <span className="opacity-50" aria-hidden="true">
              |
            </span>
          )}
          <button
            className={clsx(
              "bg-transparent border-none text-inherit cursor-pointer p-0 transition-opacity duration-300 hover:opacity-70",
              language === code && "font-bold text-accent border-b border-accent",
            )}
            onClick={() => {
              setLanguage(code);
              onClose?.();
            }}
            aria-pressed={language === code}
          >
            {label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

function HamburgerButton({
  isOpen,
  onClick,
  buttonRef,
}: {
  isOpen: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const { t } = useLanguage();
  return (
    <div className="fixed top-6 right-6 z-[60] md:hidden">
      <button
        ref={buttonRef}
        className="relative flex flex-col justify-center items-center w-10 h-10 cursor-pointer z-[60] bg-transparent border-none p-0"
        onClick={onClick}
        aria-label={isOpen ? t.aria_menu_close : t.aria_menu_open}
        aria-expanded={isOpen}
        aria-controls={MOBILE_NAV_ID}
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
  const navLabels = getNavLabels(t);
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
  navRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  navRef: RefObject<HTMLElement | null>;
}) {
  const { t } = useLanguage();
  const navLabels = getNavLabels(t);
  return (
    <AnimatePresence>
      {isOpen && (
        <m.nav
          ref={navRef}
          id={MOBILE_NAV_ID}
          // aria-modal は付けない: 唯一の閉じるボタン (HamburgerButton) がダイアログの
          // 外にあり、aria-modal だと支援技術から隠れてしまう。背景の隔離は inert で行う
          role="dialog"
          aria-label={t.menu_label}
          className="fixed inset-0 z-50 bg-brand/80 backdrop-blur-[28px] backdrop-saturate-150 overflow-y-auto overscroll-contain md:hidden"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.initial}
          transition={{ duration: 0.5 }}
        >
          <div
            className="min-h-dvh flex flex-col items-center justify-center py-20 px-6"
            onClick={(e) => {
              // メニュー項目の外側 (この余白 div 自身) のタップで閉じる
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <m.ul
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
                <m.li
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
                </m.li>
              ))}
              <m.li
                className="mt-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ReservationButton variant="outline" size="md" />
              </m.li>
            </m.ul>

            <m.div
              className="mt-12"
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ delay: 0.5 }}
            >
              <LanguageSwitch className="gap-6 text-sm" onClose={onClose} />
            </m.div>
          </div>
        </m.nav>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useBodyScrollLock(isMobileMenuOpen);

  // メニュー表示中: Tab をハンバーガー+メニュー内に閉じ込め、
  // 背景 (header/main/footer) は inert でスクリーンリーダーからも隠す。
  // 閉じたらハンバーガーへフォーカスを戻す
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const hamburgerButton = hamburgerRef.current;

    const inertTargets = [
      headerRef.current,
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);
    inertTargets.forEach((el) => el.setAttribute("inert", ""));

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables: HTMLElement[] = [
        ...(hamburgerButton ? [hamburgerButton] : []),
        ...(mobileNavRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? []),
      ];
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !focusables.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      inertTargets.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", handler);
      hamburgerButton?.focus();
    };
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
      <m.header
        ref={headerRef}
        className="fixed top-0 w-full z-40 p-6 md:p-10 flex justify-between items-start bg-linear-to-b from-brand/90 to-transparent text-white backdrop-blur-[2px]"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ delay: prefersReducedMotion ? 0.3 : 2.5, duration: prefersReducedMotion ? 0.5 : 1 }}
      >
        <a
          href="#top"
          onClick={handleHomeClick}
          className="font-serif text-xl md:text-2xl tracking-widest cursor-pointer text-left p-0"
        >
          {SITE_CONFIG.name}
          <span
            lang="ja"
            className="text-xs md:text-sm tracking-[0.2em] block mt-1 text-gray-400"
          >
            {t.brand_kana}
          </span>
        </a>

        <div className="flex flex-row items-center gap-6">
          <DesktopNav />
          <LanguageSwitch className="hidden md:flex pointer-events-auto" />
        </div>
      </m.header>

      <HamburgerButton
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        buttonRef={hamburgerRef}
      />

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navRef={mobileNavRef}
      />
    </>
  );
}
