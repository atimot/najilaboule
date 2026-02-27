/**
 * 共通アニメーション設定
 * Framer Motion用のアニメーションプリセット
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1 },
} as const;

export const getStaggeredFadeInUp = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: baseDelay + index * 0.1 },
});

export const TIMING = {
  LOADER_DURATION: 2500,
  PHILOSOPHY_SLIDE_INTERVAL: 10000,
} as const;

/**
 * サイト設定定数
 */

export const SITE_CONFIG = {
  name: 'Naji la boule',
  phone: '03-6228-5803',
  phoneLink: 'tel:03-6228-5803',
} as const;

export const NAVIGATION = {
  sections: [
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'menu', label: 'Menu' },
    { id: 'access', label: 'Access' },
  ],
} as const;

