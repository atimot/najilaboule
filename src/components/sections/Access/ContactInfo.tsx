import { useLanguage } from '../../../context/LanguageContext';
import { renderMultiline } from '../../../utils/renderMultiline';
import { SITE_CONFIG } from '../../../constants/config';
import styles from './ContactInfo.module.css';

export function ContactInfo() {
  const { t } = useLanguage();
  const [mainHours, closedInfo] = t.hours_text.split(' / ');

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <p className={styles.label}>ADDRESS</p>
        <p className={styles.value}>{renderMultiline(t.address_text, ' ')}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.label}>TEL</p>
        <p className={styles.value}>
          <a href={SITE_CONFIG.phoneLink} className={styles.link}>
            {SITE_CONFIG.phone}
          </a>
        </p>
      </div>
      <div className={styles.item}>
        <p className={styles.label}>HOURS</p>
        <p className={styles.value}>
          {mainHours}
          <br />
          <span className={styles.subtext}>{closedInfo}</span>
        </p>
      </div>
    </div>
  );
}
