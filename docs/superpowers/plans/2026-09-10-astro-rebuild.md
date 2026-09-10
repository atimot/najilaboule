# Astro によるゼロからの再構築 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 現行 React 製 LP と同じ見た目・内容の日本語ページを、Astro 7 + 素の CSS で配信 JS ゼロのまま作り直し、CI が緑の状態で PR にする。

**Architecture:** `src/pages/index.astro` 1 枚が `Base.astro` レイアウトに 7 つのセクションコンポーネントを並べる。文言は `src/content/ja.ts`、画像は `src/assets/images.ts`、店舗情報は `src/config.ts` に集約し、各コンポーネントは `getCopy()` 経由で文言を得る。スタイルは `tokens.css` (DESIGN.md のトークン) + `global.css` (リセット・背景・共通 keyframes・`.reveal`) + 各 `.astro` の scoped `<style>`。動きは全て CSS (keyframes と scroll-driven animations)。

**Tech Stack:** Astro 7.3 (Node ≥ 22.12、Vite 8)、TypeScript 6、Astro Fonts API (Google provider、自前ホスト)、Astro `<Picture>` (sharp、AVIF/WebP)、GitHub Pages。ランタイム依存なし。

**Spec:** `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md`

## Global Constraints

- Node `>= 22.12.0` (CI は 24)。devDependencies は `astro@^7.3.2`、`@astrojs/check@^0.9.10`、`typescript@^6.0.3` の 3 つだけ。ランタイム依存は追加しない
- Tailwind、motion、React、clsx、ESLint は使わない。CSS は素の CSS + カスタムプロパティ。ブレークポイントは **768px (`48rem`) の 1 本**
- 配信 JS ゼロ。`dist/index.html` に `<script>` は JSON-LD (`type="application/ld+json"`) 以外あってはならない
- 外部フォント配信 (fonts.googleapis.com / fonts.gstatic.com) への参照ゼロ
- 文言は `src/content/ja.ts` に集約し、コンポーネントに直書きしない (例外: `RIZ` `SOUPE` `MARIAGE` `BOUTIQUE` `GINZA` `ADDRESS` `TEL` `HOURS` `RESERVATION` `ONLINE SHOP` `Naji la boule` などの欧文装飾ラベル)
- 見た目の値は `docs/design/lp-blueprint.md` の Tailwind クラスを CSS に翻訳する。§1.4 の既定値表 (`text-xs`=0.75rem … `tracking-widest`=0.1em、`leading-loose`=2、`gray-300`=oklch(87.2% 0.01 258.338) など) を使う
- 意図的な差分は spec §14 の 12 項目のみ。それ以外の見た目の差は出さない
- GitHub Pages: `site: 'https://atimot.github.io'`、`base: '/najilaboule'`。`.github/workflows/*.yml` は変更しない
- lockfile は `npx -y npm@latest install` で生成する (ローカル npm は使わない)。`package-lock.json` と `dist/` は手編集しない
- コミットメッセージは日本語の Conventional Commits (`feat:` / `chore:` / `docs:`)。末尾に次の 2 行を付ける:
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` と `Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR`
- 作業ブランチは `claude/astro-rebuild` (spec がコミット済み)。main には直接コミットしない

## File Structure

| ファイル | 責務 |
|---|---|
| `package.json` / `astro.config.ts` / `tsconfig.json` / `.gitignore` | プロジェクト設定 (Task 1) |
| `scripts/verify-dist.mjs` | ビルド成果物の不変条件チェック。`npm run build` の最後に走る。各 Task が検査を追加する (Task 1〜8) |
| `scripts/check-lockfile.mjs` | wasm optional 依存の脱落検査 (対象を sharp に更新、Task 1) |
| `src/config.ts` | `SITE` (店名・電話・URL・住所・地図クエリ) と `buildJsonLd` (Task 2) |
| `src/i18n/types.ts` / `src/i18n/index.ts` | `Lang`、`Copy` 型、`getCopy(lang)`、`SUPPORTED_LANGS` (Task 2) |
| `src/content/ja.ts` | 日本語の全文言 (Task 2) |
| `src/assets/images/**` / `src/assets/images.ts` | 元画像 (JPEG) と、import + alt (ja/en) のメタデータ (Task 2) |
| `src/styles/tokens.css` | DESIGN.md フロントマター由来の `:root` 変数 (Task 3) |
| `src/styles/global.css` | リセット、body 背景 3 層、focus ring、スクロールバー、skip link、`.container` `.section` `.label` `.reveal`、共通 keyframes、reduced-motion (Task 3) |
| `src/layouts/Base.astro` | `<html>` / `<head>` 一式、フォント、preload、skip link (Task 3) |
| `src/pages/index.astro` | ja ページ。セクションを並べ、Hero の preload 情報を Base に渡す (Task 1 で骨組み、Task 5 で preload) |
| `src/components/Button.astro` | outline / filled × sm / md / lg のリンクボタン (Task 4) |
| `src/components/BrandDots.astro` | 3×3 ドット (sm / md、animated) (Task 4) |
| (spec §4.2 の `SectionLabel.astro`) | 作らない。global.css の `.label` / `.label--muted` クラスで代替する (YAGNI) |
| `src/components/Header.astro` | 固定ヘッダー (Task 4) |
| `src/components/Hero.astro` | Hero と「開演」演出 (Task 5) |
| `src/components/Philosophy.astro` | 3 幕の scrollytelling (Task 6) |
| `src/components/Experience.astro` | RIZ / SOUPE / MARIAGE カード (Task 7) |
| `src/components/Boutique.astro` / `Access.astro` / `Footer.astro` | 残りのセクション (Task 8) |
| `public/sitemap.xml` | 1 URL に更新 (Task 3) |
| `CLAUDE.md` / `README.md` / `DESIGN.md` / `docs/design/lp-blueprint.md` | 文書更新 (Task 10) |

削除: `src/` の React 一式 (`App.tsx` `main.tsx` `components/` `hooks/` `i18n/` `images/` `constants.ts` `index.css` `vite-env.d.ts`)、`index.html`、`vite.config.ts`、`eslint.config.js`、`tsconfig.app.json`、`tsconfig.node.json`、`public/images/**/*.webp` (ogp.jpg は残す)。移動: `assets/images-original/**` → `src/assets/images/**`。

---

### Task 1: Astro プロジェクトの土台

React 一式を取り除き、Astro 7 の最小構成でビルドが通る状態にする。ビルド成果物の不変条件チェック (`verify-dist.mjs`) をここで導入し、以降の Task はこれに検査を足していく。

**Files:**
- Delete: `src/App.tsx`, `src/main.tsx`, `src/constants.ts`, `src/index.css`, `src/vite-env.d.ts`, `src/components/`, `src/hooks/`, `src/i18n/`, `src/images/`, `index.html`, `vite.config.ts`, `eslint.config.js`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `astro.config.ts`, `scripts/verify-dist.mjs`, `src/pages/index.astro`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`, `scripts/check-lockfile.mjs`

**Interfaces:**
- Produces: `npm run build` = `astro build && node scripts/verify-dist.mjs`。`verify-dist.mjs` は `checks` 配列 (`[名前, 真偽値]`) を評価し、失敗があれば exit 1

- [ ] **Step 1: React 関連ファイルを削除し、元画像を移動する**

```bash
git rm -r -q --ignore-unmatch src/App.tsx src/main.tsx src/constants.ts src/index.css src/vite-env.d.ts src/components src/hooks src/i18n src/images index.html vite.config.ts eslint.config.js tsconfig.app.json tsconfig.node.json
git rm -r -q public/images/hero public/images/menu public/images/philosophy
mkdir -p src/assets
git mv assets/images-original src/assets/images
git status --short | head -40
```

Expected: `D` が並び、`R assets/images-original/... -> src/assets/images/...` が 7 件。`public/images/ogp.jpg` は残る。

- [ ] **Step 2: package.json を書き換える**

`package.json` を次の内容で上書きする:

```json
{
  "name": "najilaboule",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev --host",
    "build": "astro build && node scripts/verify-dist.mjs",
    "preview": "astro preview",
    "lint": "astro check",
    "lint:design": "npx -y @google/design.md@0.4.0 lint DESIGN.md",
    "check:lockfile": "node scripts/check-lockfile.mjs"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "astro": "^7.3.2",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Step 3: astro.config.ts、tsconfig.json、.gitignore を書く**

`astro.config.ts`:

```ts
import { defineConfig } from 'astro/config';

// フォント設定は Task 3 で追加する
export default defineConfig({
  site: 'https://atimot.github.io',
  base: '/najilaboule',
  // v7 の既定 'jsx' はインライン要素間の空白を落とすため、旧既定に戻す
  compressHTML: true,
});
```

`tsconfig.json` (上書き):

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

`.gitignore` の `dist` の次の行に `.astro/` を追加する:

```
dist
.astro/
dist-ssr
```

- [ ] **Step 4: 最小の index.astro と verify-dist.mjs を書く**

`src/pages/index.astro`:

```astro
---
// Task 3 で Base レイアウトに置き換える
---

<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Naji la boule | Ginza</title>
  </head>
  <body>
    <main id="main"></main>
  </body>
</html>
```

`scripts/verify-dist.mjs`:

```js
// dist/index.html の不変条件を検査する。`npm run build` の最後に走る。
// 検査を足すときは checks に [名前, 真偽値] を追加する。
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) ?? []).length;

const checks = [
  ['html lang="ja"', /<html[^>]*\slang="ja"/.test(html)],
  ['配信 JS ゼロ (JSON-LD 以外の <script> がない)', !/<script\b(?![^>]*application\/ld\+json)/.test(html)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`\nverify-dist: ${failed} 件失敗`);
  process.exit(1);
}
console.log(`\nverify-dist: ${checks.length} 件すべて通過`);
```

`count` は Task 5 以降で使う。

- [ ] **Step 5: 依存をインストールしてビルドする**

```bash
rm -rf node_modules package-lock.json
npx -y npm@latest install
npm run build
```

Expected: `astro build` が `dist/index.html` を生成し、verify-dist が `2 件すべて通過`。エラーが出た場合は Astro のメッセージに従って修正する (よくあるのは `tsconfig.json` の `.astro/types.d.ts` が未生成 → `npx astro sync` を先に実行)。

- [ ] **Step 6: 型チェックと lockfile 検査を通す**

```bash
npm run lint
node -e "const l=require('./package-lock.json');console.log(Object.keys(l.packages).filter(k=>/emnapi|sharp-wasm32/.test(k)).join('\n'))"
```

Expected: `astro check` がエラー 0。2 つ目の出力に `node_modules/@img/sharp-wasm32` と `node_modules/@emnapi/runtime` が含まれる。

`scripts/check-lockfile.mjs` の対象を sharp の wasm 変種に更新する (全文を次で上書き):

```js
// package-lock.json に wasm 系 optional 依存 (sharp の wasm32 変種と @emnapi/runtime) が含まれているか検査する。
// macOS の古い npm で lockfile を再生成すると脱落し、ローカルは通るのに Linux CI の
// npm ci だけが落ちる事故を、push 前に検出するための単一の正 (skills から参照)。
import { readFileSync } from 'node:fs';

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const need = ['@img/sharp-wasm32', '@emnapi/runtime'];
const missing = need.filter(
  (pkg) => !Object.keys(lock.packages).some((k) => k.endsWith('node_modules/' + pkg)),
);

if (missing.length) {
  console.error('lockfile に欠落:', missing.join(', '));
  console.error('`npx -y npm@latest install --package-lock-only` で再生成してください。');
  process.exit(1);
}
console.log('wasm optional deps OK');
```

```bash
npm run check:lockfile
```

Expected: `wasm optional deps OK`。

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "chore: React 一式を撤去し Astro 7 の最小構成に置き換え

- package.json / astro.config.ts / tsconfig.json を Astro 用に刷新 (依存は astro / @astrojs/check / typescript のみ)
- scripts/verify-dist.mjs を追加し、build の最後に dist/index.html の不変条件 (lang=ja、配信 JS ゼロ) を検査
- check-lockfile.mjs の対象を sharp の wasm 変種に更新
- 元画像を assets/images-original から src/assets/images へ移動、事前生成 WebP を削除

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 2: データ層 (店舗情報・文言・画像メタデータ)

**Files:**
- Create: `src/config.ts`, `src/i18n/types.ts`, `src/i18n/index.ts`, `src/content/ja.ts`, `src/assets/images.ts`

**Interfaces:**
- Produces:
  - `SITE` (`src/config.ts`): `{ name, kana, phone, phoneHref, riceShopUrl, mapQuery }` と `buildJsonLd(url, image)`
  - `Lang = 'ja' | 'en'`、`Copy` 型、`TitledText` 型 (`src/i18n/types.ts`)
  - `getCopy(lang?: string): Copy`、`SUPPORTED_LANGS: readonly Lang[]` (`src/i18n/index.ts`)
  - `images` (`src/assets/images.ts`): `{ hero, philosophy: [3], experience: { riz, soupe, mariage }, riceGift }`。各要素は `{ src: ImageMetadata, alt: { ja: string; en: string } }`

- [ ] **Step 1: 型を書く**

`src/i18n/types.ts`:

```ts
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
  philosophy: {
    acts: [TitledText, TitledText, TitledText];
  };
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
```

- [ ] **Step 2: 日本語の文言を書く**

`src/content/ja.ts` (文言は現行 `src/i18n/data.ts` の ja と同一。約物は曲線アポストロフィ `’` と en dash `–` を維持):

```ts
import type { Copy } from '../i18n/types';

export const ja: Copy = {
  meta: {
    title: 'Naji la boule | Ginza',
    description:
      '銀座の夜、米と汁を嗜む。おにぎりと汁、そして少しの酒。銀座6丁目の和食店「Naji la boule (ナジラブール)」公式サイト。ご予約は03-6228-5803まで。',
  },
  common: {
    skipToContent: '本文へスキップ',
    navLabel: 'メインナビゲーション',
    reserveByPhone: '電話で予約する',
  },
  header: {
    kana: 'ナジラブール',
    navAccess: 'Access',
  },
  hero: {
    title: '銀座の夜、\n米と汁を嗜む。',
    tagline: 'Riz et Soupe, et un peu d’alcool.',
  },
  philosophy: {
    acts: [
      {
        title: '一粒の想いを、\n世界へ。',
        body: '日本の風土が育んだ、かけがえのない一粒。\nその美味しさを、もっと多くの人に届けたい。\nNaji la bouleは、その想いから生まれました。',
      },
      {
        title: '銀座の宵に、\n米と憩う。',
        body: '喧騒からそっと離れて、炊きたての米を味わう贅沢。\nお酒を傾けながら、ゆったりと流れる時間をお過ごしください。',
      },
      {
        title: '美味しさを、\n誰かへ。',
        body: '「この米、美味しいな」——その気持ちを、\n大切な人への贈り物にしてみませんか。\n一粒の感動が、人と人をつなぎます。',
      },
    ],
  },
  experience: {
    riz: {
      title: '結ぶ、米。',
      body: '厳選された米を、掌でそっと結ぶ。\n一粒一粒が寄り合うおむすびは、\nこの店の全ての始まりです。',
    },
    soupe: {
      title: 'ほどける、汁。',
      body: '銀座の夜の緊張を解きほぐす。\n季節の食材を椀の中に閉じ込めました。\nおにぎりとの調和をお楽しみください。',
    },
    mariage: {
      title: '揺蕩う、盃。',
      body: '厳選された酒が、おにぎりと汁に寄り添う。\n盃を重ねるほどに心は揺蕩い、\n銀座の宵はゆるやかに更けていきます。',
    },
  },
  boutique: {
    title: 'この一粒を、\nご自宅へ。',
    body: '当店のおむすびを結ぶのは、新潟・弥彦村で育まれた「伊彌彦米」。\n店で出会った美味しさを、ご家庭の食卓でも。\n大切な方への贈り物にもおすすめです。',
    ctaAriaLabel: '伊彌彦米オンラインショップ（外部サイト・新しいタブで開きます）',
  },
  access: {
    address: '東京都中央区銀座6-12-12\n銀座ステラビル2階',
    hoursMain: '営業時間 18:30 – 23:30',
    hoursClosed: '定休日 土日祝日',
    reservationHeading: 'ご予約',
    reservationNote: 'ご予約はお電話のみ承っております。\n席数に限りがございますので、\nお早めのご連絡をおすすめいたします。',
    mapTitle: '店舗の地図 — 東京都中央区銀座6-12-12 銀座ステラビル2階',
  },
};
```

- [ ] **Step 3: i18n の入口と店舗情報を書く**

`src/i18n/index.ts`:

```ts
import { ja } from '../content/ja';
import type { Copy, Lang } from './types';

export type { Copy, Lang, TitledText } from './types';

/** 英語版を足すときは 'en' を追加し、getCopy で en を返す */
export const SUPPORTED_LANGS = ['ja'] as const satisfies readonly Lang[];

