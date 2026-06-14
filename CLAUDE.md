# Naji la boule (LP)

銀座の和食店「Naji la boule」の公式ランディングページ。React 19 + Vite + Tailwind v4。

## デザイン決め事 (重要)

このプロジェクトは姉妹プロジェクトの Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`) と **デザイン統一** をしている。デザイントークン・タイポ・余白・コピー語感の **正 (source of truth)** はこのプロジェクト直下の [`DESIGN.md`](./DESIGN.md) に集約。

- 色・フォント・余白などを変更する際は、必ず `DESIGN.md` も同時更新する
- `src/index.css` の `@theme` ブロックは `DESIGN.md` の値と一致させる
- 新しいデザインパターンを導入する場合は、Shopify 側への波及も意識する

## CI/CD と自律マージ (重要)

このリポジトリは **人間を挟まない自律マージ** を前提に整備している。コストはかけない方針で、頭脳はローカルの Claude、GitHub 側は無料の機械ゲートのみが担う。

### パイプライン

1. ローカルで実装 → フル検証 (型・lint・build・起動スモーク) を通す
2. PR を作成し `gh pr merge --merge --auto` を予約する
3. GitHub の **CI (`.github/workflows/ci.yml`) が required check**。緑になったら GitHub が自動マージする
4. main マージで `deploy.yml` が GitHub Pages へデプロイ。デプロイ完走まで見届ける

検証〜マージ〜デプロイ見届けの実務手順は [`/ship` スキル](.claude/skills/ship/SKILL.md) に集約。依存更新は [`/dependabot-merge` スキル](.claude/skills/dependabot-merge/SKILL.md) を使う。

### マージ判断の線引き

| 区分 | 例 | 扱い |
|---|---|---|
| **自律マージ可** | バグ修正・依存更新・コピー修正・パフォーマンス/アクセシビリティ改善・リファクタ | CI 緑なら auto-merge してよい |
| **人間確認必須** | `DESIGN.md`/`src/index.css` の `@theme` に触れるデザイン変更、情報構造・セクション構成の変更、コピーの語感を変える変更 | CI が緑でも auto-merge せず、PR で人間の判断を仰ぐ (Shopify 側へ波及するため) |

判断に迷う差分は **マージせず人間に委ねる**。これが原則。

### 運用上の約束

- **検証が全て通った PR だけ**をマージ対象にする。1つでも失敗したらマージしない
- **デプロイが失敗したら以降の処理を全停止**し、原因修正を最優先する
- ソロ運用のため required gate は「**CI 必須**」であって「レビュー必須」ではない (自分の PR は自分で approve できず、レビュー必須にすると全マージが詰まる)
- `package-lock.json` は手で編集しない。lockfile 変更は必ず `npx -y npm@latest` 経由 (ローカル npm は wasm 系 optional 依存を脱落させ CI が落ちる)
