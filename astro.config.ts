import { defineConfig, fontProviders } from 'astro/config';
import { ja } from './src/content/ja';
import { SITE } from './src/config';

/** ページで使う全文字 (Shippori Mincho を使用文字だけにサブセットするため) */
function collectGlyphs(...sources: unknown[]): string[] {
  const chars = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') for (const c of v) chars.add(c);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  sources.forEach(walk);
  // 数字・記号は Playfair 側で出るが、フォールバック順の保険として含める
  for (const c of '0123456789©–—’“”…') chars.add(c);
  return [...chars];
}

export default defineConfig({
  site: 'https://atimot.github.io',
  base: '/najilaboule',
  // v7 の既定 'jsx' はインライン要素間の空白を落とすため、旧既定に戻す
  compressHTML: true,
  fonts: [
    {
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      provider: fontProviders.google(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      // 生成される変数に generic serif が混ざると和文が Shippori に届かなくなるため、フォールバックを付けない
      fallbacks: [],
      optimizedFallbacks: false,
    },
    {
      name: 'Shippori Mincho',
      cssVariable: '--font-shippori',
      provider: fontProviders.google(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['japanese'],
      fallbacks: ['serif'],
      // 使用文字だけにサブセット。ビルドで問題が出たら options を外して unicode-range スライスに任せる (spec §16)
      options: {
        experimental: {
          glyphs: collectGlyphs(ja, SITE),
        },
      },
    },
  ],
});
