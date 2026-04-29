import type { ImageEntry } from './types';

const PHOTO_WIDTH = 2752;
const PHOTO_HEIGHT = 1536;

export const heroImages = {
  background: {
    src: 'images/hero/background.jpg',
    alt: { ja: '銀座のバーカウンターに並ぶおにぎりと汁と酒', en: 'Onigiri, soup and sake on a Ginza bar counter' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'eager',
    fetchPriority: 'high',
  },
} as const satisfies Record<string, ImageEntry>;

export const philosophySlides: readonly ImageEntry[] = [
  {
    src: 'images/philosophy/slide-01.jpg',
    alt: { ja: '指先に乗せた一粒の米', en: 'A single grain of rice on a fingertip' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-02.jpg',
    alt: { ja: '炊きたての米を湛えた土鍋', en: 'Donabe pot of freshly cooked rice' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-03.jpg',
    alt: { ja: '水引で結ばれた米の贈り物', en: 'A gift of rice tied with mizuhiki' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
] as const;

const menuImages: readonly ImageEntry[] = [
  {
    src: 'images/menu/item-01.jpg',
    alt: { ja: '澄まし汁の椀', en: 'Bowl of clear dashi soup' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-02.jpg',
    alt: { ja: 'おむすびを結ぶ手', en: 'Hands shaping an onigiri' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-03.jpg',
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
