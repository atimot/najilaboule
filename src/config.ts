import type { Lang } from './i18n/types';

export const SITE = {
  name: 'Naji la boule',
  kana: 'ナジラブール',
  phone: '03-6274-6608',
  phoneHref: 'tel:03-6274-6608',
  /** 店で使う米「伊彌彦米」の EC ショップ (外部サイト・日本語のみ)。ヘッダーメニューの Online Shop と BOUTIQUE のボタンが指す */
  riceShopUrl: 'https://iyahiko.square.site/',
  /** Instagram の公式アカウント (@najilaboule)。2026-09-15 に仮 URL から差し替え。verify-dist が href を照合する */
  instagramUrl: 'https://www.instagram.com/najilaboule/',
} as const;

/**
 * Access の地図。Google マップの掲載「Naji la boule」→ 共有 → 地図を埋め込む で得た URL (2026-09-15)。
 * pb の中の ftid (0x60188baa66ba6b1f:0xc672e7499dfbb371) が掲載そのものを指す (verify-dist が照合する)。
 * 言語コード 2 箇所 (!1sja) だけ lang で差し替える。以前は住所の検索文字列 (maps?q=…&output=embed) で、ピンに店名が出なかった
 */
const MAP_EMBED_PB =
  '!1m14!1m8!1m3!1d810.3312748168119!2d139.7637088!3d35.6689963!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188baa66ba6b1f%3A0xc672e7499dfbb371!2sNaji%20la%20boule!5e0!3m2!1s{lang}!2sjp!4v1789477397547!5m2!1s{lang}!2sjp';

export function mapEmbedSrc(lang: Lang): string {
  return `https://www.google.com/maps/embed?pb=${MAP_EMBED_PB.replace(/\{lang\}/g, lang)}`;
}

/** schema.org Restaurant。url / image は Base.astro が site + base から組み立てて渡す */
export function buildJsonLd(url: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE.name,
    alternateName: SITE.kana,
    url,
    image,
    telephone: '+81-3-6274-6608',
    servesCuisine: 'Japanese',
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '銀座6-12-12 銀座ステラビル2階',
      addressLocality: '中央区',
      addressRegion: '東京都',
      addressCountry: 'JP',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '20:00',
        closes: '23:30',
      },
    ],
  };
}