export function getCopy(_lang?: string): Copy {
  return ja;
}
```

`src/config.ts`:

```ts
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
```

- [ ] **Step 4: 画像メタデータを書く**

`src/assets/images.ts`:

```ts
import type { ImageMetadata } from 'astro';
import hero from './images/hero/background.jpg';
import slide01 from './images/philosophy/slide-01.jpg';
import slide02 from './images/philosophy/slide-02.jpg';
import slide03 from './images/philosophy/slide-03.jpg';
import item01 from './images/menu/item-01.jpg';
import item02 from './images/menu/item-02.jpg';
import item03 from './images/menu/item-03.jpg';

export interface SiteImage {
  readonly src: ImageMetadata;
  readonly alt: { readonly ja: string; readonly en: string };
}

/** 「水引で結ばれた米の贈り物」。Philosophy 3 幕目と BOUTIQUE 背景で共用 */
const riceGift: SiteImage = {
  src: slide03,
  alt: { ja: '水引で結ばれた米の贈り物', en: 'A gift of rice tied with mizuhiki' },
};

// ファイル名とカードの対応に注意: item-01=汁 (soupe)、item-02=米 (riz)、item-03=酒 (mariage)
export const images = {
  hero: {
    src: hero,
    alt: { ja: '銀座のバーカウンターに並ぶおにぎりと汁と酒', en: 'Onigiri, soup and sake on a Ginza bar counter' },
  },
  philosophy: [
    { src: slide01, alt: { ja: '指先に乗せた一粒の米', en: 'A single grain of rice on a fingertip' } },
    { src: slide02, alt: { ja: '炊きたての米を湛えた土鍋', en: 'Donabe pot of freshly cooked rice' } },
    riceGift,
  ],
  experience: {
    riz: { src: item02, alt: { ja: 'おむすびを結ぶ手', en: 'Hands shaping an onigiri' } },
    soupe: { src: item01, alt: { ja: '澄まし汁の椀', en: 'Bowl of clear dashi soup' } },
    mariage: { src: item03, alt: { ja: '盃と酒', en: 'Sake cup' } },
  },
  riceGift,
} as const satisfies {
  hero: SiteImage;
  philosophy: readonly SiteImage[];
  experience: Record<'riz' | 'soupe' | 'mariage', SiteImage>;
  riceGift: SiteImage;
};
```

- [ ] **Step 5: 型チェックとビルド**

```bash
npm run lint && npm run build
```

Expected: どちらもエラー 0 (画像 import の型は Astro が `.astro/types.d.ts` で解決する。`Cannot find module './images/hero/background.jpg'` が出たら `npx astro sync` を実行してから再試行)。

- [ ] **Step 6: コミット**

```bash
git add src/config.ts src/i18n src/content src/assets/images.ts
git commit -m "feat: 店舗情報・文言・画像メタデータのデータ層を追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 3: トークン・global CSS・Base レイアウト・フォント

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`
- Modify: `astro.config.ts` (fonts)、`src/pages/index.astro` (Base を使う)、`scripts/verify-dist.mjs` (検査追加)、`public/sitemap.xml`

**Interfaces:**
- Consumes: `SITE`、`buildJsonLd`、`getCopy`、`SUPPORTED_LANGS`、`Lang`
- Produces:
  - `Base.astro` props: `{ lang: Lang; preload?: { srcSet: string; sizes: string; type: string } }`。`<slot />` に `<main id="main">` を含むページ本体を入れる
  - CSS 変数 (tokens.css) と共通クラス `.container` `.container--narrow` `.section` `.label` `.label--muted` `.reveal`、keyframes `fade-in` `rise-in` `dot-in` `slow-zoom` `reveal-rise`
  - CSS 変数 `--font-playfair` `--font-shippori` (Fonts API が定義) と `--font-serif`

- [ ] **Step 1: 失敗する検査を足す**

`scripts/verify-dist.mjs` の `checks` に追加:

```js
  ['Google Fonts への外部参照がない', !/fonts\.(googleapis|gstatic)\.com/.test(html)],
  ['Playfair Display の @font-face が自前ホストされている', /@font-face[^}]*Playfair Display/.test(html) || /_astro\/fonts\//.test(html)],
  ['canonical', html.includes('<link rel="canonical" href="https://atimot.github.io/najilaboule/"')],
  ['JSON-LD Restaurant', /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"Restaurant"/.test(html)],
  ['og:image', html.includes('content="https://atimot.github.io/najilaboule/images/ogp.jpg"')],
  ['skip link', html.includes('class="skip-link"')],
  ['theme-color', html.includes('<meta name="theme-color" content="#241816"')],
