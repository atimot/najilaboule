import styles from './NavLink.module.css';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function NavLink({ href, children, onClick, className = '' }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`${styles.link} ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
