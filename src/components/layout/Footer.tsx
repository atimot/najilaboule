import { SITE_CONFIG } from '../../constants/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-[10px] tracking-widest text-gray-600 border-t border-white/5">
      &copy; {currentYear} {SITE_CONFIG.name}. All Rights Reserved.
    </footer>
  );
}
