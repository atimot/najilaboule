import { useLanguage } from '../../../context/LanguageContext';
import styles from './LanguageSwitch.module.css';

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className = '' }: LanguageSwitchProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        className={`${styles.button} ${language === 'ja' ? styles.active : ''}`}
        onClick={() => setLanguage('ja')}
      >
        JP
      </button>
      <span className={styles.separator}>|</span>
      <button
        className={`${styles.button} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
