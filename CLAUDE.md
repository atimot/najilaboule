# Naji la boule (LP)

銀座の和食店「Naji la boule」の公式ランディングページ。React 19 + Vite + Tailwind v4。

## デザイン決め事 (重要)

このプロジェクトは姉妹プロジェクトの Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`) と **デザイン統一** をしている。デザイントークン・タイポ・余白・コピー語感の **正 (source of truth)** はこのプロジェクト直下の [`DESIGN.md`](./DESIGN.md) に集約。

- 色・フォント・余白などを変更する際は、必ず `DESIGN.md` も同時更新する
- `src/index.css` の `@theme` ブロックは `DESIGN.md` の値と一致させる
- 新しいデザインパターンを導入する場合は、Shopify 側への波及も意識する
