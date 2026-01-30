/**
 * 共通アニメーション設定
 * Framer Motion用のアニメーションプリセット
 */

// フェードイン + 上方向からのスライド
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 },
} as const;

// フェードイン + 左方向からのスライド
export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1 },
} as const;

// フェードイン + 右方向からのスライド
export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1 },
} as const;

// シンプルなフェードイン
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1 },
} as const;

// 遅延付きフェードイン（インデックスベース）
export const getStaggeredFadeInUp = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: baseDelay + index * 0.1 },
});

// アニメーションのタイミング定数
export const TIMING = {
  /** ローダー表示時間 (ms) */
  LOADER_DURATION: 2500,
  /** Philosophy スライド切り替え間隔 (ms) */
  PHILOSOPHY_SLIDE_INTERVAL: 10000,
  /** デフォルトのトランジション時間 (s) */
  DEFAULT_TRANSITION: 1,
} as const;
