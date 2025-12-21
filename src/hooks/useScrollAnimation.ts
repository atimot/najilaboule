import { useRef } from 'react';
import { useInView } from 'motion/react';

type MarginValue = `${number}${'px' | '%'}`;
type MarginType = MarginValue | `${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

interface UseScrollAnimationOptions {
  once?: boolean;
  margin?: MarginType;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { once = true, margin = '-100px 0px' } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  return { ref, isInView };
}

