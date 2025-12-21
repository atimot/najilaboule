export type Language = 'ja' | 'en';

export interface Translations {
  hero_title: string;
  menu_riz_title: string;
  menu_1_name: string;
  menu_1_desc: string;
  menu_2_name: string;
  menu_2_desc: string;
  menu_3_name: string;
  menu_3_desc: string;
  soupe_title: string;
  soupe_desc: string;
  mariage_title: string;
  mariage_desc: string;
  address_text: string;
  hours_text: string;
}

export interface PhiloSlide {
  title: string;
  body: string;
}

export const translations: Record<Language, Translations> = {
  ja: {
    hero_title: '銀座の夜、米と汁を嗜む。',
    menu_riz_title: 'おにぎりと汁',
    menu_1_name: '銀シャリ - 極 -',
    menu_1_desc: '新潟県産コシヒカリ / 能登の塩',
    menu_2_name: '溢れいくら',
    menu_2_desc: '北海道産いくら醤油漬け',
    menu_3_name: '和牛しぐれ煮',
    menu_3_desc: 'A5ランク黒毛和牛 / 実山椒',
    soupe_title: 'ほどける、汁。',
    soupe_desc: '銀座の夜の緊張を解きほぐす。季節の食材を椀の中に閉じ込めました。おにぎりとの調和をお楽しみください。',
    mariage_title: '酔いしれる。',
    mariage_desc: '土壌の記憶を持つ米。にぎる。纏う香。汁に浮かぶ泡沫に酔う。',
    address_text: '東京都中央区銀座6-12-12 銀座ステラビル2階',
    hours_text: '営業時間: 18:30 - 23:30 / 定休日: 土日祝日',
  },
  en: {
    hero_title: 'Savoring Rice in the Ginza Night.',
    menu_riz_title: 'Riz - Onigiri (Rice Ball)',
    menu_1_name: 'Silver Shari - Kiwami',
    menu_1_desc: 'Niigata Koshihikari Rice / Noto Salt',
    menu_2_name: 'Overflowing Ikura',
    menu_2_desc: 'Hokkaido Soy Marinated Salmon Roe',
    menu_3_name: 'Wagyu Shigureni',
    menu_3_desc: 'A5 Black Wagyu Beef / Japanese Pepper',
    soupe_title: 'Unwinding Soup.',
    soupe_desc: 'The aroma of the first dashi broth unwinds the tension of the Ginza night. Seasonal ingredients sealed in a bowl. Enjoy the harmony with Onigiri.',
    mariage_title: 'Intoxicated by Harmony.',
    mariage_desc: 'Sake born from rice, Wine holding memories of the soil. Our sommelier proposes the supreme cup to match your Onigiri ingredients.',
    address_text: 'Ginza Stella Building 2F, 6-12-12 Ginza, Chuo-ku, Tokyo, Japan',
    hours_text: 'Hours: 18:30 - 23:30 / Closed: Weekends & National Holidays',
  },
};

export const philoSlides: Record<Language, PhiloSlide[]> = {
  ja: [
    {
      title: '掌の宇宙、一粒の輝き。',
      body: '厳選された米、清冽な水、そして村人の掌（たなごころ）。一粒一粒が立ち上がる瞬間、そこには無限の物語が宿ります。',
    },
    {
      title: '湯気に咲く、静寂。',
      body: '黄金色の出汁が、銀座の喧騒を優しく解きほぐす。心身を温める食べる宝石です。',
    },
    {
      title: '宵に溶ける、至福。',
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

