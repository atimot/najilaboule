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
    riz_title: 'にぎる、米。',
    riz_desc: '厳選された米を、掌でそっとにぎる。\n一粒一粒が立ち上がるおにぎりは、\nこの店の全ての始まりです。',
    soupe_title: 'ほどける、汁。',
    soupe_desc: '銀座の夜の緊張を解きほぐす。\n季節の食材を椀の中に閉じ込めました。\nおにぎりとの調和をお楽しみください。',
    mariage_title: '酔う、盃。',
    mariage_desc: '厳選された酒が、おにぎりと汁に寄り添う。\n一杯ごとに広がる余韻が、\n銀座の宵をより深く満たします。',
    address_text: '東京都中央区銀座6-12-12\n銀座ステラビル2階',
    hours_main: '営業時間: 18:30 - 23:30',
    hours_closed: '定休日: 土日祝日',
  },
  en: {
    hero_title: 'Savoring Rice in the Ginza Night.',
    riz_title: 'Shaping the Grain.',
    riz_desc: 'Carefully selected rice, gently shaped by hand. Each grain stands tall in our Onigiri — the very soul from which everything begins.',
    soupe_title: 'Unwinding Soup.',
    soupe_desc: 'The aroma of the first dashi broth unwinds the tension of the Ginza night. Seasonal ingredients sealed in a bowl. Enjoy the harmony with Onigiri.',
    mariage_title: 'Savoring the Cup.',
    mariage_desc: 'Carefully selected drinks accompany your onigiri and soup. With each sip, a lingering resonance fills the Ginza evening ever more deeply.',
    address_text: 'Ginza Stella Building 2F, 6-12-12 Ginza, Chuo-ku, Tokyo, Japan',
    hours_main: 'Hours: 18:30 - 23:30',
    hours_closed: 'Closed: Weekends & National Holidays',
  },
};

export const philoSlides: Record<Language, PhiloSlide[]> = {
  ja: [
    {
      title: '掌の宇宙、\n一粒の輝き。',
      body: '厳選された米、清冽な水、そして村人の掌（たなごころ）。\n一粒一粒が立ち上がる瞬間、そこには無限の物語が宿ります。',
    },
    {
      title: '湯気に咲く、\n静寂。',
      body: '黄金色の出汁が、銀座の喧騒を優しく解きほぐす。\n心身を温める食べる宝石です。',
    },
    {
      title: '宵に溶ける、\n至福。',
      body: '米と汁。互いに引き立て合う「出会い」が、夜の時間をより濃密に彩ります。',
    },
  ],
  en: [
    {
      title: 'Universe in the Palm, Radiance of a Grain.',
      body: "Carefully selected rice, pure water, and the artisan's palm. At the moment each grain stands up, an infinite story resides there.",
    },
    {
      title: 'Silence Blooming in the Steam.',
      body: 'Golden dashi broth gently unravels the hustle and bustle of Ginza. An edible gem that warms the body and soul.',
    },
    {
      title: 'Bliss Melting into the Evening.',
      body: 'Sake born from rice and cuisine born from rice. The "encounter" that complements each other colors the night time more densely.',
    },
  ],
};
