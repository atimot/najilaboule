import type { Lang } from '../i18n/types';

export type AltText = Readonly<Record<Lang, string>>;

/** 画像の alt (ja / en)。astro.config.ts の字形サブセットもここから文字を集める。
    Hero と ACCÈS の背景は装飾 (alt="") なのでここには置かない */
export const imageAlts = {
  concept: { ja: '湯気を上げる釜', en: 'A rice pot giving off steam' },
  concept2: { ja: '釜の中の炊きたてのご飯と杓文字', en: 'Freshly cooked rice in the pot with a wooden rice paddle' },
  sake: { ja: 'カウンターに置かれたグラスの酒', en: 'A glass of sake set on the counter' },
  obanzai: { ja: '小鉢に盛られたおばんざい', en: 'Obanzai side dishes served in small bowls' },
  riz: { ja: '釜で炊きあがったご飯と備え付けの汁', en: 'Freshly cooked pot rice with the accompanying soup' },
} as const satisfies Record<string, AltText>;
