import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { BrandDots } from '../ui/BrandDots';
import { renderWithSeparator } from '../../utils/renderMultiline';
import { fadeIn } from '../../constants/animations';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="sake_01.JPG"
          alt="Ginza Bar Atmosphere"
          className="w-full h-full object-cover opacity-50 grayscale scale-110 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base/60 via-transparent to-base" />
      </div>

      <div className="relative z-10 text-center px-6 md:px-20">
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 3, duration: 2 }}
        >
          <BrandDots size="md" className="w-fit mx-auto mb-10" />
        </motion.div>

        <motion.h2
          className="text-display font-serif mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 2 }}
        >
          {renderWithSeparator(t.hero_title, '、')}
        </motion.h2>

        <motion.p
          className="text-body-main text-gray-400"
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
