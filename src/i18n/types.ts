export type Lang = 'ja' | 'en';

export interface TitledText {
  title: string;
  body: string;
}

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
    navAccess: string;
  };
  hero: {
    title: string;
    tagline: string;
  };
  philosophy: TitledText;
  experience: {
    riz: TitledText;
    soupe: TitledText;
    mariage: TitledText;
  };
  boutique: TitledText & {
    ctaAriaLabel: string;
  };
  access: {
    address: string;
    hoursMain: string;
    hoursClosed: string;
    reservationHeading: string;
    reservationNote: string;
    mapTitle: string;
  };
}
