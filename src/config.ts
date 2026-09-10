export const SITE = {
  name: 'Naji la boule',
  kana: 'ナジラブール',
  phone: '03-6228-5803',
  phoneHref: 'tel:03-6228-5803',
  /** 店で使う米「伊彌彦米」の EC ショップ (外部サイト・日本語のみ) */
  riceShopUrl: 'https://iyahiko.square.site/',
  /** Google マップ埋め込みの検索文字列 */
  mapQuery: '東京都中央区銀座6-12-12 銀座ステラビル2階',
} as const;

/** schema.org Restaurant。url / image は Base.astro が site + base から組み立てて渡す */
export function buildJsonLd(url: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE.name,
    alternateName: SITE.kana,
    url,
    image,
    telephone: '+81-3-6228-5803',
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
        opens: '18:30',
        closes: '23:30',
      },
    ],
  };
}
