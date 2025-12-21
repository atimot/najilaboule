import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const images = [
  'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000',
];

export function Philosophy() {
  const { philoSlides } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section id="philosophy" className="py-24 md:py-40 px-6 md:px-20 relative" ref={sectionRef}>
      <div className="max-w-6xl mx-auto md:flex md:flex-row md:items-center md:justify-between">
        {/* Left: Image Slider */}
        <motion.div
          className="philo-bg absolute inset-0 w-full md:static md:w-1/2 md:mb-0 pointer-events-none z-0"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto md:aspect-[4/5]">
            {/* Decorative Dot */}
            <div className="hidden md:block absolute -top-10 -left-10 w-2 h-2 rounded-full bg-dot-red blur-[1px] z-10" />

            {/* Slides */}
            {images.map((src, index) => (
              <motion.img
                key={src}
                src={src}
                alt={`Philosophy ${index + 1}`}
                className="philo-slide absolute inset-0 w-full h-full object-cover brightness-75"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === activeIndex ? 1 : 0 }}
                transition={{ duration: 2 }}
              />
            ))}

            {/* Mobile Overlay */}
            <div className="absolute inset-0 md:hidden bg-gradient-to-b from-base/85 via-base/50 to-base/85 z-10" />
          </div>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className="relative z-10 w-full md:w-1/2 md:pl-20 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="mx-auto max-w-xl md:max-w-none">
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
                    <h3 className="text-2xl md:text-3xl font-serif tracking-widest mb-8 md:mb-12 leading-relaxed">
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
                    <div className="space-y-8 text-sm md:text-base leading-loose tracking-wider text-gray-300 font-light">
                      <p>
                        {philoSlides[activeIndex]?.body.split('。').map((sentence, i, arr) => (
                          <span key={i}>
                            {sentence}
                            {i < arr.length - 1 && sentence && (
                              <>
                                。<br />
                              </>
                            )}
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

