import type { ImageEntry } from './types';

const PHOTO_WIDTH = 1477;
const PHOTO_HEIGHT = 1108;

export const heroImages = {
  background: {
    src: 'images/hero/background.jpg',
    alt: { ja: '銀座バーの雰囲気', en: 'Ginza bar atmosphere' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'eager',
    fetchPriority: 'high',
  },
} as const satisfies Record<string, ImageEntry>;

export const philosophySlides: readonly ImageEntry[] = [
  {
    src: 'images/philosophy/slide-01.jpg',
    alt: { ja: 'こだわりの米', en: 'Carefully selected rice' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-02.jpg',
    alt: { ja: 'カウンターの空間', en: 'Counter seating atmosphere' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/philosophy/slide-03.jpg',
    alt: { ja: 'カウンターからの眺め', en: 'View from the counter' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
] as const;

export const menuImages: readonly ImageEntry[] = [
  {
    src: 'images/menu/item-01.jpg',
    alt: { ja: 'メニュー料理 1', en: 'Menu dish 1' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-02.jpg',
    alt: { ja: 'メニュー料理 2', en: 'Menu dish 2' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
  {
    src: 'images/menu/item-03.jpg',
    alt: { ja: 'メニュー料理 3', en: 'Menu dish 3' },
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    loading: 'lazy',
  },
] as const;

export const experienceImages = {
  soupe: menuImages[0],
  mariage: { ...heroImages.background, loading: 'lazy' as const, fetchPriority: undefined },
} as const;
