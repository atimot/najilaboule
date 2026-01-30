import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

const TAG_MAP = {
  1: 'h2',
  2: 'h3',
  3: 'h4',
} as const;

export function SectionHeading({
  children,
  level = 1,
  className = '',
}: SectionHeadingProps) {
  const Tag = TAG_MAP[level];
  const levelClass = styles[`level${level}` as keyof typeof styles];

  return (
    <Tag className={`${styles.heading} ${levelClass} ${className}`}>
      {children}
    </Tag>
  );
}
