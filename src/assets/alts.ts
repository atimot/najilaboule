import type { Lang } from '../i18n/types';

export type AltText = Readonly<Record<Lang, string>>;

/** 画像の alt (ja / en)。astro.config.ts の字形サブセットもここから文字を集める */
export const imageAlts = {
  hero: { ja: '銀座のバーカウンターに並ぶおにぎりと汁と酒', en: 'Onigiri, soup and sake on a Ginza bar counter' },
  slide01: { ja: '指先に乗せた一粒の米', en: 'A single grain of rice on a fingertip' },
  slide02: { ja: '炊きたての米を湛えた土鍋', en: 'Donabe pot of freshly cooked rice' },
  riceGift: { ja: '水引で結ばれた米の贈り物', en: 'A gift of rice tied with mizuhiki' },
  riz: { ja: 'おむすびを結ぶ手', en: 'Hands shaping an onigiri' },
  soupe: { ja: '澄まし汁の椀', en: 'Bowl of clear dashi soup' },
  mariage: { ja: '盃と酒', en: 'Sake cup' },
} as const satisfies Record<string, AltText>;
