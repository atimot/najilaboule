import { defineConfig } from 'astro/config';

// フォント設定は Task 3 で追加する
export default defineConfig({
  site: 'https://atimot.github.io',
  base: '/najilaboule',
  // v7 の既定 'jsx' はインライン要素間の空白を落とすため、旧既定に戻す
  compressHTML: true,
});
