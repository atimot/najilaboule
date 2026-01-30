import { EXPERIENCE_ITEMS } from './experienceData';
import { ExperienceBlock } from './ExperienceBlock';
import styles from './ExperienceSection.module.css';

export function ExperienceSection() {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.wrapper}>
        {EXPERIENCE_ITEMS.map((item) => (
          <ExperienceBlock key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
