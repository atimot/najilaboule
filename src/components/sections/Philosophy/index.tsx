import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { fadeInUp } from '../../../constants/animations';
import { TIMING } from '../../../constants/animations';
import { PHILOSOPHY_IMAGES } from './philosophyData';
import { ImageSlider } from './ImageSlider';
import { SlideContent } from './SlideContent';
import { SlideNavigation } from './SlideNavigation';
import styles from './Philosophy.module.css';

export function Philosophy() {
  const { philoSlides } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PHILOSOPHY_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, TIMING.PHILOSOPHY_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentSlide = philoSlides[activeIndex];

  return (
    <section id="philosophy" ref={sectionRef} className={styles.section}>
      <div className={styles.wrapper}>
        <motion.div
          className={styles.imageContainer}
          initial={fadeInUp.initial}
          animate={isInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <ImageSlider activeIndex={activeIndex} />
        </motion.div>

        <motion.div
          className={styles.textContainer}
          initial={fadeInUp.initial}
          animate={isInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          <div className={styles.textInner}>
            <SlideContent
              activeIndex={activeIndex}
              title={currentSlide?.title}
              body={currentSlide?.body}
            />
            <SlideNavigation
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
