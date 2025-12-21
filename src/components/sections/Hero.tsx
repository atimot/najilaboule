import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { BrandDots } from '../ui/BrandDots';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2670"
          alt="Ginza Bar Atmosphere"
          className="w-full h-full object-cover opacity-50 grayscale scale-110 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base/60 via-transparent to-base" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
        >
          <BrandDots size="md" className="w-fit mx-auto mb-10" />
        </motion.div>

        <motion.h2
          className="text-4xl md:text-7xl font-serif tracking-widest mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 2 }}
        >
          {t.hero_title.split('、').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <>
                  、<br className="md:hidden" />
                </>
              )}
            </span>
          ))}
        </motion.h2>

        <motion.p
          className="text-sm md:text-base tracking-[0.3em] text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 2 }}
        >
          Riz et Soupe, et un peu d'alcool.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 2 }}
      >
        <motion.svg
          width="20"
          height="48"
          viewBox="0 0 20 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M10 2v40M3 38l7 7 7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

