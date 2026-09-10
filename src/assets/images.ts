import type { ImageMetadata } from 'astro';
import hero from './images/hero/background.jpg';
import slide01 from './images/philosophy/slide-01.jpg';
import slide02 from './images/philosophy/slide-02.jpg';
import slide03 from './images/philosophy/slide-03.jpg';
import item01 from './images/menu/item-01.jpg';
import item02 from './images/menu/item-02.jpg';
import item03 from './images/menu/item-03.jpg';

export interface SiteImage {
  readonly src: ImageMetadata;
  readonly alt: { readonly ja: string; readonly en: string };
}

/** 「水引で結ばれた米の贈り物」。Philosophy 3 幕目と BOUTIQUE 背景で共用 */
const riceGift: SiteImage = {
  src: slide03,
  alt: { ja: '水引で結ばれた米の贈り物', en: 'A gift of rice tied with mizuhiki' },
};

// ファイル名とカードの対応に注意: item-01=汁 (soupe)、item-02=米 (riz)、item-03=酒 (mariage)
export const images = {
  hero: {
    src: hero,
    alt: { ja: '銀座のバーカウンターに並ぶおにぎりと汁と酒', en: 'Onigiri, soup and sake on a Ginza bar counter' },
  },
  philosophy: [
    { src: slide01, alt: { ja: '指先に乗せた一粒の米', en: 'A single grain of rice on a fingertip' } },
    { src: slide02, alt: { ja: '炊きたての米を湛えた土鍋', en: 'Donabe pot of freshly cooked rice' } },
    riceGift,
  ],
  experience: {
    riz: { src: item02, alt: { ja: 'おむすびを結ぶ手', en: 'Hands shaping an onigiri' } },
    soupe: { src: item01, alt: { ja: '澄まし汁の椀', en: 'Bowl of clear dashi soup' } },
    mariage: { src: item03, alt: { ja: '盃と酒', en: 'Sake cup' } },
  },
  riceGift,
} as const satisfies {
  hero: SiteImage;
  philosophy: readonly SiteImage[];
  experience: Record<'riz' | 'soupe' | 'mariage', SiteImage>;
  riceGift: SiteImage;
};
