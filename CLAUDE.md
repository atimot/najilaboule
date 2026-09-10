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
├── assets/images.ts   画像の import と alt (alt の文字列は assets/alts.ts)
├── assets/alts.ts     画像 alt (ja/en)。字形サブセットの収集元
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
- `astro.config.ts` の `vite.build.cssMinify` は `esbuild` 固定。Lightning CSS は `animation-timeline` を `animation` ショートハンドに畳み込んで無効な宣言を出す (`.reveal` の浮き上がりが止まる)
- Shippori Mincho は `astro.config.ts` の `collectGlyphs` が `src/content/ja.ts`・`src/config.ts`・`src/assets/alts.ts` から集めた文字だけにサブセットされる。日本語の文字列をそれ以外の場所に置くとフォールバック書体で描かれるので、文言は必ずそこに置く

## デザイン決め事 (重要)

- [`DESIGN.md`](./DESIGN.md) — **デザインシステムの正**。Google Labs の DESIGN.md オープン仕様に従う。トークン値はフロントマターが normative。姉妹の Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`、Dawn ベースの素の CSS) もこのファイルの値を手で移して世界観を揃える
- 色・フォント・余白を変えるときは **DESIGN.md のフロントマターと `src/styles/tokens.css` を同じ値に揃える**
- DESIGN.md を編集したら `npm run lint:design` を通す。warning のうち `orphaned-tokens` と `button-filled` の `contrast-ratio` (半透明背景の誤検知) は許容
- 動きの決め事は DESIGN.md の Components / Motion Grammar。新しい動きを足すときはそこに追記する
- 再構築の経緯と受け入れ基準は `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md`。旧 React 版の記録は `docs/archive/lp-blueprint-react.md`

## CI とデプロイ

- PR と main への push で軽量 CI (`.github/workflows/ci.yml`: check:lockfile → `npm ci` → lint → build) が走る。**緑を確認してからマージする**(ブランチ保護・auto-merge は使わない手動運用)
- main マージで `deploy.yml` が GitHub Pages へデプロイ
- `package-lock.json` は手編集しない。lockfile 変更は必ず `npx -y npm@latest` 経由 (ローカル npm は wasm 系 optional 依存を脱落させ CI が落ちる)。`npm run check:lockfile` で脱落を検査できる
- Dependabot PR は CI が緑になったことを確認してから手動でマージする
