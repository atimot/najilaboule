# Naji la boule (LP)

銀座の和食店「Naji la boule (ナジラブール)」の公式ランディングページ。

**公開 URL**: https://atimot.github.io/najilaboule/

React 19 + Vite + Tailwind CSS v4 + TypeScript。日本語 / 英語の2言語対応 (`?lang=en`)。

## 開発

```bash
npm ci           # 依存のインストール (lockfile どおり)
npm run dev      # dev サーバー (http://localhost:5173/najilaboule/ — base パスに注意)
npm run build    # 型チェック + 本番ビルド
npm run lint     # ESLint
npm run preview  # ビルド成果物のローカル配信 (http://localhost:4173/najilaboule/)
```

## デプロイ

main ブランチへのマージで GitHub Actions (`.github/workflows/deploy.yml`) が GitHub Pages へ自動デプロイする。PR には CI (lint / build) が走る。

開発の詳細な決め事は [CLAUDE.md](./CLAUDE.md)、デザイントークンの方向性メモは [DESIGN.md](./DESIGN.md) を参照。
