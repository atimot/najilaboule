import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

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
    image: 'https://images.unsplash.com/photo-1595458004128-d820526ce399?auto=format&fit=crop&q=80&w=2670',
    nameKey: 'menu_1_name',
    descKey: 'menu_1_desc',
    dotColor: 'bg-dot-white',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=2574',
    nameKey: 'menu_2_name',
    descKey: 'menu_2_desc',
    dotColor: 'bg-dot-orange',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=2670',
    nameKey: 'menu_3_name',
    descKey: 'menu_3_desc',
    dotColor: 'bg-dot-red',
  },
];

export function MenuCarousel() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicate items for infinite scroll effect
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Duplicate items for infinite scroll effect
    setItems([...menuItems, ...menuItems, ...menuItems]);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section id="menu" className="py-20 md:py-32 bg-[#2a1d1b] relative overflow-x-clip overflow-y-visible">
      {/* Background Decoration */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-dot-blue opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        ref={titleRef}
        className="px-6 md:px-20 mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <span className="text-accent text-xs tracking-[0.3em] block mb-2">MENU</span>
        <h3 className="text-3xl md:text-4xl font-serif">{t.menu_riz_title}</h3>
      </motion.div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className={`overflow-x-auto pb-10 px-6 md:px-20 no-scrollbar flex space-x-8 md:space-x-12 touch-pan-x ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className="flex-none w-[280px] md:w-[350px] group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: (index % 3) * 0.1 }}
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
        ))}
      </div>
    </section>
  );
}

