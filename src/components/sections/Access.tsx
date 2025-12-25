import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { BrandDots } from '../ui/BrandDots';

export function Access() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="access" className="section-padding bg-base-dark relative" ref={sectionRef}>
      <div className="content-wrapper text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <BrandDots size="sm" className="inline-grid opacity-50 mb-8" />
          <h2 className="text-heading-1 font-serif mb-2">Naji la boule</h2>
          <p className="text-section-label text-gray-500">GINZA</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 text-left mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">ADDRESS</p>
              <p className="font-serif">
                {t.address_text.split(' ').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">TEL</p>
              <p className="font-serif">
                <a href="tel:03-6274-6608" className="hover:text-accent transition">
                  03-6274-6608
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 tracking-widest mb-1">HOURS</p>
              <p className="font-serif">
                {t.hours_text.split(' / ')[0]}
                <br />
                <span className="text-xs text-gray-500">{t.hours_text.split(' / ')[1]}</span>
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <a
              href="tel:03-6274-6608"
              className="block w-full py-4 bg-white/5 border border-white/20 text-center hover:bg-white hover:text-[#241816] transition duration-300 tracking-widest text-sm"
            >
              RESERVATION
            </a>
          </div>
        </motion.div>

        <motion.div
          className="w-full h-64"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}

