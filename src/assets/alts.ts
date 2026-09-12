import type { Lang } from '../i18n/types';

export type AltText = Readonly<Record<Lang, string>>;

/** 画像の alt (ja / en)。astro.config.ts の字形サブセットもここから文字を集める。
    Hero と ACCÈS の背景は装飾 (alt="") なのでここには置かない */
export const imageAlts = {
  concept: { ja: '湯気を上げる釜', en: 'A rice pot giving off steam' },
  concept2: { ja: '釜の中の炊きたてのご飯と杓文字', en: 'Freshly cooked rice in the pot with a wooden rice paddle' },
  sake: { ja: 'カウンターに置かれたグラスの酒', en: 'A glass of sake set on the counter' },
  obanzai: { ja: '小鉢に盛られたおばんざい', en: 'Obanzai side dishes served in small bowls' },
  riz: { ja: 'お膳に揃えた炊きたてのご飯と汁、梅干し', en: 'A tray set with freshly cooked rice, a pot of soup and a pickled plum' },
  riz2: { ja: '湯気の立つご飯に汁を注ぐ', en: 'Soup being poured over a bowl of steaming rice' },
} as const satisfies Record<string, AltText>;