```

```bash
npm run build
```

Expected: 上の 7 件が `FAIL`。

- [ ] **Step 2: tokens.css を書く**

`src/styles/tokens.css` (値は DESIGN.md フロントマターと同一。DESIGN.md を変えたらここも揃える):

```css
/* DESIGN.md のフロントマター (colors / typography / spacing / rounded) を :root に写したもの。
   正は DESIGN.md。値を変えるときは DESIGN.md → ここ の順で揃え、npm run lint:design を通す */
:root {
  /* colors */
  --color-brand: #241816;
  --color-brand-dark: #1f1513;
  --color-brand-light: #2a1d1b;
  --color-accent: #C8A67B;
  --color-text: #f8f8f8;
  --color-text-soft: oklch(87.2% 0.01 258.338);
  --color-text-muted: oklch(70.7% 0.022 261.325);
  --color-line-strong: rgba(255, 255, 255, 0.5);
  --color-line: rgba(255, 255, 255, 0.2);
  --color-line-faint: rgba(255, 255, 255, 0.05);
  --color-scrollbar-thumb: #443330;
  --color-dot-white: #FFFFFF;
  --color-dot-black: #000000;
  --color-dot-red: #E60012;
  --color-dot-blue: #0099CC;
  --color-dot-yellow: #FFD700;
  --color-dot-green: #009944;
  --color-dot-orange: #F39800;
  --color-dot-pink: #E6007F;
  --color-dot-purple: #920783;
  /* 黒ドットの輪郭 (DESIGN.md Brand Dots: #4a5565 相当) */
  --color-dot-border: oklch(44.6% 0.03 256.802);

  /* typography: --font-playfair / --font-shippori は Astro Fonts API が定義する */
  --font-serif: var(--font-playfair), var(--font-shippori), serif;
  --text-display: 3.5rem;
  --text-display-mobile: 2.25rem;
  --leading-display: 1.11;
  --tracking-display: 0.2em;
  --text-headline: 2.5rem;
  --text-headline-mobile: 1.875rem;
  --leading-headline: 1.2;
  --text-title: 1.875rem;
  --text-title-mobile: 1.5rem;
  --leading-title: 1.625;
  --text-brand: 1.5rem;
  --text-brand-mobile: 1.25rem;
  --leading-brand: 1.33;
  --text-body: 1rem;
  --text-body-mobile: 0.875rem;
  --leading-body: 2;
  --text-menu: 0.875rem;
  --leading-menu: 1.43;
  --text-label: 0.75rem;
  --leading-label: 1.33;
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-wide: 0.1em;
  --tracking-wider: 0.2em;
  --tracking-widest: 0.3em;

  /* spacing */
  --space-section-x: 24px;
  --space-section-x-md: 80px;
  --space-section-y: 96px;
  --space-section-y-md: 160px;
  --space-header: 24px;
  --space-header-md: 40px;
  --space-stack: 32px;
  --space-stack-lg: 48px;
  --space-stack-xl: 64px;
  --space-card-gap: 96px;
  --space-card-gap-md: 128px;

  /* rounded */
  --radius-none: 0px;
  --radius-full: 9999px;
  --radius-scrollbar: 4px;

  /* layout / motion (DESIGN.md 本文 Layout / Motion Grammar) */
  --container: 80rem;
  --container-narrow: 48rem;
  --ease-out: cubic-bezier(0, 0, 0.58, 1);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
  --duration-hover: 300ms;
  --duration-button: 500ms;
}
```

- [ ] **Step 3: global.css を書く**

`src/styles/global.css` (現行 `src/index.css` の `@layer base` を素の CSS に移し、共通クラスと keyframes を足したもの):

```css
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-brand);
  background-image:
    url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
    radial-gradient(ellipse 90% 70% at 20% 10%, color-mix(in srgb, var(--color-accent) 6%, var(--color-brand-light)) 0%, transparent 50%),
    radial-gradient(ellipse 80% 80% at 85% 85%, var(--color-brand-dark) 0%, transparent 55%);
  background-attachment: fixed, fixed, fixed;
  background-size: 240px 240px, auto, auto;
  background-repeat: repeat, no-repeat, no-repeat;
  background-blend-mode: soft-light, normal, normal;
  color: var(--color-text);
  font-family: var(--font-serif);
  font-feature-settings: "palt";
  overflow-x: hidden;
  min-height: 100vh;
}

h1,
h2,
h3 {
  font-weight: 400;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-brand);
}

::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: var(--radius-scrollbar);
}

/* skip link: フォーカスされたときだけ左上に現れる */
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 100;
  padding: 8px 16px;
  background: var(--color-accent);
  color: var(--color-brand);
  letter-spacing: var(--tracking-wide);
}

.skip-link:focus {
  top: 16px;
}

/* layout */
.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
}

.container--narrow {
  max-width: var(--container-narrow);
}

.section {
  padding: var(--space-section-y) var(--space-section-x);
}

/* セクションラベル (RIZ / BOUTIQUE / GINZA など) */
.label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--text-label);
  line-height: var(--leading-label);
  letter-spacing: var(--tracking-widest);
  color: var(--color-accent);
}

.label--muted {
  color: var(--color-text-muted);
}

@media (min-width: 48rem) {
  .section {
    padding: var(--space-section-y-md) var(--space-section-x-md);
  }
}

/* 共通 keyframes */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rise-in {
  from { opacity: 0; translate: 0 10px; }
  to { opacity: 1; translate: 0 0; }
}

@keyframes dot-in {
  from { opacity: 0; scale: 0; }
  to { opacity: 1; scale: 1; }
}

@keyframes slow-zoom {
  from { scale: 1.1; }
  to { scale: 1.2; }
}

@keyframes reveal-rise {
  from { opacity: 0; translate: 0 30px; }
  to { opacity: 1; translate: 0 0; }
}

/* スクロールで視界に入る区間 (entry 0% → 40%) で浮き上がる。
   非対応ブラウザ (Firefox 158 未満) と reduced-motion では常に表示 */
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: フォント設定を astro.config.ts に足す**

`astro.config.ts` を次で上書き:

```ts
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
```

- [ ] **Step 5: Base.astro を書く**

`src/layouts/Base.astro`:

```astro
---
import { Font } from 'astro:assets';
import '@/styles/global.css';
import { SITE, buildJsonLd } from '@/config';
import { getCopy, SUPPORTED_LANGS, type Lang } from '@/i18n';

interface Props {
  lang: Lang;
  /** LCP 画像の preload (Hero が渡す) */
  preload?: { srcSet: string; sizes: string; type: string };
}

const { lang, preload } = Astro.props;
const t = getCopy(lang);
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // '/najilaboule/'
const canonical = new URL(base, Astro.site).href;
const ogImage = new URL(`${base}images/ogp.jpg`, Astro.site).href;
const ogLocale = lang === 'ja' ? 'ja_JP' : 'en_US';
const jsonLd = buildJsonLd(canonical, ogImage);
---

<!doctype html>
<html lang={lang} class="dark" style="color-scheme: dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{t.meta.title}</title>
    <meta name="description" content={t.meta.description} />
    <link rel="canonical" href={canonical} />
    {
      SUPPORTED_LANGS.length > 1 &&
        SUPPORTED_LANGS.map((l) => (
          <link rel="alternate" hreflang={l} href={l === 'ja' ? canonical : `${canonical}${l}/`} />
        ))
    }
    <meta name="theme-color" content="#241816" />
    <link rel="icon" type="image/png" sizes="32x32" href={`${base}favicon-32x32.png`} />
    <link rel="icon" type="image/png" sizes="16x16" href={`${base}favicon-16x16.png`} />
    <link rel="apple-touch-icon" sizes="180x180" href={`${base}apple-touch-icon.png`} />
    <link rel="manifest" href={`${base}site.webmanifest`} />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE.name} />
    <meta property="og:title" content={t.meta.title} />
    <meta property="og:description" content={t.meta.description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content={ogLocale} />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json" is:inline set:html={JSON.stringify(jsonLd)} />

    <Font cssVariable="--font-playfair" preload />
    <Font cssVariable="--font-shippori" />
    {
      preload && (
        <link rel="preload" as="image" type={preload.type} imagesrcset={preload.srcSet} imagesizes={preload.sizes} fetchpriority="high" />
      )
    }
  </head>
  <body>
    <a class="skip-link" href="#main">{t.common.skipToContent}</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 6: index.astro を Base に載せる**

`src/pages/index.astro` を上書き:

```astro
---
import Base from '@/layouts/Base.astro';
---

<Base lang="ja">
  <main id="main"></main>
</Base>
```

- [ ] **Step 7: sitemap.xml を 1 URL にする**

`public/sitemap.xml` を上書き:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://atimot.github.io/najilaboule/</loc>
  </url>
</urlset>
```

