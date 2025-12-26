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
    image: 'menu_01.JPG',
    nameKey: 'menu_1_name',
    descKey: 'menu_1_desc',
    dotColor: 'bg-dot-white',
  },
  {
    id: 2,
    image: 'menu_02.JPG',
    nameKey: 'menu_2_name',
    descKey: 'menu_2_desc',
    dotColor: 'bg-dot-orange',
  },
  {
    id: 3,
    image: 'menu_03.JPG',
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
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHorizontalDrag, setIsHorizontalDrag] = useState<boolean | null>(null);

  // Duplicate items for infinite scroll effect
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Duplicate items for infinite scroll effect
    setItems([...menuItems]);
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
    setStartY(e.touches[0].pageY);
    setScrollLeft(containerRef.current.scrollLeft);
    setIsHorizontalDrag(null); // Reset direction detection
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const y = e.touches[0].pageY;
    
    // Determine drag direction on first move
    if (isHorizontalDrag === null) {
      const deltaX = Math.abs(x - startX);
      const deltaY = Math.abs(y - startY);
      
      // If vertical movement is dominant, allow default scroll
      if (deltaY > deltaX) {
        setIsHorizontalDrag(false);
        return;
      } else {
        setIsHorizontalDrag(true);
      }
    }
    
    // Only handle horizontal drag
    if (isHorizontalDrag) {
      e.preventDefault(); // Prevent vertical scroll only when horizontal dragging
      const walk = (x - startX) * 2;
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsHorizontalDrag(null);
  };

  return (
    <section id="menu" className="py-24 md:py-40 bg-base-light relative overflow-x-clip overflow-y-visible">
      {/* Background Decoration */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-dot-blue opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* タイトル部分 - コンテンツ横幅制限 */}
      <div className="content-wrapper px-6 md:px-20 mb-16">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <span className="text-section-label block mb-2">MENU</span>
          <h3 className="text-heading-1 font-serif">{t.menu_riz_title}</h3>
        </motion.div>
      </div>

      {/* Carousel - 全幅スクロール */}
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

