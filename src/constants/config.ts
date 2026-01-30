/**
 * サイト設定定数
 */

export const SITE_CONFIG = {
  /** レストラン名 */
  name: 'Naji la boule',
  /** 電話番号 */
  phone: '03-6228-5803',
  /** 電話番号（リンク用） */
  phoneLink: 'tel:03-6228-5803',
  /** 住所 */
  address: '〒104-0061 東京都中央区銀座6-4-13 浅黄ビル B1F',
  /** Google Maps URL */
  googleMapsUrl: 'https://maps.app.goo.gl/DXUyQGjYB79SN4mQ7',
  /** Instagram URL */
  instagramUrl: 'https://instagram.com/najilaboule',
} as const;

export const NAVIGATION = {
  sections: [
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'menu', label: 'Menu' },
    { id: 'access', label: 'Access' },
  ],
} as const;