- [ ] **Step 8: ビルドしてフォント出力を確認する**

```bash
npm run lint && npm run build
ls dist/_astro/fonts/ | head -20
grep -o '@font-face{[^}]*}' dist/index.html | head -6
grep -o -- '--font-playfair:[^;]*;' dist/index.html | head -1
grep -o -- '--font-shippori:[^;]*;' dist/index.html | head -1
```

Expected:
- verify-dist が 9 件すべて通過
- `dist/_astro/fonts/` に Playfair の woff2 (400 / 700) と Shippori の woff2 が並ぶ。`glyphs` が効いていれば Shippori は 400 / 700 の 2 ファイルで各数十 KB 以下。効いていない (60 スライス並ぶ) 場合もこの Task では許容し、Task 9 で判断する
- `--font-playfair` の値に `serif` が **含まれない** (`"Playfair Display"` のみ)。含まれていたら `fallbacks: []` / `optimizedFallbacks: false` が効いていないので、Astro の Fonts API リファレンスで該当オプション名を確認して直す
- `--font-shippori` の値は `"Shippori Mincho", "<最適化フォールバック名>", serif` の形

glyphs でビルドが失敗する場合 (unifont が `text=` 指定を拒否する等) は `options` ブロックを削除してビルドし直し、その旨を Task 9 の記録に残す。

- [ ] **Step 9: コミット**

```bash
git add astro.config.ts src/styles src/layouts src/pages/index.astro scripts/verify-dist.mjs public/sitemap.xml
git commit -m "feat: デザイントークン・global CSS・Base レイアウト・自前ホストフォントを追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 4: Button・BrandDots・Header

**Files:**
- Create: `src/components/Button.astro`, `src/components/BrandDots.astro`, `src/components/Header.astro`
- Modify: `src/pages/index.astro`, `scripts/verify-dist.mjs`

**Interfaces:**
- Produces:
  - `Button.astro` props: `{ href: string; ariaLabel: string; variant?: 'outline' | 'filled'; size?: 'sm' | 'md' | 'lg'; external?: boolean; class?: string }`、子要素がラベル
  - `BrandDots.astro` props: `{ size?: 'sm' | 'md'; animated?: boolean; class?: string }`
  - `Header.astro` props なし

- [ ] **Step 1: 失敗する検査を足す**

`scripts/verify-dist.mjs` の `checks` に追加:

```js
  ['<header> がある', /<header\b/.test(html)],
  ['ヘッダーに電話予約リンク', /<header[\s\S]*?href="tel:03-6228-5803"[\s\S]*?<\/header>/.test(html)],
  ['ナビに aria-label', /<nav[^>]*aria-label="メインナビゲーション"/.test(html)],
```

```bash
npm run build
```

Expected: 3 件 `FAIL`。

- [ ] **Step 2: Button.astro を書く**

```astro
---
interface Props {
  href: string;
  ariaLabel: string;
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  /** 外部リンク: 新しいタブで開き rel を付ける */
  external?: boolean;
  class?: string;
}

const { href, ariaLabel, variant = 'outline', size = 'md', external = false, class: className } = Astro.props;
---

<a
  href={href}
  aria-label={ariaLabel}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  class:list={['button', `button--${variant}`, `button--${size}`, className]}
>
  <slot />
</a>

<style>
  .button {
    display: inline-block;
    border: 1px solid;
    text-align: center;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
    transition:
      background-color var(--duration-button),
      border-color var(--duration-button),
      color var(--duration-button);
  }

  .button--outline {
    background: transparent;
    border-color: var(--color-line-strong);
    color: inherit;
  }

  .button--outline:hover {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-brand);
  }

  .button--filled {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-line);
    color: inherit;
  }

  .button--filled:hover {
    background: #fff;
    color: var(--color-brand);
  }

  .button--sm {
    padding: 8px 24px;
    font-size: var(--text-label);
    line-height: var(--leading-label);
  }

  .button--md {
    padding: 12px 32px;
    font-size: var(--text-menu);
    line-height: var(--leading-menu);
  }

  .button--lg {
    width: 100%;
    padding: 16px 32px;
    font-size: var(--text-menu);
    line-height: var(--leading-menu);
  }
</style>
```

- [ ] **Step 3: BrandDots.astro を書く**

```astro
---
interface Props {
  size?: 'sm' | 'md';
  /** Hero の開演で 1 つずつ灯る */
  animated?: boolean;
  class?: string;
}

const { size = 'md', animated = false, class: className } = Astro.props;
const DOTS = ['white', 'black', 'red', 'blue', 'yellow', 'green', 'orange', 'pink', 'purple'] as const;
---

<div aria-hidden="true" class:list={['dots', `dots--${size}`, animated && 'dots--animated', className]}>
  {DOTS.map((name, i) => <span class={`dot dot--${name}`} style={`--i: ${i}`}></span>)}
</div>

<style>
  .dots {
    display: grid;
    grid-template-columns: repeat(3, auto);
    width: fit-content;
  }

  .dots--sm {
    gap: 8px;
  }

  .dots--sm .dot {
    width: 8px;
    height: 8px;
  }

  .dots--md {
    gap: 12px;
  }

  .dots--md .dot {
    width: 12px;
    height: 12px;
  }

  @media (min-width: 48rem) {
    .dots--md {
      gap: 16px;
    }

    .dots--md .dot {
      width: 16px;
      height: 16px;
    }
  }

  .dot {
    border-radius: var(--radius-full);
  }

  .dot--white {
    background: var(--color-dot-white);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-white) 50%, transparent);
  }

  .dot--black {
    background: var(--color-dot-black);
    border: 1px solid var(--color-dot-border);
  }

  .dot--red {
    background: var(--color-dot-red);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-red) 30%, transparent);
  }

  .dot--blue {
    background: var(--color-dot-blue);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-blue) 30%, transparent);
  }

  .dot--yellow {
    background: var(--color-dot-yellow);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-yellow) 30%, transparent);
  }

  .dot--green {
    background: var(--color-dot-green);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-green) 30%, transparent);
  }

  .dot--orange {
    background: var(--color-dot-orange);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-orange) 30%, transparent);
  }

  .dot--pink {
    background: var(--color-dot-pink);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-pink) 30%, transparent);
  }

  .dot--purple {
    background: var(--color-dot-purple);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-dot-purple) 30%, transparent);
  }

  /* 開演: 0.3s から 0.1s 刻みで 9 つが灯る (spec §7.1) */
  .dots--animated .dot {
    animation: dot-in 0.5s var(--ease-out) calc(0.3s + var(--i) * 0.1s) both;
  }
</style>
```

- [ ] **Step 4: Header.astro を書く**

```astro
---
import Button from '@/components/Button.astro';
import { SITE } from '@/config';
import { getCopy } from '@/i18n';

const t = getCopy(Astro.currentLocale);
---

<header class="header">
  <a href="#top" class="brand">
    {SITE.name}
    <span lang="ja" class="brand__kana">{t.header.kana}</span>
  </a>
  <nav class="nav" aria-label={t.common.navLabel}>
    <a href="#access" class="nav__link">{t.header.navAccess}</a>
    <Button href={SITE.phoneHref} ariaLabel={`${t.common.reserveByPhone} (${SITE.phone})`} variant="outline" size="sm">
      RESERVATION
    </Button>
  </nav>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-header);
    background: linear-gradient(to bottom, color-mix(in srgb, var(--color-brand) 90%, transparent), transparent);
    color: #fff;
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    /* 開演の最後にヘッダーが現れる (spec §7.1) */
    animation: fade-in 1s var(--ease-out) 1.8s both;
  }

  .brand {
    display: block;
    font-size: var(--text-brand-mobile);
    line-height: 1.4;
    letter-spacing: var(--tracking-wide);
    text-align: left;
  }

  .brand__kana {
    display: block;
    margin-top: 4px;
    font-size: var(--text-label);
    line-height: var(--leading-label);
    letter-spacing: var(--tracking-wider);
    color: var(--color-text-muted);
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 32px;
    font-size: var(--text-menu);
    line-height: var(--leading-menu);
    letter-spacing: var(--tracking-wide);
  }

  /* モバイルでは Access リンクを省き、RESERVATION だけを置く (spec §14 #3) */
  .nav__link {
    display: none;
    transition: color var(--duration-hover);
  }

  .nav__link:hover {
    color: var(--color-accent);
  }

  @media (min-width: 48rem) {
    .header {
      padding: var(--space-header-md);
    }

    .brand {
      font-size: var(--text-brand);
      line-height: var(--leading-brand);
    }

    .brand__kana {
      font-size: var(--text-menu);
      line-height: var(--leading-menu);
    }

    .nav__link {
      display: inline;
    }
  }
</style>
```

- [ ] **Step 5: index.astro に Header を置く**

```astro
---
import Base from '@/layouts/Base.astro';
import Header from '@/components/Header.astro';
---

<Base lang="ja">
  <Header />
  <main id="main"></main>
</Base>
```

- [ ] **Step 6: ビルドと確認**

```bash
npm run lint && npm run build
```

Expected: verify-dist が 12 件すべて通過。

- [ ] **Step 7: コミット**

```bash
git add src/components/Button.astro src/components/BrandDots.astro src/components/Header.astro src/pages/index.astro scripts/verify-dist.mjs
git commit -m "feat: Button / BrandDots / Header を追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 5: Hero と「開演」演出

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro` (preload)、`scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `images.hero`、`getCopy`、`BrandDots`、`Base` の `preload` prop
- Produces: `#top` セクション、ページ唯一の `<h1 id="hero-title">`

- [ ] **Step 1: 失敗する検査を足す**

`scripts/verify-dist.mjs` の `checks` に追加:

```js
  ['h1 はちょうど 1 つ', count(/<h1\b/g) === 1],
  ['#top セクション', /<section[^>]*id="top"/.test(html)],
  ['Hero 画像は AVIF source + fetchpriority=high', /<source[^>]*type="image\/avif"/.test(html) && /<img[^>]*fetchpriority="high"/.test(html)],
  ['Hero 画像の preload (avif)', /<link rel="preload" as="image" type="image\/avif" imagesrcset="[^"]+" imagesizes="100vw" fetchpriority="high">/.test(html)],
```

