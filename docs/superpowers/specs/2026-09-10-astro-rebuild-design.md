# Naji la boule LP — Astro によるゼロからの再構築 設計

日付: 2026-09-10
状態: ユーザーレビュー待ち
前提の記録: [Projects/najilaboule-lp](obsidian://open?vault=obsidian&file=Projects%2Fnajilaboule-lp) (Obsidian)、`docs/design/lp-blueprint.md` (現行 React 版の照合仕様)、`DESIGN.md` (デザインシステム)

## 1. 目的

現行の React 19 + Vite + Tailwind v4 + motion 製 LP (JS 約 105KB gzip) を、**2026 年に Web で LP を作る最適解**の基準でゼロから作り直す。既存コードの移植ではなく、見た目と内容だけを踏襲した再設計。

## 2. 要件と非要件

**要件**
- 現行の見た目 (色・書体・余白・写真の扱い・セクション構成) と内容 (文言・画像・連絡先・構造化データ) を踏襲する
- いずれ日本語 / 英語を切り替えられる構造にする。ただし今回は日本語ページのみ実装する
- アニメーションや複雑な動きは再現しなくてよい。代わりに「センスある代替案」を採用する
- 依存を増やさず、シンプルで小さく保つ
- GitHub Pages (`https://atimot.github.io/najilaboule/`) へのデプロイと既存の CI 運用を維持する

**非要件**
- 英語ページの実装 (継ぎ目だけ用意する)
- 現行のローダー・自動スライダー・ハンバーガーメニュー・言語スイッチの再現
- 新しいコンテンツやセクションの追加
- Shopify テーマ側の変更

## 3. 調査で確認した「最適解」の要素

| 要素 | 根拠 |
|---|---|
| 静的 HTML、配信 JS ゼロ | Core Web Vitals (LCP 2.5s / INP 200ms / CLS 0.1) の合格線に対し、INP を落とす主因が JS。Astro が LP 用途の第一選択 ([CWV 2026](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)、[SSG 比較](https://talos.tools/blog/best-static-site-generators-2026)) |
| 画像はビルド時に AVIF/WebP、LCP 画像は `priority` + preload | Astro `<Picture>` の標準機能 |
| フォントは自前ホスト + サブセット | Astro Fonts API が Google Fonts の日本語 unicode-range スライスをローカルにコピーする。使用文字が確定していれば `glyphs` でさらに縮小可 ([参考](https://sushichan044.hateblo.jp/entry/2025/09/05/180028)、[最適化](https://vgarmes.github.io/writing/astro-fonts-api-optimization/)) |
| 動きは CSS scroll-driven animations | Chrome/Edge 115、Safari 26、Samsung 23、Firefox 158 から対応。世界 87% ([caniuse](https://caniuse.com/mdn-css_properties_animation-timeline))。`@supports` で段階的に適用し、非対応では静的表示 |
| `prefers-reduced-motion` と CLS 抑制 | 全アニメーションを無効化できること、フォントの size-adjust フォールバック |

## 4. アーキテクチャ

### 4.1 スタック

| 項目 | 選定 | 理由 |
|---|---|---|
| フレームワーク | **Astro 7.3** (Node ≥ 22.12、Vite 8) | 静的出力、JS ゼロ、画像とフォントの最適化が同梱 |
| 言語 | TypeScript | 文言・画像メタデータの型付け。`astro check` 用に `typescript@^6` (`@astrojs/check` が TS 7 未対応のため) |
| CSS | **素の CSS + カスタムプロパティ** (Astro の scoped `<style>`) | 依存ゼロ。姉妹の Shopify テーマ (Dawn、素の CSS) と同じ書き方。DESIGN.md のトークンをそのまま `:root` に写せる |
| 画像 | Astro `<Picture>` (同梱の sharp) | 元 JPEG から AVIF/WebP をビルド時生成 |
| フォント | Astro Fonts API (`fontProviders.google()`) | 自前ホスト、サブセット、preload、最適化フォールバック |
| ホスティング | GitHub Pages、`base: '/najilaboule'` | 現状維持 |
| ランタイム依存 | **なし** | |
| devDependencies | `astro`、`@astrojs/check`、`typescript@^6` | |

Tailwind を使わない判断について: 2026-09-10 の前半で「移植時は Tailwind 継続」と決めたが、これは既存クラス文字列を 1:1 で移すための判断だった。ゼロから作る前提では、依存ゼロで Shopify と書き方が揃う素の CSS を採る。

### 4.2 ディレクトリ

```
astro.config.mjs            site / base / fonts / compressHTML / (将来 i18n)
public/                     favicon 一式、site.webmanifest、robots.txt、sitemap.xml、images/ogp.jpg
src/
├── styles/
│   ├── tokens.css          DESIGN.md フロントマターを :root 変数に (色・書体・サイズ・字間・余白・角丸)
│   └── global.css          リセット、body 背景 3 層、focus ring、reduced-motion、共通 keyframes、.container / .section / .label / .reveal
├── content/
│   └── ja.ts               文言 (型 Copy)。英語版は en.ts を追加
├── i18n/
│   └── index.ts            type Lang = 'ja' | 'en'、getCopy(lang) (今は ja を返すだけ)、SUPPORTED_LANGS
├── assets/
│   ├── images/             hero/background.jpg、philosophy/slide-01..03.jpg、menu/item-01..03.jpg (2752×1536 の元データ。assets/images-original/ から移動)
│   └── images.ts           各画像の import と alt ({ ja, en })
├── config.ts               SITE (店名・電話・URL・ショップ URL・住所) と JSON-LD の元データ
├── layouts/
│   └── Base.astro          <html lang> / <head> 一式 / skip link / <slot />
├── components/
│   ├── Header.astro        固定ヘッダー (店名 + カナ / Access リンク (md 以上) / RESERVATION ボタン)
│   ├── Hero.astro
│   ├── Philosophy.astro    3 幕の scrollytelling
│   ├── Experience.astro    RIZ / SOUPE / MARIAGE のカード ×3
│   ├── Boutique.astro
│   ├── Access.astro
│   ├── Footer.astro
│   ├── BrandDots.astro     size: 'sm' | 'md' | 'lg'、animated
│   ├── Button.astro        variant: 'outline' | 'filled'、size: 'sm' | 'md' | 'lg'
│   └── SectionLabel.astro  RIZ / BOUTIQUE / GINZA などの仏語・英語小ラベル
└── pages/
    └── index.astro         ja ページ。<Base lang="ja"> に各セクションを並べる
```

削除するもの: `src/` の React 一式、`index.html`、`vite.config.ts`、`eslint.config.js`、`tsconfig.app.json` / `tsconfig.node.json`、`public/images/*.webp` (ビルド時生成に置き換え)。`assets/images-original/` は `src/assets/images/` へ移動。

### 4.3 astro.config.mjs (骨子)

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://atimot.github.io',
  base: '/najilaboule',
  compressHTML: true,            // v7 既定の 'jsx' はインライン要素間の空白を落とすため旧既定に戻す
  fonts: [
    { name: 'Playfair Display', cssVariable: '--font-playfair', provider: fontProviders.google(),
      weights: [400, 700], styles: ['normal'], subsets: ['latin'], fallbacks: [] },
    { name: 'Shippori Mincho', cssVariable: '--font-shippori', provider: fontProviders.google(),
      weights: [400, 700], styles: ['normal'], subsets: ['japanese'], fallbacks: ['serif'] },
  ],
  // 英語版追加時: i18n: { defaultLocale: 'ja', locales: ['ja', 'en'], routing: { prefixDefaultLocale: false } }
});
```

## 5. デザイントークンと CSS 方針

- `tokens.css` は **DESIGN.md のフロントマターが正**。色 21、書体 (Playfair / Shippori の変数を束ねた `--font-serif`)、タイポ役割 9 (サイズ・行間・字間)、余白 11、角丸 3 を `:root` に写す。値を変えるときは DESIGN.md → tokens.css の順で揃え、`npm run lint:design` を通す
- `global.css` は現行 `src/index.css` の `@layer base` 相当 (リセット、body の 3 層背景、`font-feature-settings: "palt"`、focus ring、スクロールバー) と、reduced-motion、共通 keyframes、少数のユーティリティ (`.container` 80rem / `.container--narrow` 48rem、`.section` の余白、`.label`、`.reveal`)
- 各コンポーネントの見た目は `.astro` 内の scoped `<style>` に書く。値は `docs/design/lp-blueprint.md` の Tailwind クラスを CSS に翻訳する (§1.4 の既定値表を参照)。クラス名は要素の役割で付ける (`hero__title` のような BEM 風)
- ブレークポイントは **768px の 1 本** (`@media (min-width: 48rem)`)
- モバイルファーストで書き、`md` 以上を上書きする

## 6. ページ構成とコンポーネント

DOM 順: skip link → `<header>` → `<main>` (Hero `#top` → Philosophy `#philosophy` → Experience `#experience` → Boutique `#shop` → Access `#access`) → `<footer>`。各 `<section>` は `aria-labelledby` で h2 を指す (Hero は h1)。

| コンポーネント | 内容と見た目 (blueprint の対応節) | 変更点 |
|---|---|---|
| Header | 固定・上端・`brand` 90% → 透明のグラデーション + 2px ぼかし。左に店名 (1.25 / 1.5rem、字間 0.1em) とカナ。右に Access リンク (md 以上のみ) と RESERVATION outline sm (blueprint §5.1) | ハンバーガーと言語スイッチを廃止。モバイルでも RESERVATION を直置き |
| Hero | 100vh、背景写真 (50% + grayscale + slow-zoom)、上下グラデーション、ドット md、h1、タグライン (§6) | 二重スケールを解消し 1.1 → 1.2 の単一スケールに。「開演」演出 (§7.1) |
| Philosophy | 3 幕の scrollytelling (§7.3)。文言は `philoSlides` の 3 組 | 自動スライダーとインジケータを廃止 |
| Experience | 画像 16:9 + 文章の 2 カラム、左右交互 (§8) | 変更なし |
| Boutique | 背景写真 30% + 上下グラデーション、48rem の文章、ONLINE SHOP ボタン (§9) | 変更なし |
| Access | `brand-dark` 背景、ドット sm、2 列グリッド、RESERVATION filled lg、地図 iframe (§10) | 変更なし |
| Footer | 10px、罫線 5% (§11) | 変更なし |
| BrandDots | 3×3、9 色、グロー (§3.1) | animated は Hero の開演でのみ使用 |
| Button | outline / filled × sm / md / lg (§3.2) | 変更なし |

文言は現行 `src/i18n/data.ts` の ja を `content/ja.ts` に移す。不要になるキー (`menu_label`、`aria_menu_open/close`、`aria_loading`、`aria_slide_show`) は落とし、セクション単位のオブジェクトに整理する。画像 alt は ja / en 併記のまま。

## 7. モーション設計 (全て CSS、JS ゼロ)

### 7.1 Hero の「開演」 (ローダーの代替)

ページ表示と同時に、暗闇に灯りが点くように要素が順に現れる。ブロッキングしない。

| 要素 | プロパティ | duration | delay | easing |
|---|---|---|---|---|
| 背景写真 | opacity 0.15 → 0.5 (LCP を遅らせないため 0 から始めない) | 1.8s | 0 | ease-out |
| ドット ×9 | opacity 0 → 1、scale 0 → 1 | 0.5s | 0.3s + i × 0.1s | ease-out |
| h1 | opacity 0 → 1、translateY 10px → 0 | 1.5s | 0.8s | ease-out |
| タグライン | opacity 0 → 1 | 1.5s | 1.3s | ease-out |
| ヘッダー | opacity 0 → 1 | 1s | 1.8s | ease-out |

`animation-fill-mode: both`。合計約 2.8s で、現行 (ローダー 2.5s + 退場 1s + Hero フェード) より短い。

### 7.2 スクロール時の浮き上がり (reveal)

```css
.reveal { /* 既定は表示 (非対応ブラウザ・no-JS・reduced-motion の安全側) */ }
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}
@keyframes reveal-rise { from { opacity: 0; translate: 0 30px; } to { opacity: 1; translate: 0; } }
```

対象: Experience の各カード (画像・文章)、Boutique の文章ブロック、Access の 3 ブロック。スクロール位置に連動するため戻すと消える (JS の once とは違う挙動、意図的)。

### 7.3 Philosophy の 3 幕 (自動スライダーの代替)

**デスクトップ (≥ 768px)**: 2 カラム。左 55% に高さ 700px の figure を `position: sticky; top: calc((100vh - 700px) / 2)` で留め、3 枚の写真を重ねる (25% 減光)。右 45% に 3 幕の文 (h2 + 本文) を縦に並べ、各幕は `min-height: 70vh` で中央揃え。各幕に `view-timeline-name: --act-N` を付け、section に `timeline-scope: --act-1, --act-2, --act-3`。写真 2・3 は対応する幕の `animation-timeline` で `entry 0% → cover 30%` の間に opacity 0 → 1 (`fill-mode: both`)。写真 1 は常時表示。スクロールを戻せば逆再生される。

**モバイル (< 768px)**: 3 幕を縦積み。各幕は `min-height: 80vh` で、背景に対応する写真を 25% 減光 + 上下 `brand` 85% のグラデーションで敷き、文は中央揃え (現行モバイルの見た目を幕ごとに再現)。

**非対応ブラウザ (Firefox 158 未満)**: `@supports not` で写真 1 だけを表示し、3 幕の文はそのまま読める。**reduced-motion**: 同じく写真 1 固定。

### 7.4 その他

- Hero 背景の slow-zoom: `scale 1.1 → 1.2`、20s、infinite alternate (単一スケール)
- ホバー: リンク色 300ms、ボタン反転 500ms、Experience 写真 1.05 倍 2s (現行どおり)
- 店名クリック: `href="#top"` と `html { scroll-behavior: smooth }`
- reduced-motion: `animation: none !important; transition: none !important; scroll-behavior: auto !important` を全要素に。Hero は即時表示、Philosophy は写真 1 固定、reveal は常時表示

## 8. 画像

- 元データ `src/assets/images/**` (2752×1536 JPEG、各 2〜3MB) から `<Picture formats={['avif','webp']} widths={[800, 1600, 2400]} sizes=...>` でビルド時生成。品質は現行 WebP (q78) と同等に見えるよう `quality` を調整
- `sizes`: Hero と Boutique `100vw`、Philosophy `(min-width: 48rem) 44rem, 100vw`、Experience `(min-width: 48rem) 40rem, 100vw`
- Hero は `priority` (eager / sync / fetchpriority high) + `<head>` の `<link rel="preload" as="image" type="image/avif" imagesrcset imagesizes>` (`getImage()` で URL を得る)。他は `loading="lazy"`
- 装飾画像 (Hero / Boutique 背景) は `alt=""`、内容画像は ja / en の alt
- OGP は `public/images/ogp.jpg` (1200×630 JPEG) をそのまま

## 9. フォント

- Playfair Display 400 / 700 (latin)、Shippori Mincho 400 / 700 (japanese) を Fonts API の Google provider で自前ホスト。外部接続 (fonts.googleapis.com / gstatic) をゼロにする
- `--font-serif: var(--font-playfair), var(--font-shippori), serif` を tokens.css で束ね、body に適用。Playfair は `fallbacks: []` にして、生成される変数に generic `serif` が入り和文が Shippori に届かなくなるのを防ぐ (実装時に `@font-face` 出力を確認)
- `<Font cssVariable="--font-playfair" preload />`。Shippori は preload しない (スライスが多く、必要分だけ遅延取得させる)
- 可能なら Shippori に `glyphs` (ページで使う文字集合) を指定して使用文字だけに絞る。文字集合は `content/ja.ts` の全文字列から算出する。Astro 7 で experimental のままなら見送り、unicode-range スライスに任せる
- `font-display: swap` (既定)、Shippori の最適化フォールバック (size-adjust) で CLS を抑える

## 10. 日英切替の継ぎ目

今回実装するのは以下だけで、条件分岐は入れない。

- `content/ja.ts` は `Copy` 型を満たす。`en.ts` は同じ型を実装する
- `i18n/index.ts`: `type Lang`、`getCopy(lang: Lang): Copy` (今は `ja` を返す)、`SUPPORTED_LANGS = ['ja'] as const`
- `Base.astro` は `lang` を受け取り `<html lang>`、`og:locale`、description、canonical を組み立てる。hreflang は `SUPPORTED_LANGS` が 2 つ以上のときだけ出力する
- 各セクションは `Astro.currentLocale ?? 'ja'` → `getCopy()` で文言を得る
- 画像 alt は `{ ja, en }` 併記

英語版を足すときの作業: `content/en.ts`、`pages/en/index.astro`、`astro.config.mjs` の `i18n`、`SUPPORTED_LANGS` に `'en'`、言語スイッチ (静的リンク) を Header に追加、`sitemap.xml` に `/en/`。

## 11. head / SEO / a11y

- `<html lang="ja" class="dark" style="color-scheme: dark">`、`theme-color #241816`、viewport
- title `Naji la boule | Ginza`、description (ja.ts)、canonical、OGP (ja_JP、`images/ogp.jpg`)、`twitter:card`、JSON-LD `Restaurant` (現行 index.html の内容を `config.ts` から生成)
- favicon 一式と `site.webmanifest` は現状維持
- `public/sitemap.xml` は 1 URL、`robots.txt` は現状維持
- skip link (「本文へ」)、ランドマーク、h1 は 1 つ、`section[aria-labelledby]`、`a:focus-visible` / `button:focus-visible` のリング、外部リンクの `rel="noopener noreferrer"` と aria-label、`tel:` リンクの aria-label、iframe title
- noscript 文言は不要 (JS がないため)

## 12. ビルド・CI・デプロイ

- `package.json` scripts: `dev: astro dev --host`、`build: astro build`、`preview: astro preview`、`lint: astro check`、`lint:design` と `check:lockfile` は据え置き
- lockfile は `npx -y npm@latest install` で再生成。`scripts/check-lockfile.mjs` の対象 (`@emnapi/*`) が新しい依存構成 (sharp の wasm 変種) でも存在するか確認し、必要なら対象を見直す
- `.github/workflows/ci.yml` と `deploy.yml` は変更しない (lint の中身が `astro check` になり、出力は `dist/`)
- `.gitignore` に `.astro/` を追加

## 13. 検証と受け入れ基準

1. **見た目**: 390px と 1440px で、現行の公開サイトと Astro 版を Playwright (MCP) で同じセクションを撮って並べ、§14 の意図的差分以外に差がないことを確認する (画像はコミットしない)
2. **JS ゼロ**: `dist/` の HTML に `<script>` が含まれない
3. **フォント**: `fonts.googleapis.com` / `fonts.gstatic.com` への要求がない。Shippori のスライスが必要分だけ取得される
4. **画像**: AVIF が配信される。Hero の LCP がモバイル相当のスロットリングで 2.5s 未満
5. **Lighthouse**: Performance / Accessibility / SEO を現行と比較し、同等以上 (目安: Performance ≥ 95、他は 100)
6. **動き**: Chrome と Safari で §7 の挙動、Firefox で静的フォールバック、reduced-motion で動きゼロ
7. **品質ゲート**: `npm run lint` (astro check) と `npm run build` がエラー 0、`npm run lint:design` がエラー 0、`npm run check:lockfile` が通る、CI が緑

## 14. 現行との意図的な差分

| # | 項目 | 現行 | Astro 版 |
|---|---|---|---|
| 1 | ローダー | 2.5s の全画面ローダー | 廃止。Hero の「開演」 (§7.1) |
| 2 | 言語スイッチ | JP / EN | 英語版実装まで非表示 |
| 3 | モバイルメニュー | ハンバーガー + 全画面メニュー | 廃止。RESERVATION をヘッダーに直置き、Access リンクはモバイル非表示 |
| 4 | Philosophy | 7s 自動クロスフェード + インジケータ | scroll-driven の 3 幕 (§7.3)。モバイルは 3 幕縦積み |
| 5 | スクロール時の浮き上がり | JS で一度だけ | CSS view timeline (戻すと消える)。Firefox は常時表示 |
| 6 | Hero 背景スケール | 1.21 → 1.32 (二重掛け) | 1.1 → 1.2 |
| 7 | reduced-motion | 0.3s 遅延 / 0.5s フェード | 動きゼロ (即時表示) |
| 8 | `?lang=en` | 英語表示 | 日本語表示 (英語版実装時に `/en/` へ) |
| 9 | 店名クリック | JS スムーススクロール、URL 不変 | CSS `scroll-behavior`、URL に `#top` |
| 10 | 画像 | 事前生成 WebP | ビルド時生成 AVIF / WebP |
| 11 | フォント | Google Fonts CDN | 自前ホスト |
| 12 | CSS | Tailwind クラス | 素の CSS (見た目の差は出さない) |

## 15. ドキュメントの更新

- `CLAUDE.md`: スタック・コマンド・構造・ルール (`useLanguage` / `usePrefersReducedMotion` への言及を削除、tokens.css と DESIGN.md の同期ルールに変更)
- `README.md`: スタックと構造
- `DESIGN.md`: Components から Language Switch / Loader / モバイルメニューを外し、Photo Treatment と Motion Grammar を §7 の内容に更新。Do's and Don'ts に「配信 JS を増やさない」「動きは CSS で」を追加
- `docs/design/lp-blueprint.md`: 冒頭に「React 版 (76ac9d2) の記録。Astro 版の照合は本 spec §13 と §14 で行う」と注記し、検証完了後に `docs/archive/` へ移す

## 16. リスクと未確定事項

| 項目 | 対応 |
|---|---|
| Fonts API の最適化フォールバックが Playfair の変数に generic `serif` を混ぜ、和文が Shippori に届かない | `fallbacks: []` (必要なら `optimizedFallbacks: false`) にして `@font-face` 出力を確認 |
| `glyphs` オプションが Astro 7 で experimental のまま | 見送り、unicode-range スライスに任せる |
| scroll-driven animations が Firefox 158 未満で非対応 | `@supports` の静的フォールバック (§7.2 / §7.3) |
| Astro 7 の `compressHTML: 'jsx'` がインライン要素間の空白を落とす | `compressHTML: true` |
| `@astrojs/check` が TypeScript 7 に未対応 | `typescript@^6` を固定 |
| `check-lockfile.mjs` の前提 (`@emnapi/*`) が変わる | 新 lockfile で確認し、必要なら対象パッケージを更新 |
| Rust コンパイラが未閉じタグを拒否 | 全タグを閉じる (問題なし) |
| Philosophy 3 幕の高さとリズム | 実装時に 60〜80vh の範囲で目視調整 |
| `<Picture priority>` と手動 preload の二重出力 | ビルド HTML を確認し、重複していれば片方に寄せる |
