import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { BrandDots } from '../../ui/BrandDots';
import { ReservationButton } from '../../common/buttons';
import { fadeInUp } from '../../../constants/animations';
import { SITE_CONFIG } from '../../../constants/config';
import { ContactInfo } from './ContactInfo';
import { GoogleMap } from './GoogleMap';
import styles from './Access.module.css';

export function Access() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="access" ref={sectionRef} className={styles.section}>
      <div className={styles.wrapper}>
        <motion.div
          className={styles.header}
          initial={fadeInUp.initial}
          animate={isInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <BrandDots size="sm" className={styles.dots} />
          <h2 className={styles.title}>{SITE_CONFIG.name}</h2>
          <p className={styles.subtitle}>GINZA</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial={fadeInUp.initial}
          animate={isInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          <ContactInfo />
          <div className={styles.reservationWrapper}>
            <ReservationButton variant="filled" size="lg" />
          </div>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={isInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
        >
          <GoogleMap />
        </motion.div>
      </div>
    </section>
  );
}
