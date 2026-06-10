import type { ImageEntry } from './types';

// WebP は 800w / 1600w (ヒーローのみ 2400w も) を用意。元データは assets/images-original/ に保管
const PHOTO_WIDTH = 1600;
const PHOTO_HEIGHT = 893;

/** 800w/1600w の srcset 文字列を組み立てる */
const srcSetOf = (base: string) => `${base}-800.webp 800w, ${base}-1600.webp 1600w`;

// 表示幅の目安: Philosophy はデスクトップで max-w-80rem の 55%、Experience は 50%
const SIZES_FULL = '100vw';
const SIZES_PHILOSOPHY = '(min-width: 768px) 44rem, 100vw';
const SIZES_EXPERIENCE = '(min-width: 768px) 40rem, 100vw';

export const heroImages = {
  background: {
    src: 'images/hero/background-1600.webp',
    srcSet: `${srcSetOf('images/hero/background')}, images/hero/background-2400.webp 2400w`,
    sizes: SIZES_FULL,
    alt: { ja: '銀座のバーカウンターに並ぶおにぎりと汁と酒', en: 'Onigiri, soup and sake on a Ginza bar counter' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'eager',
    fetchPriority: 'high',
  },
} as const satisfies Record<string, ImageEntry>;

export const philosophySlides: readonly ImageEntry[] = [
  {
    src: 'images/philosophy/slide-01-1600.webp',
    srcSet: srcSetOf('images/philosophy/slide-01'),
    sizes: SIZES_PHILOSOPHY,
    alt: { ja: '指先に乗せた一粒の米', en: 'A single grain of rice on a fingertip' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-02-1600.webp',
    srcSet: srcSetOf('images/philosophy/slide-02'),
    sizes: SIZES_PHILOSOPHY,
    alt: { ja: '炊きたての米を湛えた土鍋', en: 'Donabe pot of freshly cooked rice' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-03-1600.webp',
    srcSet: srcSetOf('images/philosophy/slide-03'),
    sizes: SIZES_PHILOSOPHY,
    alt: { ja: '水引で結ばれた米の贈り物', en: 'A gift of rice tied with mizuhiki' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
] as const;

const menuImages: readonly ImageEntry[] = [
  {
    src: 'images/menu/item-01-1600.webp',
    srcSet: srcSetOf('images/menu/item-01'),
    sizes: SIZES_EXPERIENCE,
    alt: { ja: '澄まし汁の椀', en: 'Bowl of clear dashi soup' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-02-1600.webp',
    srcSet: srcSetOf('images/menu/item-02'),
    sizes: SIZES_EXPERIENCE,
    alt: { ja: 'おむすびを結ぶ手', en: 'Hands shaping an onigiri' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-03-1600.webp',
    srcSet: srcSetOf('images/menu/item-03'),
    sizes: SIZES_EXPERIENCE,
    alt: { ja: '盃と酒', en: 'Sake cup' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
] as const;

export const experienceImages = {
  riz: menuImages[1],
  soupe: menuImages[0],
  mariage: menuImages[2],
} as const;
