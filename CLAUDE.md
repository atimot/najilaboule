# Naji la boule (LP)

銀座の和食店「Naji la boule」の公式ランディングページ。React 19 + Vite + Tailwind v4 + TypeScript。

## コマンド

```bash
npm run dev      # dev サーバー起動 (http://localhost:5173/najilaboule/ — base パスに注意)
npm run build    # tsc -b && vite build。完了報告前に必ず通すこと
npm run lint     # eslint .
npm run lint:design  # DESIGN.md を Google design.md CLI で検証 (エラー 0 を維持)
npm run preview  # build 成果物をローカル配信 (http://localhost:4173/najilaboule/)
```

`.ts`/`.tsx` を編集したら `npm run lint` と `npm run build` を自分で実行して検証する(以前あった PostToolUse hook はコミット 4146a66 で撤去済み)。エラーはその場で直してから先に進む。

## 構造

```
src/
├── App.tsx            # エントリ。コンテンツは Loader の下に常時マウント (LCP 対策)
├── components/        # BrandDots / Content / Footer / Header / Loader / ReservationButton
├── i18n/              # 文言は data.ts に ja/en 両方で集約。useLanguage() で取得
├── images/            # 画像メタデータ (srcset/sizes と ja/en の alt をコロケーション)
├── hooks/             # usePrefersReducedMotion (アニメーションは必ずこれを尊重)
├── index.css          # Tailwind @theme (デザイントークンの実体)
└── constants.ts
```

## ルール

- **文言のハードコード禁止**。表示文字列は `src/i18n/data.ts` に ja/en 両方を追加し、`useLanguage()` 経由で参照する。例外は3つ: (1) 画像の alt は `src/images/data.ts` に ja/en 併記でコロケーション、(2) 両言語共通の欧文装飾ラベル (RIZ / ADDRESS / TEL / GINZA 等) は JSX 直書きを許容、(3) `index.html` の静的文言 (meta description / noscript) は React を経由できないため直書きし、対応する `data.ts` / `constants.ts` の値と同期コメントで揃える
- `dist/` と `package-lock.json` は直接編集しない(規約。以前の permissions deny による機械的ブロックは撤去済み)
- アニメーションを追加・変更するときは `usePrefersReducedMotion` による reduced-motion 対応を維持する
- Performance / Accessibility / SEO は改善済み(コミット 2ff8234)。スコアを下げる回帰を出さない

## デザイン決め事 (重要)

デザインの決め事は 2 つの文書に分かれている。役割が違うので混ぜない。

- [`DESIGN.md`](./DESIGN.md) — **デザインシステムの正**。Google Labs の DESIGN.md オープン仕様 (YAML フロントマターのトークン + 固定 8 節の本文) に従う。色・タイポ・余白・角丸・コンポーネントのトークン値はフロントマターが normative で、本文は「なぜ・どこで使うか」と Do's and Don'ts。姉妹の Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`、Dawn ベースの素の CSS) もこのファイルの値を手で移して世界観を揃える
- [`docs/design/lp-blueprint.md`](./docs/design/lp-blueprint.md) — **Astro 移植用の一時的な照合仕様**。React 実装 (コミット 76ac9d2) のセクション別 DOM と Tailwind クラス、motion のアニメーション表、振る舞い、移植チェックリスト。Astro 版がチェックリストを満たしたら退役させる。恒久的な決め事はここに足さず DESIGN.md へ

運用ルール:

- 色・フォント・余白を変えるときは **DESIGN.md のフロントマターと `src/index.css` の `@theme` を同じ値に揃える**。`npx -y @google/design.md@0.4.0 export --format css-tailwind DESIGN.md` の出力と `@theme` を見比べれば照合できる (フォント行は書式が違うので目視)
- DESIGN.md を編集したら `npm run lint:design` を通す。エラー 0 を維持する。warning のうち `orphaned-tokens` (コンポーネントから参照されないトークン) と `button-filled` の `contrast-ratio` (半透明背景を単体で計算する誤検知) は許容
- 新しいデザインパターンを導入する場合は DESIGN.md の該当節 (Components / Do's and Don'ts) に追記し、Shopify 側への波及も意識する
- Astro への作り直しは 2026-09-10 に決定 (Tailwind v4 は継続)。移行本体の設計は別途 spec を書く

## CI とデプロイ

- PR と main への push で軽量 CI (`.github/workflows/ci.yml`: check:lockfile → `npm ci` → lint → build) が走る。**緑を確認してからマージする**(ブランチ保護・auto-merge は使わない手動運用)
- main マージで `deploy.yml` が GitHub Pages へデプロイ
- `package-lock.json` は手編集しない。lockfile 変更は必ず `npx -y npm@latest` 経由 (ローカル npm は wasm 系 optional 依存を脱落させ CI が落ちる)。`npm run check:lockfile` で脱落を検査できる
- Dependabot PR は CI が緑になったことを確認してから手動でマージする
