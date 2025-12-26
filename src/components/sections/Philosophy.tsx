import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const images = [
  'riz_01.JPG',
  'counter_01.JPG',
  'counter_02.JPG',
];

export function Philosophy() {
  const { philoSlides } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section id="philosophy" className="section-padding min-h-screen md:min-h-0 relative flex items-center" ref={sectionRef}>
      <div className="content-wrapper w-full md:flex md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Left: Image Slider */}
        <motion.div
          className="philo-bg absolute inset-0 w-full md:static md:w-[55%] md:mb-0 pointer-events-none z-0"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto md:h-[700px]">
            {/* Decorative Dot */}
            <div className="hidden md:block absolute -top-10 -left-10 w-2 h-2 rounded-full bg-dot-red blur-[1px] z-10" />

            {/* Slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <img
                  src={images[activeIndex]}
                  alt={`Philosophy ${activeIndex + 1}`}
                  className="philo-slide w-full h-full object-cover brightness-75"
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Overlay */}
            <div className="absolute inset-0 md:hidden bg-gradient-to-b from-base/85 via-base/50 to-base/85 z-10" />
          </div>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className="relative z-10 w-full md:w-[45%] text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="mx-auto md:max-w-none">
            <div className="philo-text-stack">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="mx-auto max-w-[92vw] md:max-w-none">
                    <h3 className="text-heading-2 font-serif mb-8 md:mb-12 leading-relaxed">
                      {philoSlides[activeIndex]?.title.split('、').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <>
                              、<br />
                            </>
                          )}
                        </span>
                      ))}
                    </h3>
                    <div className="space-y-8 text-body-main text-gray-300 font-light">
                      <p>
                        {philoSlides[activeIndex]?.body.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < philoSlides[activeIndex]?.body.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Dots */}
            <div className="mt-16 flex justify-center md:justify-start gap-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full bg-dot-white cursor-pointer transition-all duration-300 ${
                    index === activeIndex ? 'opacity-100 scale-125' : 'opacity-30 hover:opacity-70'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

