export type Language = 'ja' | 'en';

export interface Translations {
  hero_title: string;
  riz_title: string;
  riz_desc: string;
  soupe_title: string;
  soupe_desc: string;
  mariage_title: string;
  mariage_desc: string;
  address_text: string;
  hours_main: string;
  hours_closed: string;
}

export interface PhiloSlide {
  title: string;
  body: string;
}

export const translations: Record<Language, Translations> = {
  ja: {
    hero_title: '銀座の夜、\n米と汁を嗜む。',
    riz_title: '結ぶ、米。',
    riz_desc: '厳選された米を、掌でそっと結ぶ。\n一粒一粒が寄り合うおむすびは、\nこの店の全ての始まりです。',
    soupe_title: 'ほどける、汁。',
    soupe_desc: '銀座の夜の緊張を解きほぐす。\n季節の食材を椀の中に閉じ込めました。\nおにぎりとの調和をお楽しみください。',
    mariage_title: '揺蕩う、盃。',
    mariage_desc: '厳選された酒が、おにぎりと汁に寄り添う。\n盃を重ねるほどに心は揺蕩い、\n銀座の宵はゆるやかに更けていきます。',
    address_text: '東京都中央区銀座6-12-12\n銀座ステラビル2階',
    hours_main: '営業時間: 18:30 - 23:30',
    hours_closed: '定休日: 土日祝日',
  },
  en: {
    hero_title: 'Savoring Rice in the Ginza Night.',
    riz_title: 'Binding the Grain.',
    riz_desc: 'Carefully selected rice, gently bound together by hand. Each grain drawn close in our Omusubi — the very beginning of everything here.',
    soupe_title: 'Unwinding Soup.',
    soupe_desc: 'The aroma of the first dashi broth unwinds the tension of the Ginza night. Seasonal ingredients sealed in a bowl. Enjoy the harmony with Onigiri.',
    mariage_title: 'Drifting with the Cup.',
    mariage_desc: 'Carefully selected drinks accompany your onigiri and soup. With each cup, the spirit drifts gently as the Ginza evening deepens at its own unhurried pace.',
    address_text: 'Ginza Stella Building 2F, 6-12-12 Ginza, Chuo-ku, Tokyo, Japan',
    hours_main: 'Hours: 18:30 - 23:30',
    hours_closed: 'Closed: Weekends & National Holidays',
  },
};

export const philoSlides: Record<Language, PhiloSlide[]> = {
  ja: [
    {
      title: '一粒の想いを、\n世界へ。',
      body: '日本の風土が育んだ、かけがえのない一粒。\nその美味しさを、もっと多くの人に届けたい。\nNaji la bouleは、その想いから生まれました。',
    },
    {
      title: '銀座の宵に、\n米と憩う。',
      body: '喧騒からそっと離れて、炊きたての米を味わう贅沢。\nお酒を傾けながら、ゆったりと流れる時間をお過ごしください。',
    },
    {
      title: '美味しさを、\n誰かへ。',
      body: '「この米、美味しいな」——その気持ちを、\n大切な人への贈り物にしてみませんか。\n一粒の感動が、人と人をつなぎます。',
    },
  ],
  en: [
    {
      title: "A Single Grain's Wish,\nTo the World.",
      body: 'An irreplaceable grain, nurtured by the land of Japan.\nWe want to share its deliciousness with more people.\nNaji la boule was born from that very wish.',
    },
    {
      title: 'Rice and Repose\nin Ginza.',
      body: 'Step away from the hustle and savor freshly cooked rice.\nWith a drink in hand, let time flow gently around you.',
    },
    {
      title: 'Share the Flavor\nwith Someone Dear.',
      body: 'When you think "this rice is truly delicious,"\nwhy not turn that feeling into a gift for someone special?\nA single grain of delight connects people together.',
    },
  ],
};
