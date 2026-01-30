import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`${styles.label} ${className}`}>
      {children}
    </p>
  );
}
