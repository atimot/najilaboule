export type Lang = 'ja' | 'en';

export interface TitledText {
  title: string;
  body: string;
}

/** 献立の章 (壱〜四)。number は章番号 (壱弐参四)、label は仏語の小ラベル (MARMITE など) */
export interface Chapter extends TitledText {
  number: string;
  label: string;
  /** 写真の注記 (仮写真など)。正式な写真が入ったら削除する */
  note?: string;
}

/** 章の並び = ページの上から下。Chapters.astro はこの順に描く。キーはセクションの id (#concept など) */
export const CHAPTER_KEYS = ['concept', 'sake', 'obanzai', 'riz'] as const;
export type ChapterKey = (typeof CHAPTER_KEYS)[number];

/** ヘッダーメニューのリンクの並び。リンク先は SITE (config.ts) で、Header.astro が対応づける */
export const MENU_LINKS = ['instagram', 'shop'] as const;
export type MenuLink = (typeof MENU_LINKS)[number];

/** ページの全文言。en.ts を追加するときはこの型を実装する */
export interface Copy {
  meta: {
    title: string;
    description: string;
  };
  common: {
    skipToContent: string;
    navLabel: string;
    /** 外部リンクの aria-label に添える注記 (「外部サイト・新しいタブで開きます」) */
    externalLinkNote: string;
  };
  header: {
    kana: string;
    /** メニュー開閉ボタンのアクセシブルネーム (見た目は 2 本線のグリフだけ) */
    menuLabel: string;
    /** メニューのリンク文言。並びは MENU_LINKS。外部リンクなので ↗ を添えて新しいタブで開く */
    menu: Record<MenuLink, string>;
  };
  hero: {
    title: string;
    tagline: string;
  };
  chapters: Record<ChapterKey, Chapter>;
  boutique: TitledText & {
    ctaAriaLabel: string;
  };
  access: {
    /** セクションラベル (ACCÈS)。È を字形サブセットに入れるため ja.ts に置く */
    label: string;
    address: string;
    hoursMain: string;
    hoursClosed: string;
    mapTitle: string;
  };
}
