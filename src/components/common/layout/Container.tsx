import styles from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function Container({ children, className = '', centered = false }: ContainerProps) {
  const centeredClass = centered ? styles.centered : '';

  return (
    <div className={`${styles.container} ${centeredClass} ${className}`}>
      {children}
    </div>
  );
}
