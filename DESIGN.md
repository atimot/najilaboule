---
version: alpha
name: Naji la boule
description: 銀座の和食店「Naji la boule」の公式サイトと姉妹ショップが共有する視覚言語。深い焦茶の闇に、ひと筋の金、明朝体だけの静謐。
colors:
  # キー名は LP の Tailwind @theme (--color-*) と一致させている。primary は DESIGN.md 仕様互換の別名で、値は accent と同一。
  primary: "#C8A67B"
  accent: "#C8A67B"
  brand: "#241816"
  brand-dark: "#1f1513"
  brand-light: "#2a1d1b"
  text: "#f8f8f8"
  text-soft: "oklch(87.2% 0.01 258.338)"
  text-muted: "oklch(70.7% 0.022 261.325)"
  line-strong: "rgba(255, 255, 255, 0.5)"
  line: "rgba(255, 255, 255, 0.2)"
  line-faint: "rgba(255, 255, 255, 0.05)"
  scrollbar-thumb: "#443330"
  dot-white: "#FFFFFF"
  dot-black: "#000000"
  dot-red: "#E60012"
  dot-blue: "#0099CC"
  dot-yellow: "#FFD700"
  dot-green: "#009944"
  dot-orange: "#F39800"
  dot-pink: "#E6007F"
  dot-purple: "#920783"
typography:
  # fontSize は 768px 以上の値。モバイル値は本文 Typography の表を参照。
  display:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "3.5rem"
    fontWeight: 400
    lineHeight: 1.11
    letterSpacing: "0.2em"
  headline:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.1em"
  title:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0.1em"
  brand:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.1em"
  body:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "0.1em"
    fontFeature: '"palt"'
  menu:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0.1em"
  label:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.1em"
  label-wide:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.3em"
  caption:
    fontFamily: Playfair Display, Shippori Mincho, serif
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  full: "9999px"
  scrollbar: "4px"
spacing:
  section-x: "24px"
  section-x-md: "80px"
  section-y: "96px"
  section-y-md: "160px"
  header: "24px"
  header-md: "40px"
  stack: "32px"
  stack-lg: "48px"
  stack-xl: "64px"
  card-gap: "96px"
  card-gap-md: "128px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.menu}"
    rounded: "{rounded.none}"
    padding: "12px 32px"
  button-outline-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.brand}"
  button-filled:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text}"
    typography: "{typography.menu}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    width: "100%"
  button-filled-hover:
    backgroundColor: "{colors.dot-white}"
    textColor: "{colors.brand}"
  nav-link:
    textColor: "{colors.text}"
    typography: "{typography.menu}"
  nav-link-hover:
    textColor: "{colors.accent}"
  language-switch:
    textColor: "{colors.text}"
    typography: "{typography.label}"
  language-switch-active:
    textColor: "{colors.accent}"
    typography: "{typography.label}"
  section-label:
    textColor: "{colors.accent}"
    typography: "{typography.label-wide}"
  field-label:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
  mobile-menu-overlay:
    backgroundColor: "rgba(36, 24, 22, 0.8)"
    textColor: "{colors.text}"
  brand-dot:
    rounded: "{rounded.full}"
    size: "12px"
  slide-indicator:
    backgroundColor: "{colors.dot-white}"
    rounded: "{rounded.full}"
    size: "8px"
  footer-text:
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
---

