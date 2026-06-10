import { SITE_CONFIG } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-[10px] tracking-widest tabular-nums text-gray-400 border-t border-white/5">
      &copy; {currentYear} {SITE_CONFIG.name}. All Rights Reserved.
    </footer>
  );
}
