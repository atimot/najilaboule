# Naji la boule (LP)

銀座の和食店「Naji la boule (ナジラブール)」の公式ランディングページ。

**公開 URL**: https://najilaboule.com/ (2026-09-25 に独自ドメインへ移行。旧 https://atimot.github.io/najilaboule/ からは GitHub Pages が転送する)

Astro 7 + 素の CSS + TypeScript。配信 JS ゼロ、フォントと画像はビルド時に最適化。日本語ページのみ (英語版は `src/content/en.ts` と `src/pages/en/` を足して対応する構造)。

## 開発

```bash
npm ci           # 依存のインストール (lockfile どおり)
npm run dev      # dev サーバー (http://localhost:4321/)
npm run build    # ビルド + dist の不変条件チェック
npm run lint     # astro check
npm run preview  # ビルド成果物のローカル配信 (http://localhost:4173/)
```

## デプロイ

main ブランチへのマージで GitHub Actions (`.github/workflows/deploy.yml`) が GitHub Pages へ自動デプロイする。PR には CI (lint / build / E2E) が走る。

独自ドメイン `najilaboule.com` は、Cloudflare の DNS (apex と www を CNAME で `atimot.github.io` に向け、プロキシはオフ) と、GitHub の Settings > Pages のカスタムドメイン設定で結び付けている。Actions でデプロイしているので `public/CNAME` は使わない。

開発の決め事は [CLAUDE.md](./CLAUDE.md)、デザインシステム (Google Labs の DESIGN.md 仕様準拠) は [DESIGN.md](./DESIGN.md) を参照。