```bash
npm run build
```

Expected: 4 件 `FAIL`。

- [ ] **Step 2: Hero.astro を書く**

```astro
---
import { Picture } from 'astro:assets';
import BrandDots from '@/components/BrandDots.astro';
import { images } from '@/assets/images';
import { getCopy } from '@/i18n';

const t = getCopy(Astro.currentLocale);
---

<section id="top" class="hero" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true">
    <Picture
      src={images.hero.src}
      formats={['avif', 'webp']}
      widths={[800, 1600, 2400]}
      sizes="100vw"
      alt=""
      priority
      class="hero__img"
    />
    <div class="hero__overlay"></div>
  </div>
  <div class="hero__content">
    <BrandDots size="md" animated class="hero__dots" />
    <h1 id="hero-title" class="hero__title">{t.hero.title}</h1>
    <p class="hero__tagline">{t.hero.tagline}</p>
  </div>
</section>

<style>
  .hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
  }

  .hero__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero__bg :global(picture) {
    display: contents;
  }

  /* 開演: 0.15 → 0.5 に 1.8s で明るくなる (0 から始めないのは LCP を遅らせないため)。
     slow-zoom は 20s で 1.1 → 1.2 倍を往復 (単一スケール、spec §14 #6) */
  .hero :global(.hero__img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: 0.5;
    animation:
      hero-photo-in 1.8s var(--ease-out) both,
      slow-zoom 20s ease infinite alternate;
  }

  @keyframes hero-photo-in {
    from { opacity: 0.15; }
    to { opacity: 0.5; }
  }

  .hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-brand) 60%, transparent),
      transparent,
      var(--color-brand)
    );
  }

  .hero__content {
    position: relative;
    z-index: 10;
    padding-inline: var(--space-section-x);
    text-align: center;
  }

  .hero :global(.hero__dots) {
    margin: 0 auto 40px;
  }

  .hero__title {
    margin-bottom: 24px;
    font-size: var(--text-display-mobile);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    white-space: pre-line;
    animation: rise-in 1.5s var(--ease-out) 0.8s both;
  }

  .hero__tagline {
    font-size: var(--text-body-mobile);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    animation: fade-in 1.5s var(--ease-out) 1.3s both;
  }

  @media (min-width: 48rem) {
    .hero__content {
      padding-inline: var(--space-section-x-md);
    }

    .hero__title {
      font-size: var(--text-display);
    }

    .hero__tagline {
      font-size: var(--text-body);
    }
  }
</style>
```

- [ ] **Step 3: index.astro で preload を組み立てて Hero を置く**

```astro
---
import { getImage } from 'astro:assets';
import Base from '@/layouts/Base.astro';
import Header from '@/components/Header.astro';
import Hero from '@/components/Hero.astro';
import { images } from '@/assets/images';

// Hero の <Picture> と同じ設定で AVIF の srcset を得て、<head> で preload する
const heroAvif = await getImage({ src: images.hero.src, format: 'avif', widths: [800, 1600, 2400] });
const heroPreload = { srcSet: heroAvif.srcSet.attribute, sizes: '100vw', type: 'image/avif' };
---

<Base lang="ja" preload={heroPreload}>
  <Header />
  <main id="main">
    <Hero />
  </main>
</Base>
```

- [ ] **Step 4: ビルドして preload と source の URL が一致することを確認**

```bash
npm run lint && npm run build
node -e "
const h=require('fs').readFileSync('dist/index.html','utf8');
const pre=h.match(/imagesrcset=\"([^\"]+)\"/)[1];
const src=h.match(/<source[^>]*type=\"image\/avif\"[^>]*srcset=\"([^\"]+)\"/)[1];
console.log(pre===src?'preload と source の srcset が一致':'不一致\n'+pre+'\n'+src);
"
```

Expected: verify-dist が 16 件すべて通過、`preload と source の srcset が一致`。不一致なら `getImage` と `<Picture>` の `format` / `widths` / `quality` を揃える。

- [ ] **Step 5: コミット**

```bash
git add src/components/Hero.astro src/pages/index.astro scripts/verify-dist.mjs
git commit -m "feat: Hero と開演演出、LCP 画像の preload を追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 6: Philosophy (3 幕の scrollytelling)

**Files:**
- Create: `src/components/Philosophy.astro`
- Modify: `src/pages/index.astro`、`scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `images.philosophy` (3 枚)、`getCopy().philosophy.acts` (3 組)
- Produces: `#philosophy` セクション。h2 ×3 (先頭が `id="philosophy-title"`)

- [ ] **Step 1: 失敗する検査を足す**

```js
  ['#philosophy セクション', /<section[^>]*id="philosophy"/.test(html)],
  ['Philosophy の 3 幕 (article ×3)', count(/<article\b/g) === 3],
  ['Philosophy の写真 alt (デスクトップ用とモバイル用)', count(/alt="指先に乗せた一粒の米"/g) === 2 && count(/alt="水引で結ばれた米の贈り物"/g) >= 2],
```

```bash
npm run build
```

Expected: 3 件 `FAIL`。

- [ ] **Step 2: Philosophy.astro を書く**

```astro
---
import { Picture } from 'astro:assets';
import { images } from '@/assets/images';
import { getCopy } from '@/i18n';

const lang = Astro.currentLocale === 'en' ? 'en' : 'ja';
const t = getCopy(lang);
const acts = t.philosophy.acts;
const photos = images.philosophy;
const SIZES = '(min-width: 48rem) 44rem, 100vw';
---

<section id="philosophy" class="philosophy" aria-labelledby="philosophy-title">
  <div class="deco" aria-hidden="true">
    <span class="deco__dot deco__dot--1"></span>
    <span class="deco__dot deco__dot--2"></span>
  </div>

  <div class="philosophy__inner">
    <!-- デスクトップ: 左に留まる写真。幕が進むと次の写真がクロスフェードする -->
    <figure class="stage">
      {
        photos.map((photo, i) => (
          <div class={`stage__photo stage__photo--${i + 1}`}>
            <Picture src={photo.src} formats={['avif', 'webp']} widths={[800, 1600]} sizes={SIZES} alt={photo.alt[lang]} />
          </div>
        ))
      }
    </figure>

    <div class="acts">
      {
        acts.map((act, i) => (
          <article class="act" style={`view-timeline-name: --act-${i + 1}`}>
            <div class="act__photo">
              <Picture src={photos[i].src} formats={['avif', 'webp']} widths={[800, 1600]} sizes={SIZES} alt={photos[i].alt[lang]} />
            </div>
            <div class="act__text">
              <h2 id={i === 0 ? 'philosophy-title' : undefined} class="act__title">
                {act.title}
              </h2>
              <p class="act__body">{act.body}</p>
            </div>
          </article>
        ))
      }
    </div>
  </div>
</section>

<style>
  .philosophy {
    position: relative;
  }

  .deco {
    display: none;
  }

  /* ---- モバイル (既定): 3 幕を縦積み、各幕の背面に写真 ---- */
  .stage {
    display: none;
  }

  .act {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: var(--space-section-y) var(--space-section-x);
    text-align: center;
  }

  .act__photo {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .act__photo :global(picture) {
    display: contents;
  }

  .act__photo :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.25);
  }

  .act__photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-brand) 85%, transparent),
      color-mix(in srgb, var(--color-brand) 50%, transparent),
      color-mix(in srgb, var(--color-brand) 85%, transparent)
    );
  }

  .act__text {
    position: relative;
    z-index: 1;
    max-width: 92vw;
    margin-inline: auto;
  }

  .act__title {
    margin-bottom: var(--space-stack);
    font-size: var(--text-title-mobile);
    line-height: var(--leading-title);
    letter-spacing: var(--tracking-wide);
    white-space: pre-line;
  }

  .act__body {
    font-size: var(--text-body-mobile);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-soft);
    white-space: pre-line;
  }

  /* ---- デスクトップ: 左 55% に sticky の写真、右 45% に 3 幕 ---- */
  @media (min-width: 48rem) {
    .philosophy {
      padding: var(--space-section-y-md) var(--space-section-x-md);
      timeline-scope: --act-1, --act-2, --act-3;
    }

    .deco {
      display: block;
      pointer-events: none;
    }

    .deco__dot {
      position: absolute;
      border-radius: var(--radius-full);
      filter: blur(1px);
    }

    .deco__dot--1 {
      top: 96px;
      right: 8%;
      width: 6px;
      height: 6px;
      background: color-mix(in srgb, var(--color-accent) 40%, transparent);
    }

    .deco__dot--2 {
      right: 18%;
      bottom: 128px;
      width: 4px;
      height: 4px;
      background: color-mix(in srgb, var(--color-dot-yellow) 30%, transparent);
    }

    .philosophy__inner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 32px;
      width: 100%;
      max-width: var(--container);
      margin-inline: auto;
    }

    .stage {
      position: sticky;
      top: calc((100vh - 700px) / 2);
      display: block;
      width: 55%;
      height: 700px;
      margin: 0;
    }

    /* 現行の左上の赤い光点 */
    .stage::before {
      content: '';
      position: absolute;
      top: -40px;
      left: -40px;
      z-index: 10;
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--color-dot-red);
      filter: blur(1px);
    }

    .stage__photo {
      position: absolute;
      inset: 0;
    }

    .stage__photo :global(picture) {
      display: contents;
    }

    .stage__photo :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.25);
    }

    /* 写真 2・3 は対応する幕が入ってくる区間で現れる。非対応ブラウザと reduced-motion では写真 1 のみ */
    .stage__photo--2,
    .stage__photo--3 {
      opacity: 0;
    }

    @supports (animation-timeline: view()) {
      .stage__photo--2 {
        animation: photo-in linear both;
        animation-timeline: --act-2;
        animation-range: entry 0% cover 30%;
      }

      .stage__photo--3 {
        animation: photo-in linear both;
        animation-timeline: --act-3;
        animation-range: entry 0% cover 30%;
      }
    }

    .acts {
      width: 45%;
    }

    .act {
      justify-content: flex-start;
      min-height: 70vh;
      padding: 0;
      text-align: left;
    }

    .act__photo {
      display: none;
    }

    .act__text {
      max-width: none;
      margin: 0;
    }

    .act__title {
      margin-bottom: var(--space-stack-lg);
      font-size: var(--text-title);
    }

    .act__body {
      font-size: var(--text-body);
    }
  }

  @keyframes photo-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
```

