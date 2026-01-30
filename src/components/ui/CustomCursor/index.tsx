import { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const outlineX = useSpring(cursorX, springConfig);
  const outlineY = useSpring(cursorY, springConfig);

  const outlineRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => {
      if (outlineRef.current) {
        outlineRef.current.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outlineRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      if (outlineRef.current) {
        outlineRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        outlineRef.current.style.backgroundColor = 'transparent';
      }
      isHovering.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          if (outlineRef.current) {
            outlineRef.current.style.transform = 'translate(-50%, -50%) scale(1.5)';
            outlineRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        });
        el.addEventListener('mouseleave', () => {
          if (outlineRef.current) {
            outlineRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
            outlineRef.current.style.backgroundColor = 'transparent';
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        className={styles.cursorDot}
        style={{
          left: cursorX,
          top: cursorY,
        }}
      />

      <motion.div
        ref={outlineRef}
        className={styles.cursorOutline}
        style={{
          left: outlineX,
          top: outlineY,
        }}
      />
    </>
  );
}