<!--
  このファイルは Google Labs の DESIGN.md オープン仕様 (https://github.com/google-labs-code/design.md) に従う。
  - フロントマターのトークンが正 (normative)。本文はその使いどころと理由。
  - 検証: `npm run lint:design` (エラー 0 を維持する。orphaned-tokens 等の warning は許容)
  - トークンを変えたら LP の `src/index.css` の @theme も同じ値に揃える (`npx -y @google/design.md@0.4.0 export --format css-tailwind DESIGN.md` で照合できる)
    (@theme 側にだけある `--font-serif` は、ここの全 typography 役割が共有する fontFamily に対応する。export のフォント行は書式が違うので目視で合わせる)
  - 許容している lint warning: orphaned-tokens (コンポーネント未参照のトークン)、button-filled の contrast-ratio (半透明背景を単体で計算する誤検知)
  - React 実装の個別レイアウト・モーション・振る舞いは docs/design/lp-blueprint.md (Astro 移植用の一時文書) に分離している
-->

# Design System: Naji la boule

## Overview

**Creative North Star: 「宵闇のカウンター (The Counter at Nightfall)」**

銀座の喧騒から一段降りた、灯りを落としたカウンター。深い焦茶の闇が面の大半を占め、そこに盃の縁のような金がひと筋だけ差す。声を張らず、行間で語る。このサイトは店の空気そのものを再現する装置であり、情報を並べる場所ではない。1 セクションが 1 画面ぶんの余白を持ち、写真は減光して地に溶かし、文字は明朝体だけで組む。動きはあるが、すべて「ゆっくり現れて、そこに留まる」だけで、跳ねたり滑ったりしない。

姉妹の Shopify ショップ (伊彌彦米の EC) も同じ世界観を共有する。ショップ側は Liquid テーマなので、このファイルのトークン値と Do's and Don'ts を手で移し替える (Tailwind は使わない)。

**Key Characteristics:**
- 面の基本は焦茶 (`brand` #241816) 一色。明度差ではなくノイズと放射グラデーションで奥行きを出す
- 差し色は金 (`accent` #C8A67B) のみ。ホバー・フォーカス・小ラベルに限って使い、面を塗らない
- 書体は Playfair Display と Shippori Mincho の明朝ペアだけ。サンセリフは存在しない
- ウェイトは 400 が既定。700 は言語スイッチのアクティブ表示にしか使わない
- 写真は必ず減光し (25〜90%)、下端を `brand` へ溶かすグラデーションを重ねる
- 角丸も影もない。ブランドの 9 色ドットだけが円形で、淡いグローをまとう
- 余白は広く。縦 96px / 160px、横 24px / 80px を標準とし、迷ったら広い方を選ぶ
- 動きは 1 秒のフェードが基本。`prefers-reduced-motion` を必ず尊重する

## Colors

パレットは「焦茶の階調 + 白の階調 + 金 1 色」で構成し、それ以外の彩度のある色はブランドドットの装飾にしか現れない。

### Primary
- **金 (`accent` / `primary`, #C8A67B)**: 唯一の差し色。ボタンのホバー反転面、リンクのホバー色、フォーカスリング (2px / offset 2px)、`RIZ` `SOUPE` `BOUTIQUE` などの仏語小ラベル、言語スイッチのアクティブ表示に使う。静止状態の面を塗ることはない。

### Neutral
- **焦茶 (`brand`, #241816)**: 全体の背景。Loader の面、モバイルメニューの半透明面 (80%)、写真の下端を溶かすグラデーションの終点も同じ色。
- **深い焦茶 (`brand-dark`, #1f1513)**: Access セクションの背景と、body 背景の右下に落とすラジアルグラデーションの暗部。
- **浮いた焦茶 (`brand-light`, #2a1d1b)**: body 背景の左上に差す微光の起点 (`accent` を 6% 混ぜる)。カードやホバー面にも使えるが、LP では背景以外に使っていない。
- **本文の白 (`text`, #f8f8f8)**: 見出し・本文・ボタン文字の既定色。純白 (#fff) は使わない。
- **やわらかい白 (`text-soft`, oklch(87.2% 0.01 258.338) ≈ #d1d5dc)**: Philosophy と BOUTIQUE の本文。長めの段落を白より一段落として読ませる。
- **沈めた白 (`text-muted`, oklch(70.7% 0.022 261.325) ≈ #99a1af)**: タグライン、Experience 本文、`ADDRESS` `TEL` などのフィールドラベル、カナ表記、フッター。暗背景で許容するいちばん薄い文字色。
- **罫線の白 (`line-strong` 50% / `line` 20% / `line-faint` 5%)**: それぞれ outline ボタンの枠、filled ボタンの枠、フッター上の区切り線。白のアルファで引き、実色の罫線は使わない。
- **スクロールバー (`scrollbar-thumb`, #443330)**: WebKit スクロールバーのつまみ。トラックは `brand`。

### Brand Dots (装飾専用)
白・黒・赤・青・黄・緑・橙・桃・紫の 9 色 (`dot-*`) は、ロゴモチーフの 3×3 ドットと、セクションに散らす微小な光点にだけ使う。UI の意味色 (成功・警告・リンクなど) に転用しない。ドットは 30〜50% のグローを伴い、黒ドットだけは #4a5565 相当の 1px 枠で輪郭を出す。

### Named Rules
**The One Gold Rule.** 金は 1 画面のうちごく一部にしか現れない。CTA も静止時は白の罫線で、ホバーして初めて金に反転する。金が面として存在する時間は「触れている間」だけ。

**The Dimmed Photo Rule.** 写真をそのままの明るさで置かない。Hero は 50% + グレースケール、Philosophy は 25%、BOUTIQUE は 30%、Experience は 90% に落とし、いずれも `brand` へのグラデーションで地に沈める。

## Typography

**Display / Body Font:** Playfair Display (欧文) → Shippori Mincho (和文) → serif
**Label Font:** 同上。サンセリフの補助書体は導入しない。

**Character:** 欧文は Playfair の高いコントラストで銀座らしい格を出し、和文は Shippori Mincho のやわらかい明朝で受ける。両者は同じ `font-family` スタックで自動的に振り分けられるため、和欧混植でも書体指定を切り替えない。`font-feature-settings: "palt"` を body に当て、和文のプロポーショナル詰めを常時有効にする。Google Fonts からは 400 と 700 だけを読み込む (フェイクボールド防止)。

### Hierarchy
右列はモバイル (768px 未満) の値。フロントマターの `typography` はデスクトップ値。

- **Display** (`display`, 400, 3.5rem / 行間 1.11 / 字間 0.2em): Hero の h1 だけ。改行は文言側で明示する。モバイル 2.25rem。
- **Headline** (`headline`, 400, 2.5rem / 1.2 / 0.1em): Experience・BOUTIQUE・Access の h2。モバイル 1.875rem。
- **Title** (`title`, 400, 1.875rem / 1.625 / 0.1em): Philosophy スライドの h2。行間を広めに取り 2 行タイトルを収める。モバイル 1.5rem。
- **Brand** (`brand`, 400, 1.5rem / 1.33 / 0.1em): ヘッダーの店名。モバイル 1.25rem。直下にカナ表記 (`label` サイズ、字間 0.2em、`text-muted`) を添える。Loader の店名は同じ 1.5rem で字間だけ 0.3em。
- **Body** (`body`, 400, 1rem / 2 / 0.1em): 本文。行間 2 は意図的に広い。モバイル 0.875rem (行間はそのまま)。
- **Menu** (`menu`, 400, 0.875rem / 1.43 / 0.1em): デスクトップナビ、ボタン文字 (md / lg)、Access の予約注記。モバイルメニューの項目は 1.125rem。
- **Label** (`label`, 400, 0.75rem / 1.33 / 0.1em): 言語スイッチ、`ADDRESS` `TEL` `HOURS` `RESERVATION` のフィールドラベル、sm ボタン、営業時間の注記。
- **Label Wide** (`label-wide`, 400, 0.75rem / 1.33 / 0.3em): `RIZ` `SOUPE` `MARIAGE` `BOUTIQUE` `GINZA` のセクションラベル。金または `text-muted`。
- **Caption** (`caption`, 400, 10px / 1.5 / 0.1em): フッターの著作権表記のみ。

### 数字と約物
- 電話番号・営業時間・年号は `font-variant-numeric: tabular-nums` を数字を含む要素に直接付ける (Tailwind v4 の `tabular-nums` は子に継承されない)
- アポストロフィは曲線 `’`、レンジは en dash `–` (`18:30 – 23:30`)、三点リーダーは `…`
- 引用符は和文で「」、欧文で曲線の “ ”
- 体言止め + 読点のブランド語感 (「結ぶ、米。」「ほどける、汁。」「揺蕩う、盃。」) を新規コピーでも維持する。主要カテゴリには仏語の小ラベルを添える

### Named Rules
**The Serif-Only Rule.** すべての文字が明朝体。ラベルも数字もボタンも例外はない。

**The Tone-Not-Weight Rule.** 強調は太さではなく色のトーンで行う。「軽さ」は `text-soft` / `text-muted` と行間 2 で表現し、`font-weight: 300` は使わない。700 を使うのは言語スイッチのアクティブ表示だけ。

**The Tracking Floor Rule.** 字間 0.1em (`tracking-widest`) が下限。詰めた字間は存在しない。

## Layout

**単一ブレークポイント。** レスポンシブの分岐は 768px (`md`) の 1 本だけ。モバイルは 1 カラム縦積み、768px 以上で 2 カラムに開く。中間段階は作らない。

**セクションの余白。** 縦 96px (`section-y`) / 160px (`section-y-md`)、横 24px (`section-x`) / 80px (`section-x-md`)。Hero は `100vh`、Philosophy はモバイルで `min-height: 100vh`。「1 セクション = 1 画面ぶんの余白」が基準。

**コンテナ幅。** 標準は 80rem (1280px) 中央寄せ。BOUTIQUE のように文章だけのセクションは 48rem (768px) に絞る。

**2 カラムの比率。** Philosophy は画像 55% : 文章 45%、Experience は 50% : 50% で左右を交互に反転 (RIZ 画像右、SOUPE 画像左、MARIAGE 画像右)、Access は等幅 2 列グリッド。カラム間は 32〜48px。

**モバイルの画像の扱い。** Philosophy はモバイルで画像を文章の背面に敷き (絶対配置、25% 減光、上下を `brand` 85% で締める)、文章を中央揃えで前面に置く。Experience は画像 (16:9) の下に文章を積む。

**固定ヘッダー。** 上端固定、余白 24px (768px 以上で 40px)、`brand` 90% → 透明の下向きグラデーションと 2px の背景ぼかしで写真の上に浮かせる。モバイルでは右上 24px にハンバーガーだけを固定表示する。

**縦の積み方。** 見出し下 32px (`stack`)、段落下 32〜48px (`stack` / `stack-lg`)、インジケータや地図など補助要素の上 64px (`stack-xl`)。Experience のカード間は 96px / 128px (`card-gap` / `card-gap-md`)。

## Elevation & Depth

**影は使わない。** `box-shadow` も `drop-shadow` も UI には存在しない。奥行きは次の 3 つだけで作る。

1. **体の背景 3 層。** ベースの `brand` の上に、240px タイルの SVG フラクタルノイズ (`soft-light` 合成、不透明度 0.7) を敷き、左上から `accent` 6% を混ぜた `brand-light` の楕円グラデーション、右下から `brand-dark` の楕円グラデーションを差す。3 層とも `background-attachment: fixed`。
2. **写真の減光とグラデーション。** 写真は Dimmed Photo Rule で暗くし、その上に `brand` へ溶けるグラデーションを重ねる。Hero は上 60% → 透明 → 下 100%、Experience は下から 100% → 透明 (全体 60%)、BOUTIQUE は上下 100% で中央 40%、Philosophy (モバイル) は上下 85% で中央 50%。
3. **背景ぼかし。** ヘッダーは 2px、モバイルメニューは 28px + 彩度 150% のバックドロップフィルタで、下のコンテンツを感じさせながら読みやすさを確保する。

**唯一の発光。** ブランドドットだけが `0 0 10px` のグローを持つ (白ドット 50%、色ドット 30%、黒ドットはグローなし)。セクションに散らす光点は 1px のぼかしで滲ませる。

**レイヤー順序。** ヘッダー 40 < モバイルメニュー 50 < ハンバーガー 60 < Loader 70。Loader は不透明な `brand` 面で、退場するまで下のコンテンツを完全に隠す。

### Named Rules
**The Flat-Dark Rule.** 面は平らで、影で持ち上げない。手前にあるものは「暗い地に対して明るい」のではなく「地と同じ色で、光だけが違う」。

## Shapes

**角は直角。** ボタン、写真、カード、iframe、すべて `border-radius: 0`。角丸は円形の要素 (ブランドドット、スライドインジケータ、装飾の光点) と WebKit スクロールバーのつまみ (4px) にしか現れない。

**線は 1px。** ボタンの枠、フッターの区切り、言語スイッチのアクティブ下線、ハンバーガーの 2 本線は、いずれも 1px の細線。太い罫線や塗りの分割線はない。

**写真の比率。** Experience は 16:9 (`aspect-video`)、Philosophy はデスクトップで高さ 700px 固定、Hero と BOUTIQUE は画面いっぱいに `object-fit: cover`。

**アイコンは持たない。** アイコンフォントも SVG アイコンセットも使わない。外部リンクの印は文字の `↗`、ハンバーガーは 2 本の線、ナビの区切りは `|` の文字。

**ブランドモチーフ。** 3×3 の 9 ドット (白・黒・赤 / 青・黄・緑 / 橙・桃・紫 の順) が唯一の図形要素。Loader (12px、間隔 8px)、Hero (12px → 16px、間隔 12px → 16px)、Access (8px、間隔 8px、不透明度 50%) の 3 箇所に置く。

## Components

### Buttons
- **Shape:** 直角、1px の枠、字間 0.1em、文字は `RESERVATION` のように英字大文字
- **Outline (`button-outline`):** 透明地に `line-strong` (白 50%) の枠、文字は `text`。ホバーで地・枠ともに `accent`、文字は `brand` に反転
- **Filled (`button-filled`):** 白 5% の地に `line` (白 20%) の枠。ホバーで地が白、文字が `brand`。Access の予約ボタンで幅 100% にして使う
- **Sizes:** sm 8px × 24px / 0.75rem (ヘッダー)、md 12px × 32px / 0.875rem (モバイルメニュー、BOUTIQUE は横 40px)、lg 16px × 32px / 0.875rem (Access)
- **Transition:** 背景色・枠色・文字色を 500ms で同時に遷移
- **Focus:** `accent` 2px のアウトライン、offset 2px (全リンク・ボタン共通)

### Header & Navigation
- **Desktop:** 左に店名 (`brand`) とカナ表記、右に `Access` リンク (`nav-link`、ホバーで `accent` へ 300ms) と sm の Outline ボタン、続けて言語スイッチ。ヘッダー全体は Loader 退場に合わせて 1 秒でフェードイン (遅延 2.5 秒)
- **Mobile:** ヘッダーからナビと言語スイッチを消し、右上 40×40px のハンバーガー (白 28px × 1px の 2 本線、開くと 45° に交差、300ms) を置く
- **Mobile Menu:** 全画面の `mobile-menu-overlay` (`brand` 80% + 28px ぼかし + 彩度 150%)。項目は 1.125rem、縦 32px 間隔で中央揃え、Outline ボタン (md) と言語スイッチ (0.875rem) を下に添える。0.5 秒でフェードイン、項目は 0.1 秒ずつずらして下から 20px 浮き上がる。背景スクロールはロックし、Tab フォーカスをメニュー内に閉じ込め、Esc と余白タップで閉じる

### Language Switch
- **Style:** `JP | EN` の 2 択、0.75rem、字間 0.1em、区切りの `|` は 50% 不透明
- **Active:** `accent` 色 + 700 + 1px の `accent` 下線。これが 700 を使う唯一の場所
- **Hover:** 非アクティブ側は不透明度 70% へ 300ms

### Section Label + Heading
- **Pattern:** `label-wide` の仏語/英語ラベル (`RIZ` `BOUTIQUE` `GINZA`) を `accent` (Access の `GINZA` は `text-muted`) で置き、8px 下に `headline` の h2、32px 下に本文
- **Field Label:** Access の `ADDRESS` `TEL` `HOURS` `RESERVATION` は `field-label` (`text-muted`、0.75rem、字間 0.1em) で、4px 下に値

### Photo Treatment
- **Hero:** `object-fit: cover`、不透明度 50%、グレースケール、20 秒かけて 1.1 → 1.2 倍にゆっくりズームし往復 (無限)。上に `brand` 60% → 透明 → 100% のグラデーション
- **Philosophy:** 25% に減光、3 枚を 7 秒ごとに 1 秒のクロスフェードで切り替え。ホバー・フォーカス中と画面外では止める
- **Experience:** 90% に減光、16:9、ホバーで 2 秒かけて 1.05 倍。下から `brand` へ溶かす
- **BOUTIQUE:** 30% に減光して全面背景に、上下を `brand` で締める

### Slide Indicator
- **Style:** 8px の白い円 (`slide-indicator`)、8px のタップ余白を持つボタン。非アクティブは 40%、ホバー 70%、アクティブは 100% で 1.25 倍。300ms で遷移
- **A11y:** `aria-current` とスライドタイトル + `(n/3)` を含むラベル

### Brand Dots
- **Style:** 3×3 グリッド、色順固定、各ドットにグロー。Loader では 9 個が 0.1 秒ずつずれて 0.5 秒で拡大しながら現れる
- **Usage:** Loader / Hero / Access の 3 箇所。他では使わない

### Footer
- **Style:** 上に `line-faint` の 1px 罫線、縦 32px、中央揃え、`footer-text` (`text-muted`、10px、字間 0.1em、`tabular-nums`)。文言は `© {年} Naji la boule. All Rights Reserved.`

### Loader
- **Style:** 全画面の `brand` 面 (z 70)。中央にブランドドット (lg) と、1 秒遅れて 1 秒で浮き上がる店名 (1.5rem、字間 0.3em)。2.5 秒表示して 1 秒の ease-in-out で退場。退場中に Hero の要素が順にフェードインし、退場完了と同時に揃う
- **Reduced motion:** 表示 0.5 秒、退場 0.5 秒

### Motion Grammar
- **標準のフェードイン:** 不透明度 0 → 1、必要なら y +30px → 0、1 秒、ease-out。セクションが画面に入ったら一度だけ再生し、文章側は画像側より 0.2 秒遅らせる
- **Hero の順序:** ドット (遅延 0.8s) → 見出し (1.0s、y +10px) → タグライン (1.5s)、各 2 秒。Loader 退場と重ねて完了させる
- **ホバー:** 色は 300ms、ボタンの反転は 500ms、写真の拡大は 2 秒。いずれも ease-out
- **イージング:** ease-out / ease-in-out のみ。スプリング、バウンス、オーバーシュートは使わない
- **Reduced motion:** CSS で全アニメーションと遷移を 0.01ms に短縮し、`scroll-behavior: auto` を強制。JS 駆動のフェードは遅延 0.3 秒 / 0.5 秒に置き換え、自動スライド送りは停止する

## Do's and Don'ts

### Do:
- **Do** すべての文字を Playfair Display / Shippori Mincho の明朝で組む。ウェイトは 400、Google Fonts の読み込みも 400 と 700 だけ
- **Do** 小ラベルは英字大文字で字間 0.1em 以上。主要カテゴリは仏語 (`RIZ` `SOUPE` `MARIAGE` `BOUTIQUE`)
- **Do** 本文は行間 2、字間 0.1em、色は `text-soft` か `text-muted`
- **Do** 写真は必ず減光し、`brand` へのグラデーションで下端を地に溶かす
- **Do** セクション余白は縦 96px / 160px、横 24px / 80px。迷ったら広い方
- **Do** 動きは 1 秒のフェード (不透明度、必要なら y +30px) を基本にし、ホバーは 300〜500ms
- **Do** `prefers-reduced-motion` を CSS と JS の両方で尊重する
- **Do** 数字は `tabular-nums`、約物は `’` `–` `…`、和文の引用は「」
- **Do** フォーカスリングは `accent` 2px / offset 2px を全リンク・ボタンに
- **Do** 暗背景の小さい文字は `text-muted` (≈ #99a1af) を下限にする
- **Do** 見出しは h1 を 1 ページに 1 つ (Hero)、各セクションの先頭を h2 にする

### Don't:
- **Don't** サンセリフを使わない。ラベルにも数字にも
- **Don't** 角丸を付けない。円形の要素とスクロールバー以外に `border-radius` は存在しない
- **Don't** `box-shadow` / `drop-shadow` を使わない。グローはブランドドットだけ
- **Don't** 静止状態の面を `accent` で塗らない。金はホバー・フォーカス・小ラベルの差し色
- **Don't** ブランドドットの 9 色を UI の意味色や装飾以外に転用しない
- **Don't** 写真を原色・全輝度で置かない
- **Don't** ハイフンでレンジを書かない (en dash を使う)。直線のアポストロフィを使わない
- **Don't** `text-muted` より薄い灰色 (Tailwind の gray-500 以下、≈ #6a7282 以下) を文字色に使わない。コントラスト比 4.5:1 を割る
- **Don't** 太字で強調しない。`font-weight: 300` も使わない
- **Don't** フェードを 1 秒より速くしない。スプリング・バウンス系のイージングを使わない
- **Don't** アイコンライブラリを入れない。矢印は `↗` の文字で
- **Don't** 768px 以外にブレークポイントを増やさない
- **Don't** 文言をコンポーネントに直書きしない。ja / en の両方を i18n データに置く (欧文の装飾ラベルと画像 alt は例外)