- [ ] **Step 3: index.astro に置く**

import を足し、`<Hero />` の直後に `<Philosophy />` を追加する:

```astro
import Philosophy from '@/components/Philosophy.astro';
```

```astro
  <main id="main">
    <Hero />
    <Philosophy />
  </main>
```

- [ ] **Step 4: ビルドと目視**

```bash
npm run lint && npm run build
npm run preview
```

Expected: verify-dist が 19 件すべて通過。ブラウザで `http://localhost:4173/najilaboule/` を開き、1440px 幅で Philosophy をスクロールすると左の写真が留まり、2 幕目・3 幕目に入ると写真が切り替わる (Chrome / Safari 26)。390px 幅では 3 幕が縦に並び、各幕の背面に暗い写真が出る。確認したら preview を止める。

- [ ] **Step 5: コミット**

```bash
git add src/components/Philosophy.astro src/pages/index.astro scripts/verify-dist.mjs
git commit -m "feat: Philosophy を 3 幕の scrollytelling として追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 7: Experience

**Files:**
- Create: `src/components/Experience.astro`
- Modify: `src/pages/index.astro`、`scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `images.experience`、`getCopy().experience`
- Produces: `#experience` セクション。h2 ×3

- [ ] **Step 1: 失敗する検査を足す**

```js
  ['#experience セクション', /<section[^>]*id="experience"/.test(html)],
  ['RIZ / SOUPE / MARIAGE ラベル', ['RIZ', 'SOUPE', 'MARIAGE'].every((l) => html.includes(`>${l}</span>`))],
  ['Experience の h2 ×3', ['結ぶ、米。', 'ほどける、汁。', '揺蕩う、盃。'].every((s) => new RegExp(`<h2[^>]*>${s}</h2>`).test(html))],
```

```bash
npm run build
```

Expected: 3 件 `FAIL`。

- [ ] **Step 2: Experience.astro を書く**

```astro
---
import { Picture } from 'astro:assets';
import { images } from '@/assets/images';
import { getCopy } from '@/i18n';

const lang = Astro.currentLocale === 'en' ? 'en' : 'ja';
const t = getCopy(lang);

// reverse = 画像を右に置く。RIZ / MARIAGE が右、SOUPE が左 (現行どおり)
const CARDS = [
  { key: 'riz', label: 'RIZ', reverse: true },
  { key: 'soupe', label: 'SOUPE', reverse: false },
  { key: 'mariage', label: 'MARIAGE', reverse: true },
] as const;
---

<section id="experience" class="experience section" aria-labelledby="experience-title">
  <div class="deco" aria-hidden="true">
    <span class="deco__dot deco__dot--1"></span>
    <span class="deco__dot deco__dot--2"></span>
    <span class="deco__dot deco__dot--3"></span>
  </div>

  <div class="cards container">
    {
      CARDS.map(({ key, label, reverse }, i) => (
        <div class:list={['card', reverse && 'card--reverse']}>
          <div class="card__media reveal">
            <div class="card__frame">
              <Picture
                src={images.experience[key].src}
                formats={['avif', 'webp']}
                widths={[800, 1600]}
                sizes="(min-width: 48rem) 40rem, 100vw"
                alt={images.experience[key].alt[lang]}
              />
            </div>
          </div>
          <div class="card__text reveal">
            <span class="label">{label}</span>
            <h2 id={i === 0 ? 'experience-title' : undefined} class="card__title">
              {t.experience[key].title}
            </h2>
            <p class="card__body">{t.experience[key].body}</p>
          </div>
        </div>
      ))
    }
  </div>
</section>

<style>
  .experience {
    position: relative;
  }

  .deco {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-card-gap);
  }

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-stack-lg);
  }

  .card__media,
  .card__text {
    width: 100%;
  }

  .card__frame {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .card__frame :global(picture) {
    display: contents;
  }

  .card__frame :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.9);
    transition: scale 2s;
  }

  .card__frame:hover :global(img) {
    scale: 1.05;
  }

  .card__frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--color-brand), transparent, transparent);
    opacity: 0.6;
    pointer-events: none;
  }

  .card__title {
    margin-bottom: var(--space-stack);
    font-size: var(--text-headline-mobile);
    line-height: var(--leading-headline);
    letter-spacing: var(--tracking-wide);
  }

  .card__body {
    margin-bottom: var(--space-stack);
    font-size: var(--text-body-mobile);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    white-space: pre-line;
  }

  @media (min-width: 48rem) {
    .deco {
      display: block;
      pointer-events: none;
    }

    .deco__dot {
      position: absolute;
      border-radius: var(--radius-full);
      filter: blur(1px);
    }

    .deco__dot--1 {
      top: 18%;
      left: 6%;
      width: 6px;
      height: 6px;
      background: color-mix(in srgb, var(--color-accent) 30%, transparent);
    }

    .deco__dot--2 {
      top: 48%;
      right: 5%;
      width: 4px;
      height: 4px;
      background: color-mix(in srgb, var(--color-dot-red) 25%, transparent);
    }

    .deco__dot--3 {
      bottom: 20%;
      left: 10%;
      width: 4px;
      height: 4px;
      background: color-mix(in srgb, var(--color-dot-blue) 25%, transparent);
    }

    .cards {
      gap: var(--space-card-gap-md);
    }

    .card {
      flex-direction: row;
    }

    .card--reverse {
      flex-direction: row-reverse;
    }

    .card__media,
    .card__text {
      width: 50%;
    }

    .card__text {
      padding-left: 40px;
    }

    .card--reverse .card__text {
      padding-right: 40px;
      padding-left: 0;
    }

    .card__title {
      font-size: var(--text-headline);
    }

    .card__body {
      font-size: var(--text-body);
    }
  }
</style>
```

- [ ] **Step 3: index.astro に置く**

import を足し、`<Philosophy />` の直後に `<Experience />` を追加する:

```astro
import Experience from '@/components/Experience.astro';
```

- [ ] **Step 4: ビルド**

```bash
npm run lint && npm run build
```

Expected: verify-dist が 22 件すべて通過。

- [ ] **Step 5: コミット**

```bash
git add src/components/Experience.astro src/pages/index.astro scripts/verify-dist.mjs
git commit -m "feat: Experience (RIZ / SOUPE / MARIAGE) を追加

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 8: Boutique・Access・Footer

**Files:**
- Create: `src/components/Boutique.astro`, `src/components/Access.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`、`scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `images.riceGift`、`getCopy().boutique` / `.access`、`SITE`、`Button`、`BrandDots`
- Produces: `#shop`、`#access`、`<footer>`。ページ全体の h2 は 8 つ (Philosophy 3 + Experience 3 + Boutique 1 + Access 1)

- [ ] **Step 1: 失敗する検査を足す**

```js
  ['#shop セクション', /<section[^>]*id="shop"/.test(html)],
  ['ONLINE SHOP は外部リンク属性つき', /<a[^>]*href="https:\/\/iyahiko\.square\.site\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/.test(html)],
  ['#access セクション', /<section[^>]*id="access"/.test(html)],
  ['地図 iframe に title と lazy', /<iframe[^>]*title="店舗の地図[^"]*"[^>]*loading="lazy"/.test(html)],
  ['<footer> に著作権表記', /<footer[^>]*>[\s\S]*All Rights Reserved\.[\s\S]*<\/footer>/.test(html)],
  ['h2 は 8 つ', count(/<h2\b/g) === 8],
```

```bash
npm run build
```

Expected: 6 件 `FAIL`。

- [ ] **Step 2: Boutique.astro を書く**

```astro
---
import { Picture } from 'astro:assets';
import Button from '@/components/Button.astro';
import { images } from '@/assets/images';
import { SITE } from '@/config';
import { getCopy } from '@/i18n';

const t = getCopy(Astro.currentLocale);
---

<section id="shop" class="boutique section" aria-labelledby="boutique-title">
  <div class="boutique__bg" aria-hidden="true">
    <Picture src={images.riceGift.src} formats={['avif', 'webp']} widths={[800, 1600, 2400]} sizes="100vw" alt="" />
    <div class="boutique__overlay"></div>
  </div>

  <div class="boutique__content container container--narrow reveal">
    <span class="label">BOUTIQUE</span>
    <h2 id="boutique-title" class="boutique__title">{t.boutique.title}</h2>
    <p class="boutique__body">{t.boutique.body}</p>
    <Button href={SITE.riceShopUrl} ariaLabel={t.boutique.ctaAriaLabel} variant="outline" size="md" external class="boutique__cta">
      ONLINE SHOP <span aria-hidden="true">↗</span>
    </Button>
  </div>
</section>

<style>
  .boutique {
    position: relative;
    overflow: hidden;
  }

  .boutique__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .boutique__bg :global(picture) {
    display: contents;
  }

  .boutique__bg :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.3);
  }

  .boutique__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      var(--color-brand),
      color-mix(in srgb, var(--color-brand) 40%, transparent),
      var(--color-brand)
    );
  }

  .boutique__content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .boutique__title {
    margin-bottom: var(--space-stack);
    font-size: var(--text-headline-mobile);
    line-height: var(--leading-headline);
    letter-spacing: var(--tracking-wide);
    white-space: pre-line;
  }

  .boutique__body {
    margin-bottom: var(--space-stack-lg);
    font-size: var(--text-body-mobile);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-soft);
    white-space: pre-line;
  }

  /* 現行の ONLINE SHOP は md ボタンより左右が広い (px-10 = 40px) */
  .boutique :global(.boutique__cta) {
    padding-inline: 40px;
  }

  @media (min-width: 48rem) {
    .boutique__title {
      font-size: var(--text-headline);
    }

    .boutique__body {
      font-size: var(--text-body);
    }
  }
</style>
```

