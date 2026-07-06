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

/** prefers-reduced-motion 時の共通フェード (JS 駆動の opacity アニメーションに適用) */
export const REDUCED_FADE = {
  DELAY: 0.3,
  DURATION: 0.5,
} as const;

/**
 * Hero のフェード演出 (秒)。コンテンツは Loader の不透明オーバーレイ下に常時マウントされ、
 * Chrome は opacity フェードの LCP をフェード完了時点で記録するため、
 * 各フェードが Loader 退場ウィンドウ (LOADER_DURATION 〜 +1s の退場フェード) 内に
 * 完了するよう LOADER_DURATION から導出する
 */
const HERO_FADE_DURATION = 2;
const LOADER_EXIT_START = TIMING.LOADER_DURATION / 1000;
export const HERO_FADE = {
  DURATION: HERO_FADE_DURATION,
  DOTS_DELAY: LOADER_EXIT_START + 0.3 - HERO_FADE_DURATION,
  H1_DELAY: LOADER_EXIT_START + 0.5 - HERO_FADE_DURATION,
  TAGLINE_DELAY: LOADER_EXIT_START + 1.0 - HERO_FADE_DURATION,
} as const;

/**
 * サイト設定定数
 */

export const SITE_CONFIG = {
  name: "Naji la boule",
  phone: "03-6228-5803",
  phoneLink: "tel:03-6228-5803",
  url: "https://atimot.github.io/najilaboule/",
  /** 店で使う米「伊彌彦米」の EC ショップ (外部サイト・日本語のみ) */
  riceShopUrl: "https://iyahiko.square.site/",
} as const;
