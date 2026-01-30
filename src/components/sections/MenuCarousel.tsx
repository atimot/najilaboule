import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useDragScroll } from '../../hooks/useDragScroll';
import { fadeInUp, getStaggeredFadeInUp } from '../../constants/animations';
import { IMAGES } from '../../constants/images';

interface MenuItem {
  id: number;
  image: string;
  nameKey: 'menu_1_name' | 'menu_2_name' | 'menu_3_name';
  descKey: 'menu_1_desc' | 'menu_2_desc' | 'menu_3_desc';
  dotColor: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    image: IMAGES.menu.items[0],
    nameKey: 'menu_1_name',
    descKey: 'menu_1_desc',
    dotColor: 'bg-dot-white',
  },
  {
    id: 2,
    image: IMAGES.menu.items[1],
    nameKey: 'menu_2_name',
    descKey: 'menu_2_desc',
    dotColor: 'bg-dot-orange',
  },
  {
    id: 3,
    image: IMAGES.menu.items[2],
    nameKey: 'menu_3_name',
    descKey: 'menu_3_desc',
    dotColor: 'bg-dot-red',
  },
];

export function MenuCarousel() {
  const { t } = useLanguage();
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });
  const { containerRef, isDragging, handlers } = useDragScroll();

  return (
    <section id="menu" className="py-24 md:py-40 bg-base-light relative overflow-x-clip overflow-y-visible">
      {/* Background Decoration */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-dot-blue opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* タイトル部分 */}
      <div className="content-wrapper px-6 md:px-20 mb-16">
        <motion.div
          ref={titleRef}
          initial={fadeInUp.initial}
          animate={isTitleInView ? fadeInUp.animate : {}}
          transition={fadeInUp.transition}
        >
          <span className="text-section-label block mb-2">MENU</span>
          <h3 className="text-heading-1 font-serif">{t.menu_riz_title}</h3>
        </motion.div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className={`overflow-x-auto pb-10 px-6 md:px-20 no-scrollbar flex space-x-8 md:space-x-12 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        {...handlers}
      >
        {menuItems.map((item, index) => {
          const staggered = getStaggeredFadeInUp(index % 3);
          return (
            <motion.div
              key={item.id}
              className="flex-none w-[280px] md:w-[350px] group cursor-pointer"
              initial={staggered.initial}
              animate={isTitleInView ? staggered.animate : {}}
              transition={staggered.transition}
            >
              <div className="relative overflow-hidden aspect-[4/5] mb-6 pointer-events-none">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500 z-10" />
                <img
                  src={item.image}
                  alt={t[item.nameKey]}
                  className="img-placeholder transform group-hover:scale-105 transition duration-700"
                  draggable={false}
                />
                {item.dotColor !== 'bg-dot-white' && (
                  <div className={`absolute bottom-0 right-0 w-20 h-20 ${item.dotColor} opacity-20 blur-xl`} />
                )}
              </div>
              <div className="text-center">
                <h4 className="text-lg font-serif mb-2">{t[item.nameKey]}</h4>
                <p className="text-xs text-gray-400 tracking-wider">{t[item.descKey]}</p>
                <div className={`mt-4 w-1 h-1 rounded-full ${item.dotColor} mx-auto opacity-50`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
