/**
 * 共通アニメーション設定
 * Framer Motion用のアニメーションプリセット
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1 },
} as const;

export const TIMING = {
  LOADER_DURATION: 2500,
  LOADER_DURATION_REDUCED: 500,
  PHILOSOPHY_SLIDE_INTERVAL: 7000,
} as const;

/**
 * Hero のフェード演出 (秒)。コンテンツは Loader の不透明オーバーレイ下に常時マウントされ、
 * Chrome は opacity フェードの LCP をフェード完了時点で記録するため、
 * h1 のフェードが Loader 退場 (LOADER_DURATION + 退場フェード 1s) と重なって完了するよう設定する。
 * LOADER_DURATION を変えるときはここも合わせて調整すること
 */
export const HERO_FADE = {
  DOTS_DELAY: 0.8,
  H1_DELAY: 1.0,
  TAGLINE_DELAY: 1.5,
  DURATION: 2,
  REDUCED_DELAY: 0.3,
  REDUCED_DURATION: 0.5,
} as const;

/**
 * サイト設定定数
 */

export const SITE_CONFIG = {
  name: "Naji la boule",
  phone: "03-6228-5803",
  phoneLink: "tel:03-6228-5803",
  url: "https://atimot.github.io/najilaboule/",
} as const;
