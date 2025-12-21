import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export function SoupeSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto mb-32 flex flex-col md:flex-row-reverse items-center gap-12">
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=2670"
            alt="Soup"
            className="w-full h-full object-cover hover:scale-105 transition duration-[2s] brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-60" />
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2 md:pr-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <span className="text-accent text-xs tracking-[0.3em] block mb-2">SOUPE</span>
        <h3 className="text-3xl md:text-4xl font-serif mb-8">{t.soupe_title}</h3>
        <p className="text-gray-400 leading-loose text-sm md:text-base font-light mb-8">
          {t.soupe_desc.split('。').map((sentence, i, arr) => (
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
        <a
          href="#"
          className="inline-block border-b border-accent pb-1 text-xs tracking-widest hover:text-accent transition"
        >
          VIEW MENU
        </a>
      </motion.div>
    </div>
  );
}

