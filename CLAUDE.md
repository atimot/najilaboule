# Naji la boule (LP)

銀座の和食店「Naji la boule」の公式ランディングページ。React 19 + Vite + Tailwind v4 + TypeScript。

## コマンド

```bash
npm run dev      # dev サーバー起動 (http://localhost:5173/najilaboule/ — base パスに注意)
npm run build    # tsc -b && vite build。完了報告前に必ず通すこと
npm run lint     # eslint .
npm run preview  # build 成果物をローカル配信 (http://localhost:4173/najilaboule/)
```

型チェックと lint は PostToolUse hook が `.ts`/`.tsx` 編集のたびに自動実行される。エラーが返ってきたらその場で直してから先に進む。

## 構造

```
src/
├── App.tsx            # エントリ。Loader → Header/Content/Footer
├── components/        # BrandDots / Content / Footer / Header / Loader / ReservationButton
├── i18n/              # 文言は data.ts に ja/en 両方で集約。useLanguage() で取得
├── hooks/             # usePrefersReducedMotion (アニメーションは必ずこれを尊重)
├── index.css          # Tailwind @theme (デザイントークンの実体)
└── constants.ts
```

## ルール

- **文言のハードコード禁止**。表示文字列は `src/i18n/data.ts` に ja/en 両方を追加し、`useLanguage()` 経由で参照する
- `dist/` と `package-lock.json` は直接編集しない(permissions の deny で機械的にブロック済み)
- アニメーションを追加・変更するときは `usePrefersReducedMotion` による reduced-motion 対応を維持する
- Performance / Accessibility / SEO は改善済み(コミット 2ff8234)。スコアを下げる回帰を出さない

## デザイン決め事 (重要)

このプロジェクトは姉妹プロジェクトの Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`) と **デザイン統一** をしている。デザイントークン・タイポ・余白・コピー語感の **正 (source of truth)** はこのプロジェクト直下の [`DESIGN.md`](./DESIGN.md) に集約。

- 色・フォント・余白などを変更する際は、必ず `DESIGN.md` も同時更新する(忘れると hook がリマインドする)
- `src/index.css` の `@theme` ブロックは `DESIGN.md` の値と一致させる
- 新しいデザインパターンを導入する場合は、Shopify 側への波及も意識する

## CI とデプロイ

- PR と main への push で軽量 CI (`.github/workflows/ci.yml`: `npm ci` → lint → build) が走る。**緑を確認してからマージする**(ブランチ保護・auto-merge は使わない手動運用)
- main マージで `deploy.yml` が GitHub Pages へデプロイ
- `package-lock.json` は手編集しない。lockfile 変更は必ず `npx -y npm@latest` 経由 (ローカル npm は wasm 系 optional 依存を脱落させ CI が落ちる)。`npm run check:lockfile` で脱落を検査できる
- 依存更新は [`/dependabot-merge` スキル](.claude/skills/dependabot-merge/SKILL.md) を使う
