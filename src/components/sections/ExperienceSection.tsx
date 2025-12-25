import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

export function ExperienceSection() {
  const { t } = useLanguage();
  const soupeRef = useRef(null);
  const mariageRef = useRef(null);
  const isSoupeInView = useInView(soupeRef, { once: true, margin: '-100px' });
  const isMariageInView = useInView(mariageRef, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="section-padding">
      <div className="content-wrapper flex flex-col gap-24 md:gap-32">
        {/* Soupe Block */}
        <div ref={soupeRef} className="flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={isSoupeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src="menu_01.JPG"
                alt="Soup"
                className="w-full h-full object-cover hover:scale-105 transition duration-[2s] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 md:pr-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isSoupeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-section-label block mb-2">SOUPE</span>
            <h3 className="text-heading-1 font-serif mb-8">{t.soupe_title}</h3>
            <p className="text-body-main text-gray-400 font-light mb-8">
              {t.soupe_desc.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < t.soupe_desc.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </motion.div>
        </div>

        {/* Mariage Block */}
        <div ref={mariageRef} className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={isMariageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src="sake_01.JPG"
                alt="Sake"
                className="w-full h-full object-cover hover:scale-105 transition duration-[2s] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 md:pl-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isMariageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-section-label block mb-2">MARIAGE</span>
            <h3 className="text-heading-1 font-serif mb-8">{t.mariage_title}</h3>
            <p className="text-body-main text-gray-400 font-light mb-8">
              {t.mariage_desc.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < t.mariage_desc.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
