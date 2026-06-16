# Naji la boule Design Guide

LP (このプロジェクト) と Shopify テーマ (`/Users/tomitad/work/najilaboule-shop`) で同じ世界観を保つための **方向性の共有メモ (directional reference)**。

> **位置づけに注意**: トークン値の実体 (= 厳密な正) は LP の `src/index.css` の `@theme` ブロックおよび各コンポーネント。このドキュメントはそこから引いた値を Shopify 側に翻訳するための"対訳・意図メモ"であり、コードとの 1:1 完全一致を保証するものではない。値がズレていたら **`src/index.css` が正**。Shopify テーマ側はこのメモを参考に `config/settings_data.json` 等で色・フォントを設定する。

---

## 1. カラーパレット

### 基本色

| 役割 | 値 | 用途 |
|---|---|---|
| `brand` | `#241816` | 全体の背景・面の基本色 |
| `brand-dark` | `#1f1513` | 背景グラデーションの暗部、コントラスト強化 |
| `brand-light` | `#2a1d1b` | カード/区画の浮き上がり、ホバー面 |
| `accent` | `#C8A67B` | CTA、ホバー時の差し色、フォーカスリング |
| `text-primary` | `#f8f8f8` | 本文・見出し共通の文字色 |
| `scrollbar-thumb` | `#443330` | スクロールバーつまみ |

### ロゴモチーフ用ドットパレット (装飾アクセント)

UIの主役にはせず、ブランドモチーフとしてのみ使用。

`#FFFFFF` `#000000` `#E60012` `#0099CC` `#FFD700` `#009944` `#F39800` `#E6007F` `#920783`

### Shopifyへの翻訳

`config/settings_data.json` の `current.colors_*` 系で以下のように設定:

- `colors_background_1` → `#241816`
- `colors_background_2` → `#2a1d1b`
- `colors_accent_1` → `#C8A67B`
- `colors_foreground` / `colors_text` → `#f8f8f8`

---

## 2. タイポグラフィ

### フォントファミリ

| 用途 | フォント | 備考 |
|---|---|---|
| 全要素共通 (Serif) | `Playfair Display`, `Shippori Mincho`, serif | 欧文は Playfair、和文は Shippori Mincho に自動フォールバック。body に `var(--font-serif)` を直接適用 |

サンセリフ補助は導入していない。ラベル・補助情報も全て serif で統一して静謐な世界観を保つ。

### 使用ウェイト

#### Google Fonts への読み込み

Google Fonts への読み込みは **実際に使うウェイトのみ** に限定する（フェイクボールド回避とネットワーク削減のため）。

| ファミリ | ウェイト | 用途 |
|---|---|---|
| Playfair Display | 400 / 700 | 見出し / 強調 (JP/EN ボタン active) |
| Shippori Mincho | 400 / 700 | 本文・和文見出し / 強調 |

新規ウェイトを使うときは `index.html` の Google Fonts URL を更新してから利用すること。

#### Tailwind ウェイトクラスの運用

| クラス | 値 | 用途 | 備考 |
|---|---|---|---|
| `font-normal` | 400 | 標準（body 既定、本文・見出し共通） | 既定ウェイト。明示せず継承で良い |
| `font-bold` | 700 | アクセント（JP/EN active のみ） | 読み込み済み |

`font-light` (300) は使用しない。本文の「軽さ・繊細さ」は `text-gray-300` / `text-gray-400` の色トーンと `leading-loose` の行高で表現する方針。

### フォントフィーチャー

`body` に `font-feature-settings: "palt"` を適用し、和文のプロポーショナルメトリクスを有効化している。和欧混植や約物まわりのリズムを整える目的。

### サイズスケール (Tailwind準拠)

LPで使用中のスケール: `text-xs` / `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl` / `text-3xl` / `text-4xl`

| 用途 | クラス目安 |
|---|---|
| 大見出し (ヒーロー) | `text-4xl` 以上 |
| セクション見出し | `text-2xl` 〜 `text-3xl` |
| 小ラベル (RIZ / SOUPE 等) | `text-xs tracking-widest` |
| 本文 | `text-base leading-loose` または `leading-relaxed` |

### 字間・行高

