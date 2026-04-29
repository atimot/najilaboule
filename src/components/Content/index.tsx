import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import clsx from 'clsx';
import { useLanguage } from '@/i18n';
import { fadeIn, fadeInUp, TIMING, SITE_CONFIG } from '@/constants';
import { heroImages, philosophySlides, experienceImages } from '@/images';
import { BrandDots } from '@/components/BrandDots';
import { ReservationButton } from '@/components/ReservationButton';

// ─── Sections ───

function HeroSection() {
  const { language, t } = useLanguage();
  const hero = heroImages.background;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={hero.src}
          alt={hero.alt[language]}
          className="w-full h-full object-cover opacity-50 grayscale scale-110 animate-slow-zoom"
          width={hero.width}
          height={hero.height}
          fetchPriority={hero.fetchPriority}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand/60 via-transparent to-brand" />
      </div>

      <div className="relative z-10 text-center px-6 md:px-20">
        <motion.div
          className="w-fit mx-auto mb-10"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 3, duration: 2 }}
        >
          <BrandDots size="md" />
        </motion.div>

        <motion.h2
          className="text-4xl md:text-[3.5rem] font-serif tracking-[0.2em] mb-6 whitespace-pre-line"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 2 }}
        >
          {t.hero_title}
        </motion.h2>

        <motion.p
          className="text-sm md:text-base leading-loose tracking-widest text-gray-400"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 4, duration: 2 }}
        >
          Riz et Soupe, et un peu d'alcool.
        </motion.p>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const { language, philoSlides } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const philoRef = useRef(null);
  const isPhiloInView = useInView(philoRef, { once: true });

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % philosophySlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, TIMING.PHILOSOPHY_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      id="philosophy"
      ref={philoRef}
      className="px-6 py-24 md:px-20 md:py-40 min-h-screen md:min-h-0 relative flex items-center"
    >
      <div aria-hidden="true" className="hidden md:block pointer-events-none">
        <span className="absolute top-24 right-[8%] size-1.5 rounded-full bg-accent/40 blur-[1px]" />
        <span className="absolute bottom-32 right-[18%] size-1 rounded-full bg-dot-yellow/30 blur-[1px]" />
      </div>
      <div className="max-w-[80rem] mx-auto w-full md:flex md:flex-row md:items-center md:justify-between md:gap-8">
        <motion.div
          className="absolute inset-0 w-full pointer-events-none z-0 md:static md:w-[55%]"
          initial={fadeInUp.initial}
          animate={isPhiloInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <div className="absolute inset-0 overflow-hidden md:relative md:inset-auto md:h-[700px]">
            <div className="hidden md:block md:absolute md:-top-10 md:-left-10 md:size-2 md:rounded-full md:bg-dot-red md:blur-[1px] md:z-10" />

            {philosophySlides.map((image, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                animate={{ opacity: index === activeIndex ? 1 : 0 }}
                transition={fadeIn.transition}
              >
                <img
                  src={image.src}
                  alt={image.alt[language]}
                  className="w-full h-full object-cover brightness-[0.25]"
                  width={image.width}
                  height={image.height}
                  loading={image.loading}
                />
              </motion.div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-brand/85 via-brand/50 to-brand/85 z-10 md:hidden" />
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 w-full text-center md:w-[45%] md:text-left"
          initial={fadeInUp.initial}
          animate={isPhiloInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          <div className="mx-auto md:max-w-none">
            <div className="grid">
              {philoSlides.map((slide, index) => (
                <motion.div
                  key={index}
                  className={clsx('[grid-area:1/1]', index !== activeIndex && 'pointer-events-none')}
                  animate={{ opacity: index === activeIndex ? 1 : 0 }}
                  transition={fadeIn.transition}
                  aria-hidden={index !== activeIndex}
                >
                  <div className="mx-auto max-w-[92vw] md:max-w-none">
                    <h3 className="text-2xl md:text-3xl font-serif mb-8 md:mb-12 leading-relaxed tracking-widest whitespace-pre-line">
                      {slide.title}
                    </h3>
                    <div className="text-sm md:text-base leading-loose tracking-widest text-gray-300 font-light whitespace-pre-line">
                      <p>{slide.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 flex justify-center md:justify-start gap-4">
              {philosophySlides.map((_, index) => (
                <button
                  key={index}
                  className={clsx(
                    'size-2 rounded-full bg-dot-white cursor-pointer transition-[opacity,transform] duration-300 border-none p-0',
                    index === activeIndex ? 'opacity-100 scale-125' : 'opacity-30 hover:opacity-70',
                  )}
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

function ExperienceSection() {
  const { language, t } = useLanguage();
  const expRizRef = useRef(null);
  const isExpRizInView = useInView(expRizRef, { once: true, margin: '-100px' });
  const expSoupeRef = useRef(null);
  const isExpSoupeInView = useInView(expSoupeRef, { once: true, margin: '-100px' });
  const expMariageRef = useRef(null);
  const isExpMariageInView = useInView(expMariageRef, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="px-6 py-24 md:px-20 md:py-40 relative">
      <div aria-hidden="true" className="hidden md:block pointer-events-none">
        <span className="absolute top-[18%] left-[6%] size-1.5 rounded-full bg-accent/30 blur-[1px]" />
        <span className="absolute top-[48%] right-[5%] size-1 rounded-full bg-dot-red/25 blur-[1px]" />
        <span className="absolute bottom-[20%] left-[10%] size-1 rounded-full bg-dot-blue/25 blur-[1px]" />
      </div>
      <div className="max-w-[80rem] mx-auto flex flex-col gap-24 md:gap-32">
        {/* RIZ CARD */}
        <div
          ref={expRizRef}
          className="flex flex-col items-center gap-12 md:flex-row-reverse"
        >
          <motion.div
            className="w-full md:w-1/2"
            initial={fadeInUp.initial}
            animate={isExpRizInView ? fadeInUp.animate : {}}
            transition={fadeInUp.transition}
          >
            <div className="relative aspect-video overflow-hidden group">
              <img src={experienceImages.riz.src} alt={experienceImages.riz.alt[language]} className="w-full h-full object-cover brightness-90 transition-transform duration-[2s] group-hover:scale-105" width={experienceImages.riz.width} height={experienceImages.riz.height} loading={experienceImages.riz.loading} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 md:pr-10"
            initial={fadeInUp.initial}
            animate={isExpRizInView ? fadeInUp.animate : {}}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <span className="text-xs tracking-[0.3em] text-accent block mb-2">RIZ</span>
            <h3 className="text-3xl md:text-[2.5rem] font-serif mb-8 tracking-widest">{t.riz_title}</h3>
            <p className="text-sm md:text-base leading-loose tracking-widest text-gray-400 font-light mb-8 whitespace-pre-line">{t.riz_desc}</p>
          </motion.div>
        </div>

        {/* SOUPE CARD */}
        <div
          ref={expSoupeRef}
          className="flex flex-col items-center gap-12 md:flex-row"
        >
          <motion.div
            className="w-full md:w-1/2"
            initial={fadeInUp.initial}
            animate={isExpSoupeInView ? fadeInUp.animate : {}}
            transition={fadeInUp.transition}
          >
            <div className="relative aspect-video overflow-hidden group">
              <img src={experienceImages.soupe.src} alt={experienceImages.soupe.alt[language]} className="w-full h-full object-cover brightness-90 transition-transform duration-[2s] group-hover:scale-105" width={experienceImages.soupe.width} height={experienceImages.soupe.height} loading={experienceImages.soupe.loading} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 md:pl-10"
            initial={fadeInUp.initial}
            animate={isExpSoupeInView ? fadeInUp.animate : {}}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <span className="text-xs tracking-[0.3em] text-accent block mb-2">SOUPE</span>
            <h3 className="text-3xl md:text-[2.5rem] font-serif mb-8 tracking-widest">{t.soupe_title}</h3>
            <p className="text-sm md:text-base leading-loose tracking-widest text-gray-400 font-light mb-8 whitespace-pre-line">{t.soupe_desc}</p>
          </motion.div>
        </div>

        {/* MARIAGE CARD */}
        <div
          ref={expMariageRef}
          className="flex flex-col items-center gap-12 md:flex-row-reverse"
        >
          <motion.div
            className="w-full md:w-1/2"
            initial={fadeInUp.initial}
            animate={isExpMariageInView ? fadeInUp.animate : {}}
            transition={fadeInUp.transition}
          >
            <div className="relative aspect-video overflow-hidden group">
              <img src={experienceImages.mariage.src} alt={experienceImages.mariage.alt[language]} className="w-full h-full object-cover brightness-90 transition-transform duration-[2s] group-hover:scale-105" width={experienceImages.mariage.width} height={experienceImages.mariage.height} loading={experienceImages.mariage.loading} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 md:pr-10"
            initial={fadeInUp.initial}
            animate={isExpMariageInView ? fadeInUp.animate : {}}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <span className="text-xs tracking-[0.3em] text-accent block mb-2">MARIAGE</span>
            <h3 className="text-3xl md:text-[2.5rem] font-serif mb-8 tracking-widest">{t.mariage_title}</h3>
            <p className="text-sm md:text-base leading-loose tracking-widest text-gray-400 font-light mb-8 whitespace-pre-line">{t.mariage_desc}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AccessSection() {
  const { t } = useLanguage();
  const accessRef = useRef(null);
  const isAccessInView = useInView(accessRef, { once: true, margin: '-100px' });

  return (
    <section id="access" ref={accessRef} className="px-6 py-24 md:px-20 md:py-40 bg-brand-dark relative">
      <div className="max-w-[80rem] mx-auto text-center">
        <motion.div
          className="mb-12"
          initial={fadeInUp.initial}
          animate={isAccessInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <BrandDots size="sm" className="inline-grid opacity-50 mb-8" />
          <h3 className="text-3xl md:text-[2.5rem] font-serif mb-2 tracking-widest">{SITE_CONFIG.name}</h3>
          <p className="text-xs tracking-[0.3em] text-gray-500">GINZA</p>
        </motion.div>

        <motion.div
          className="grid gap-12 text-left mb-16 md:grid-cols-2"
          initial={fadeInUp.initial}
          animate={isAccessInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">ADDRESS</p>
              <p className="font-serif whitespace-pre-line">{t.address_text}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">TEL</p>
              <p className="font-serif whitespace-pre-line">
                <a href={SITE_CONFIG.phoneLink} className="transition-colors duration-300 hover:text-accent">
                  {SITE_CONFIG.phone}
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">HOURS</p>
              <p className="font-serif whitespace-pre-line">
                {t.hours_main}
                <br />
                <span className="text-xs text-gray-500">{t.hours_closed}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <ReservationButton variant="filled" size="lg" />
          </div>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={isAccessInView ? fadeInUp.animate : {}}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
        >
          <div className="w-full h-64">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%8A%80%E5%BA%A76-12-12%20%E9%8A%80%E5%BA%A7%E3%82%B9%E3%83%86%E3%83%A9%E3%83%93%E3%83%AB2%E9%9A%8E&output=embed&hl=ja"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Content ───

export function Content() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <ExperienceSection />
      <AccessSection />
    </>
  );
}
