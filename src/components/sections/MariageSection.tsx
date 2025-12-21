import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export function MariageSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="relative aspect-[3/4] md:aspect-square overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1592751523490-272cb9a7146c?auto=format&fit=crop&q=80&w=2574"
            alt="Sake"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-1000"
          />
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2 md:pl-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <span className="text-accent text-xs tracking-[0.3em] block mb-2">MARIAGE</span>
        <h3 className="text-3xl md:text-4xl font-serif mb-8">{t.mariage_title}</h3>
        <p className="text-gray-400 leading-loose text-sm md:text-base font-light mb-8">
          {t.mariage_desc.split('。').map((sentence, i, arr) => (
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
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 border border-gray-700 text-[10px] tracking-wider rounded-full text-gray-400">
            CHAMPAGNE
          </span>
          <span className="px-3 py-1 border border-gray-700 text-[10px] tracking-wider rounded-full text-gray-400">
            SAKE
          </span>
          <span className="px-3 py-1 border border-gray-700 text-[10px] tracking-wider rounded-full text-gray-400">
            WINE
          </span>
        </div>
      </motion.div>
    </div>
  );
}