- 字間: 小ラベルには `tracking-widest` (0.1em) を必ず使用。ブランド名・ヒーロー見出しなど特別な場面では `tracking-[0.2em]` 〜 `tracking-[0.3em]` を選ぶ
- 行高: 本文は `leading-loose` (2) / `leading-relaxed` (1.625) で余裕を持たせる
- 和文タイトルでも欧文と同じ `tracking-[0.2em]` を当てるなど、和欧の差を意識せず統一的に運用

### タイポグラフィ規則

実装で徹底している文字の作法。新規コピーを追加する際もこれに従う。

- アポストロフィは曲線 `'` を使う（直線 `'` は避ける）
  例: `Riz et Soupe, et un peu d'alcool.`
- 数字レンジには en dash `–` を使う（ハイフン `-` は避ける）
  例: `18:30 – 23:30`
- 三点リーダーは `…`（連続ピリオド `...` は使わない）
- 引用符は和文では「」、欧文では曲線の `"` `"` を使う
- 体言止めの和文に句読点を組み合わせるブランド語感（「結ぶ、米。」等）は維持

### 数字表記

電話番号・営業時間・年号など、桁を揃えたい数字には `tabular-nums` (`font-variant-numeric: tabular-nums`) を付与する。子要素にも数字を表示する場合、Tailwind v4 の `tabular-nums` は CSS 変数経由で **子に継承されない** ため、数字を含む要素に直接付与する（例: `<a>` に直付け）。

### Shopifyへの翻訳

`config/settings_data.json` の `type_*` 系:

- `type_header_font` → `playfair_display_n4` または `shippori_mincho_n4`
- `type_body_font` → `shippori_mincho_n4`
- ウェイトは Playfair Display / Shippori Mincho ともに 400・700 のみ採用

---

## 3. 余白とレイアウト

### セクション・要素の標準値

| 用途 | 値 | クラス例 |
|---|---|---|
| セクション縦パディング | 96px / 160px | `py-24` / `py-40` |
| セクション横パディング (デスクトップ) | 80px | `px-20` |
| セクション横パディング (モバイル) | 24px | `px-6` |
| 段落・要素の縦間隔 | 32px | `mb-8` |
| 要素グリッドの隙間 | 24px / 32px / 48px | `gap-6` / `gap-8` / `gap-12` |

### 原則

- **大胆な余白を恐れない。** LPは1セクション=1ビューポート級の余白で世界観を出している。
- Shopifyテーマでも、テーマエディタの「セクション余白」設定は **デフォルトより1〜2段階大きく** とる。

---

## 4. 背景・質感の決め事

LPの背景は **3層構造** で深みを出している。Shopifyテーマでは完全再現は不要だが、原理を踏襲する。

