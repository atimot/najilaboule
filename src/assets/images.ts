import type { ImageMetadata } from 'astro';
import { imageAlts } from './alts';
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
  alt: imageAlts.riceGift,
};

// ファイル名とカードの対応に注意: item-01=汁 (soupe)、item-02=米 (riz)、item-03=酒 (mariage)
export const images = {
  hero: {
    src: hero,
    alt: imageAlts.hero,
  },
  philosophy: [
    { src: slide01, alt: imageAlts.slide01 },
    { src: slide02, alt: imageAlts.slide02 },
    riceGift,
  ],
  experience: {
    riz: { src: item02, alt: imageAlts.riz },
    soupe: { src: item01, alt: imageAlts.soupe },
    mariage: { src: item03, alt: imageAlts.mariage },
  },
  riceGift,
} as const satisfies {
  hero: SiteImage;
  philosophy: readonly SiteImage[];
  experience: Record<'riz' | 'soupe' | 'mariage', SiteImage>;
  riceGift: SiteImage;
};