- [ ] **Step 3: Access.astro を書く**

```astro
---
import BrandDots from '@/components/BrandDots.astro';
import Button from '@/components/Button.astro';
import { SITE } from '@/config';
import { getCopy } from '@/i18n';

const lang = Astro.currentLocale === 'en' ? 'en' : 'ja';
const t = getCopy(lang);
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed&hl=${lang}`;
---

<section id="access" class="access section" aria-labelledby="access-title">
  <div class="access__inner container">
    <div class="access__head reveal">
      <BrandDots size="sm" class="access__dots" />
      <h2 id="access-title" class="access__title">{SITE.name}</h2>
      <p class="label label--muted access__place">GINZA</p>
    </div>

    <div class="info reveal">
      <div class="info__col">
        <div>
          <p class="field__label">ADDRESS</p>
          <p class="field__value">{t.access.address}</p>
        </div>
        <div>
          <p class="field__label">TEL</p>
          <p class="field__value">
            <a href={SITE.phoneHref} class="tel">{SITE.phone}</a>
          </p>
        </div>
        <div>
          <p class="field__label">HOURS</p>
          <p class="field__value field__value--nums">
            {t.access.hoursMain}
            <br />
            <span class="field__note">{t.access.hoursClosed}</span>
          </p>
        </div>
      </div>
      <div class="info__col">
        <div>
          <p class="field__label">RESERVATION</p>
          <p class="field__value reservation__heading">{t.access.reservationHeading}</p>
          <p class="reservation__note">{t.access.reservationNote}</p>
        </div>
        <Button href={SITE.phoneHref} ariaLabel={`${t.common.reserveByPhone} (${SITE.phone})`} variant="filled" size="lg">
          RESERVATION
        </Button>
      </div>
    </div>

    <div class="map reveal">
      <iframe
        title={t.access.mapTitle}
        src={mapSrc}
        width="100%"
        height="100%"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>