1. ベース色: `var(--color-brand)` (#241816)
2. 微弱なノイズテクスチャ (SVG fractal noise、不透明度低)
3. 隅から差し込むラジアルグラデーション (アクセント色×6%)

Shopifyテーマで再現する場合は、`section` 単位で background-image を CSS で追加するか、ヒーローセクションの画像に暗部のグラデーションオーバーレイを乗せる方向で寄せる。

---

## 5. インタラクション・モーション

| 項目 | 値 |
|---|---|
| フォーカスリング | アクセント色 (#C8A67B) 2px / offset 2px |
| 標準的なフェードイン | `opacity 0→1`, `y +30px→0`, `1s` (`fadeInUp` プリセット in `src/constants.ts`) |
| 透明度のみのフェード | `opacity 0→1`, `1s` (`fadeIn` プリセット) |
| ホバートランジション | `transition-opacity duration-300 hover:opacity-70` または `transition-colors duration-300 hover:text-accent` |
| Loader 表示時間 | 通常 2500ms / reduced-motion 時 500ms (`TIMING.LOADER_DURATION` / `LOADER_DURATION_REDUCED`) |
| Hero フェード遅延 | dots `delay 3s` → h1 `delay 3.5s` → tagline `delay 4s`。Loader 退場直後の演出として固定 |
| Philosophy スライド切替間隔 | 7000ms (`TIMING.PHILOSOPHY_SLIDE_INTERVAL`)。自動送りは「セクションが画面内 + reduced-motion でない + hover/focus されていない」間のみ動作 (WCAG 2.2.2)。手動切替でタイマーはリセット |
| Hero 背景の slow-zoom | `scale 1.1 → 1.2`, `20s infinite alternate` (CSS keyframes) |
| `prefers-reduced-motion` | 全 animation・transition を 0.01ms に短縮、`scroll-behavior: auto` も強制する CSS が設定済み。JS 側からは `usePrefersReducedMotion` フック (`src/hooks/`) を参照し、Loader 短縮や smooth scroll 抑制に利用する |

Shopifyテーマでは過剰なアニメーションは入れず、上記範囲に収める。

---

## 5.5 画像の決め事

- 配信フォーマットは **WebP** (品質 78)。`public/images/` には WebP のみ置く
- 各画像は `-800.webp` / `-1600.webp` の2サイズ (ヒーローのみ `-2400.webp` も) を用意し、`srcset` + `sizes` で出し分ける
- `sizes` の目安: ヒーロー `100vw` / Philosophy `(min-width: 768px) 44rem, 100vw` / Experience `(min-width: 768px) 40rem, 100vw`
- 元データ (高解像度 JPEG) は `assets/images-original/` に保管し、ビルドには含めない
- 再生成コマンド例: `npx sharp-cli -i in.jpg -o out-1600.webp -f webp -q 78 resize 1600`
- OGP 用画像は `public/images/ogp.jpg` (1200×630 JPEG)。SNS スクレイパーの互換性のため WebP にしない

---

## 6. コピーの語感

LPで確立された語感:

- **体言止めの短文 +「、」**: 「結ぶ、米。」「ほどける、汁。」「揺蕩う、盃。」
- **仏語の小ラベル**: 主要カテゴリには `RIZ` / `SOUPE` / `MARIAGE` 等の仏語小キャプションを添える
- **動詞・形容動詞の選定**: 静的な動詞 (結ぶ・ほどける・揺蕩う) を好む

Shopifyテーマのアナウンスバー、商品見出し、空状態のメッセージ等もこの語感を踏襲する。

例:
- アナウンスバー: `Welcome to our store` → `銀座から、お米を。` のようなトーン
- 空のカート: `カートの中身が空です` → そのままでもよいが、追加コピーを入れるなら同語感

---

## 7. 運用ルール

### ドキュメント運用

- このファイルは LP プロジェクト直下を **正** とする。Shopify テーマ側は本ファイルを参照のうえ実装。
- LP の `src/index.css` および `src/constants.ts` を更新したら、本ファイルも合わせて更新する。
- 値の追加や変更があった場合は、Shopify テーマ側で `config/settings_data.json` への反映漏れがないかを確認。
- 「迷ったら静謐 (せいひつ) と余白を選ぶ」が指針。

### i18n

- 新しい UI 文字列を追加する際は `src/i18n/data.ts` の `Translations` 型に必ず追加し、ja/en 両方を埋める
- aria-label・iframe title など **アクセシビリティ用文字列も i18n 経由** にする（ハードコード禁止）
- `<html lang>` は `LanguageProvider` が言語 state と自動同期するため、ja/en 切替時もスクリーンリーダーが言語を認識する
- 言語選択は `localStorage` (`najilaboule:language`) に永続化。初回訪問時は `navigator.language` で判定 (ja 系→ja、それ以外→en)

### アクセシビリティ

- 見出し階層は `h1` を 1 ページ 1 つ（HeroSection）、各セクションのトップは `h2`。スライド内タイトルも `h2` として扱う
- 装飾画像（背景写真など）は `alt=""` + `aria-hidden="true"` とし、内容を持つ画像は `alt` を i18n 経由で
- 状態が変わるボタン（ハンバーガー等）の `aria-label` は状態に応じて切り替える
- インジケータ・タブ系のボタンは `aria-current` を活用、ラベルにスライドタイトルと `(N/合計)` を含める
- 内部ナビ用のリンクは `<button onClick>` でなく `<a href>` を使い、Cmd/Ctrl/Shift/middle-click で本来のリンク挙動が温存されるよう修飾キーを判定する
- モバイルメニュー表示中は背景スクロールをロックし、Tab フォーカスをメニュー内 (+ハンバーガー) に閉じ込める。閉じたらハンバーガーへフォーカスを戻す
- 暗背景上の小サイズ文字 (ラベル・注記) は `text-gray-400` を下限とする。`text-gray-500` 以下はコントラスト比 4.5:1 を満たさないため使用しない

### Tailwind v4 の注意点

- `tabular-nums` は CSS 変数経由実装のため **子要素に継承されない**。数字を表示する要素そのものに付与する
- `@theme` で定義したトークン（`--color-*` / `--font-*`）の追加・変更は本ファイルにも反映する
