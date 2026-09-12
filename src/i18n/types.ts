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

/** ヘッダーのナビリンクの並びとリンク先 (セクションの id)。四 (riz) にはリンクを置かない (handoff §4.0) */
export const NAV_TARGETS = ['concept', 'sake', 'obanzai', 'shop', 'access'] as const;
export type NavTarget = (typeof NAV_TARGETS)[number];

/** ページの全文言。en.ts を追加するときはこの型を実装する */
export interface Copy {
  meta: {
    title: string;
    description: string;
  };
  common: {
    skipToContent: string;
    navLabel: string;
    reserveByPhone: string;
  };
  header: {
    kana: string;
    /** ナビリンク (1024px 以上で表示)。キーはリンク先セクションの id (NAV_TARGETS) */
    nav: Record<NavTarget, string>;
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