<style>
  .access {
    position: relative;
    background: var(--color-brand-dark);
  }

  .access__inner {
    text-align: center;
  }

  .access__head {
    margin-bottom: var(--space-stack-lg);
  }

  .access :global(.access__dots) {
    margin: 0 auto var(--space-stack);
    opacity: 0.5;
  }

  .access__title {
    margin-bottom: 8px;
    font-size: var(--text-headline-mobile);
    line-height: var(--leading-headline);
    letter-spacing: var(--tracking-wide);
  }

  .access__place {
    margin-bottom: 0;
  }

  .info {
    display: grid;
    gap: var(--space-stack-lg);
    margin-bottom: var(--space-stack-xl);
    text-align: left;
  }

  .info__col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .field__label {
    margin-bottom: 4px;
    font-size: var(--text-label);
    line-height: var(--leading-label);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  .field__value {
    white-space: pre-line;
  }

  .field__value--nums,
  .tel {
    font-variant-numeric: tabular-nums;
  }

  .tel {
    transition: color var(--duration-hover);
  }

  .tel:hover {
    color: var(--color-accent);
  }

  .field__note {
    font-size: var(--text-label);
    line-height: var(--leading-label);
    color: var(--color-text-muted);
  }

  .reservation__heading {
    margin-bottom: 8px;
  }

  .reservation__note {
    font-size: var(--text-menu);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    white-space: pre-line;
  }

  .map {
    width: 100%;
    height: 256px;
  }

  @media (min-width: 48rem) {
    .access__title {
      font-size: var(--text-headline);
    }

    .info {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Footer.astro を書く**

```astro
---
import { SITE } from '@/config';

// 静的サイトなのでビルド時の年 (デプロイのたびに更新される)
const year = new Date().getFullYear();
---

<footer class="footer">&copy; {year} {SITE.name}. All Rights Reserved.</footer>

<style>
  .footer {
    padding: 32px 0;
    border-top: 1px solid var(--color-line-faint);
    font-size: var(--text-caption);
    line-height: var(--leading-caption);
    letter-spacing: var(--tracking-wide);
    font-variant-numeric: tabular-nums;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
```

- [ ] **Step 5: index.astro を完成させる**

`src/pages/index.astro` を上書き:

```astro
---
import { getImage } from 'astro:assets';
import Base from '@/layouts/Base.astro';
import Header from '@/components/Header.astro';
import Hero from '@/components/Hero.astro';
import Philosophy from '@/components/Philosophy.astro';
import Experience from '@/components/Experience.astro';
import Boutique from '@/components/Boutique.astro';
import Access from '@/components/Access.astro';
import Footer from '@/components/Footer.astro';
import { images } from '@/assets/images';

// Hero の <Picture> と同じ設定で AVIF の srcset を得て、<head> で preload する
const heroAvif = await getImage({ src: images.hero.src, format: 'avif', widths: [800, 1600, 2400] });
const heroPreload = { srcSet: heroAvif.srcSet.attribute, sizes: '100vw', type: 'image/avif' };
---

<Base lang="ja" preload={heroPreload}>
  <Header />
  <main id="main">
    <Hero />
    <Philosophy />
    <Experience />
    <Boutique />
    <Access />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 6: ビルド**

```bash
npm run lint && npm run build
```

Expected: verify-dist が 28 件すべて通過。

- [ ] **Step 7: コミット**

```bash
git add src/components/Boutique.astro src/components/Access.astro src/components/Footer.astro src/pages/index.astro scripts/verify-dist.mjs
git commit -m "feat: Boutique / Access / Footer を追加しページを完成

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 9: 見た目と性能の検証 (メインセッションで実施)

ブラウザ操作 (Playwright / Chrome DevTools の MCP) が必要なため、サブエージェントではなくメインセッションで行う。spec §13 の受け入れ基準を確かめ、差分があれば該当コンポーネントを直してコミットする。

**Files:**
- Modify: 差分が見つかったコンポーネント (必要なら)

- [ ] **Step 1: 現行サイトと Astro 版を並べて比較する**

```bash
npm run build && npm run preview
```

Playwright MCP で `https://atimot.github.io/najilaboule/` (現行) と `http://localhost:4173/najilaboule/` (Astro 版) を、390×844 と 1440×900 の 2 サイズで全画面スクリーンショットを撮り、Header / Hero / Philosophy / Experience / Boutique / Access / Footer の順に見比べる。spec §14 の 12 項目以外の差 (サイズ・余白・色・字間・行間・写真の減光) を全て書き出し、CSS を直す。スクリーンショットはコミットしない。

- [ ] **Step 2: 動きを確認する**

Chrome で: 読み込み直後に写真 → ドット → 見出し → タグライン → ヘッダーの順に現れる (約 2.8s)。スクロールで Experience / Boutique / Access が浮き上がる。Philosophy で写真が幕に合わせて切り替わる。Experience の写真ホバーで 2s のズーム。
DevTools の Rendering で `prefers-reduced-motion: reduce` をエミュレート: 全ての動きが止まり、Hero は即時表示、Philosophy は写真 1 固定。
Firefox で: Experience 以降が常時表示、Philosophy は写真 1 固定で 3 幕が読める。

- [ ] **Step 3: ネットワークと Lighthouse**

Chrome DevTools MCP の `list_network_requests` で: `fonts.googleapis.com` / `fonts.gstatic.com` への要求がない、Shippori の woff2 が数ファイル (glyphs が効いていれば 2 つ) だけ取得される、Hero の AVIF が最初に取得される。
`lighthouse_audit` をモバイル設定で現行と Astro 版の両方に実行し、Performance / Accessibility / SEO を記録する。目安: Performance ≥ 95、Accessibility 100、SEO 100、LCP < 2.5s。現行を下回る項目があれば原因を直す。

- [ ] **Step 4: 転送量を記録する**

```bash
du -sh dist/_astro/fonts
ls -la dist/_astro/*.css
grep -c '<script' dist/index.html
```

Expected: `<script` は 1 (JSON-LD のみ)。結果を Task 10 の PR 本文に載せる。

- [ ] **Step 5: 修正があればコミット**

```bash
git add -A
git commit -m "fix: 現行との目視比較で見つかった差分を修正

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

---

### Task 10: ドキュメント更新と PR

**Files:**
- Modify: `CLAUDE.md`, `README.md`, `DESIGN.md`
- Move: `docs/design/lp-blueprint.md` → `docs/archive/lp-blueprint-react.md`

- [ ] **Step 1: CLAUDE.md を書き換える**

`CLAUDE.md` の「CI とデプロイ」節より前を次の内容で置き換える (「CI とデプロイ」節は現行のまま残す):

````markdown
# Naji la boule (LP)

銀座の和食店「Naji la boule」の公式ランディングページ。Astro 7 + 素の CSS + TypeScript。配信 JS ゼロ。

## コマンド

```bash
npm run dev          # dev サーバー起動 (http://localhost:4321/najilaboule/ — base パスに注意)
npm run build        # astro build → scripts/verify-dist.mjs (dist/index.html の不変条件チェック)。完了報告前に必ず通すこと
npm run lint         # astro check (型チェック)
npm run lint:design  # DESIGN.md を Google design.md CLI で検証 (エラー 0 を維持)
npm run preview      # build 成果物をローカル配信 (http://localhost:4173/najilaboule/)
```

`.astro` / `.ts` / `.css` を編集したら `npm run lint` と `npm run build` を自分で実行して検証する。エラーはその場で直してから先に進む。

## 構造

```
astro.config.ts        site / base / fonts (Astro Fonts API、自前ホスト)
src/
├── pages/index.astro  日本語ページ。Base に各セクションを並べ、Hero の preload を渡す
├── layouts/Base.astro <head> 一式 (meta / OGP / JSON-LD / フォント / preload)、skip link
├── components/        Header / Hero / Philosophy / Experience / Boutique / Access / Footer / Button / BrandDots
├── content/ja.ts      文言 (型 Copy)。英語版は en.ts を追加
├── i18n/              Lang / Copy 型、getCopy(lang)、SUPPORTED_LANGS
├── assets/images/     元画像 (JPEG)。<Picture> が AVIF/WebP をビルド時生成
├── assets/images.ts   画像の import と alt (ja/en)
├── config.ts          SITE (店名・電話・URL・地図) と JSON-LD
└── styles/
    ├── tokens.css     DESIGN.md フロントマターを :root 変数に写したもの
    └── global.css     リセット、body 背景 3 層、focus ring、.container/.section/.label/.reveal、共通 keyframes、reduced-motion
scripts/verify-dist.mjs  ビルド成果物の不変条件 (配信 JS ゼロ、外部フォントなし、h1 が 1 つ、preload 等)
```

## ルール

- **配信 JS を増やさない**。動きは CSS (keyframes / scroll-driven animations) で書き、`@supports` と `prefers-reduced-motion` で段階的に落とす
- **文言のハードコード禁止**。表示文字列は `src/content/ja.ts` に置き、`getCopy()` 経由で参照する。例外: 欧文の装飾ラベル (RIZ / SOUPE / MARIAGE / BOUTIQUE / GINZA / ADDRESS / TEL / HOURS / RESERVATION / ONLINE SHOP) と画像 alt (`src/assets/images.ts` に ja/en 併記)
- **英語版の継ぎ目を壊さない**。`Copy` 型・`getCopy(lang)`・`Base` の `lang` prop・alt の ja/en 併記を維持する。英語版を足すときは `content/en.ts`、`pages/en/index.astro`、`astro.config.ts` の `i18n`、`SUPPORTED_LANGS` を追加する
- ブレークポイントは 768px (`48rem`) の 1 本だけ
- `dist/` と `package-lock.json` は直接編集しない
- Performance / Accessibility / SEO のスコアを下げる回帰を出さない (`verify-dist.mjs` が最低限を守る)

## デザイン決め事 (重要)

- [`DESIGN.md`](./DESIGN.md) — **デザインシステムの正**。Google Labs の DESIGN.md オープン仕様に従う。トークン値はフロントマターが normative。姉妹の Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`、Dawn ベースの素の CSS) もこのファイルの値を手で移して世界観を揃える
- 色・フォント・余白を変えるときは **DESIGN.md のフロントマターと `src/styles/tokens.css` を同じ値に揃える**
- DESIGN.md を編集したら `npm run lint:design` を通す。warning のうち `orphaned-tokens` と `button-filled` の `contrast-ratio` (半透明背景の誤検知) は許容
- 動きの決め事は DESIGN.md の Components / Motion Grammar。新しい動きを足すときはそこに追記する
- 再構築の経緯と受け入れ基準は `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md`。旧 React 版の記録は `docs/archive/lp-blueprint-react.md`

````

- [ ] **Step 2: README.md を書き換える**

````markdown
# Naji la boule (LP)

銀座の和食店「Naji la boule (ナジラブール)」の公式ランディングページ。

**公開 URL**: https://atimot.github.io/najilaboule/

Astro 7 + 素の CSS + TypeScript。配信 JS ゼロ、フォントと画像はビルド時に最適化。日本語ページのみ (英語版は `src/content/en.ts` と `src/pages/en/` を足して対応する構造)。

## 開発

```bash
npm ci           # 依存のインストール (lockfile どおり)
npm run dev      # dev サーバー (http://localhost:4321/najilaboule/ — base パスに注意)
npm run build    # ビルド + dist の不変条件チェック
npm run lint     # astro check
npm run preview  # ビルド成果物のローカル配信 (http://localhost:4173/najilaboule/)
```

## デプロイ

main ブランチへのマージで GitHub Actions (`.github/workflows/deploy.yml`) が GitHub Pages へ自動デプロイする。PR には CI (lint / build) が走る。

開発の決め事は [CLAUDE.md](./CLAUDE.md)、デザインシステム (Google Labs の DESIGN.md 仕様準拠) は [DESIGN.md](./DESIGN.md) を参照。
````

- [ ] **Step 3: DESIGN.md の Components / Motion Grammar / Do's and Don'ts を更新する**

`DESIGN.md` の本文で次を変更する (フロントマターは変えない):

1. 冒頭の HTML コメントで、`src/index.css` の @theme` を `src/styles/tokens.css` に、`export --format css-tailwind DESIGN.md` で照合できる` の行を `export --format dtcg DESIGN.md で値を照合できる` に、`docs/design/lp-blueprint.md (Astro 移植用の一時文書)` を `docs/archive/lp-blueprint-react.md (旧 React 版の記録)` に置き換える。`@theme 側にだけある --font-serif` の行は削除する
2. `### Language Switch` の小節を削除し、`### Header & Navigation` を次に置き換える:

```markdown
### Header & Navigation
- **Desktop:** 左に店名 (`brand`) とカナ表記、右に `Access` リンク (`nav-link`、ホバーで `accent` へ 300ms) と sm の Outline ボタン。ヘッダーは開演の最後 (遅延 1.8s) に 1 秒でフェードイン
- **Mobile:** `Access` リンクを省き、右上に sm の Outline ボタンだけを置く。ハンバーガーメニューは持たない (Access セクションへはスクロールで届く)
- **Language Switch:** 英語版を追加するまで非表示。追加時は `JP | EN` の静的リンク (0.75rem、字間 0.1em、アクティブは `accent` + 700 + 1px 下線) をナビの右に置く
```

3. `### Photo Treatment` の `Philosophy` 行を次に置き換える:

```markdown
- **Philosophy:** 25% に減光。デスクトップでは左の写真が留まり (sticky、高さ 700px)、右の 3 幕を読み進めると次の写真へクロスフェードする (CSS scroll-driven)。モバイルは 3 幕を縦積みし、各幕の背面に敷く。非対応ブラウザと reduced-motion では写真 1 枚に固定
```

4. `### Slide Indicator` と `### Loader` の小節を削除する
5. `### Motion Grammar` を次に置き換える:

```markdown
### Motion Grammar
- **開演 (ページ表示時):** 写真が 0.15 → 0.5 に 1.8s で明るくなり、9 つのドットが 0.3s から 0.1s 刻みで灯り、見出し (遅延 0.8s、y +10px、1.5s) → タグライン (1.3s、1.5s) → ヘッダー (1.8s、1s) の順に現れる。合計約 2.8s、ブロッキングしない
- **スクロール時の浮き上がり:** `animation-timeline: view()` で、要素が視界に入る区間 (entry 0% → 40%) に不透明度 0 → 1、y +30px → 0。`@supports` で段階適用し、非対応では常時表示
- **ホバー:** 色は 300ms、ボタンの反転は 500ms、写真の拡大は 2 秒。いずれも ease-out
- **イージング:** ease-out / ease-in-out のみ。スプリング、バウンス、オーバーシュートは使わない
- **Reduced motion:** 全 animation / transition を無効化し、`scroll-behavior: auto` を強制。即時表示にする
- **JS を使わない:** 動きは CSS だけで書く。JS でしか作れない動きは採用しない
```

6. `### Do:` の末尾に `- **Do** 動きは CSS だけで書き、`@supports` と reduced-motion で段階的に落とす` を追加し、`### Don't:` の末尾に `- **Don't** 配信 JS を増やさない。アニメーションライブラリも入れない` を追加する

```bash
npm run lint:design
```

Expected: エラー 0。

- [ ] **Step 4: blueprint を退役させる**

```bash
mkdir -p docs/archive
git mv docs/design/lp-blueprint.md docs/archive/lp-blueprint-react.md
```

`docs/archive/lp-blueprint-react.md` のタイトル行の直後に次を挿入する:

```markdown
> **退役済み (2026-09-10)**: 旧 React 版 (コミット 76ac9d2) の記録。Astro 版は `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md` の §13 / §14 で照合済み。現行の決め事は `DESIGN.md` を参照。
```

- [ ] **Step 5: 最終確認とコミット**

```bash
npm run lint && npm run build && npm run lint:design && npm run check:lockfile
git add -A
git commit -m "docs: Astro 版に合わせて CLAUDE.md / README / DESIGN.md を更新し、React 版 blueprint を退役

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR"
```

- [ ] **Step 6: PR を作る**

PR 本文を `/tmp` ではなくスクラッチ用ディレクトリ (無ければカレントの `.pr-body.md`、コミットしない) に書いてから `gh pr create --body-file` で送る。本文は次のとおり (Task 9 の結果で `__` を埋める):

```markdown
## 概要

spec `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md` に基づき、React 19 + Tailwind + motion の LP を Astro 7 + 素の CSS で作り直しました。見た目と内容は現行を踏襲し、動きは CSS だけの代替案に置き換えています。日本語ページのみ (英語版は継ぎ目のみ)。

## 主な変更

- 配信 JS ゼロ (JSON-LD のみ)。ランタイム依存なし、devDependencies は astro / @astrojs/check / typescript
- フォントは Astro Fonts API で自前ホスト (Google Fonts への外部接続なし)
- 画像は `<Picture>` で AVIF / WebP をビルド時生成、Hero は priority + preload
- 動き: ローダー → Hero の「開演」、自動スライダー → 3 幕の scrollytelling、スクロール浮き上がりは CSS view timeline
- `scripts/verify-dist.mjs` が build の最後に dist の不変条件を検査

## 現行との意図的な差分

spec §14 の 12 項目 (ローダー・言語スイッチ・ハンバーガー・自動スライダーの廃止、Hero スケールの修正、`?lang=en` は日本語表示、など)。

## 検証

- [ ] 390px / 1440px で現行と並列比較 (Task 9)
- [ ] Lighthouse: Performance __ / Accessibility __ / SEO __ (現行: __ / __ / __)
- [ ] `npm run lint` / `npm run build` / `npm run lint:design` / `npm run check:lockfile` すべて通過
- [ ] Firefox と reduced-motion で静的フォールバックを確認

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01M2Dr7VB8qUbSWqsEEBYZAR
```

```bash
git push -u origin claude/astro-rebuild
gh pr create --title "feat: Astro 7 + 素の CSS で LP をゼロから再構築 (配信 JS ゼロ)" --body-file .pr-body.md
rm .pr-body.md
gh pr checks --watch
```

CI (build / lint) が緑になったことを確認してから、ユーザーにマージ可否を報告する。
