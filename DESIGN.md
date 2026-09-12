---
version: alpha
name: Naji la boule
description: 銀座の和食店「Naji la boule」の公式サイトと姉妹ショップが共有する視覚言語。深い焦茶の闇に、ひと筋の金、明朝体だけの静謐。
colors:
  # キー名は LP の src/styles/tokens.css (--color-*) と一致させている。primary は DESIGN.md 仕様互換の別名で、値は accent と同一。
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
  # ドット 9 色は公式アイコン (public/favicon.svg) の値が正。黒ドットの縁取りは dot-white
  dot-red: "#E70012"
  dot-blue: "#00A0EA"
  dot-yellow: "#FFF100"
  dot-green: "#23AC38"
  dot-orange: "#E95412"
  dot-pink: "#E84191"
  dot-purple: "#611987"
typography:
  # fontSize は 768px 以上の値。モバイル値は本文 Typography の表を参照。
  display:
    fontFamily: Zen Old Mincho, serif
    fontSize: "3.5rem"
    fontWeight: 400
    lineHeight: 1.11
    letterSpacing: "0.2em"
  headline:
    fontFamily: Zen Old Mincho, serif
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.1em"
  title:
    fontFamily: Zen Old Mincho, serif
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0.1em"
  body:
    fontFamily: Zen Old Mincho, serif
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "0.1em"
    fontFeature: '"palt"'
  menu:
    fontFamily: Zen Old Mincho, serif
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0.1em"
  label:
    fontFamily: Zen Old Mincho, serif
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.1em"
  label-wide:
    fontFamily: Zen Old Mincho, serif
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.3em"
  caption:
    fontFamily: Zen Old Mincho, serif
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
  # 英語版を追加するまで非表示のコンポーネント (Header & Navigation 参照)
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
  # アイコン + ロゴの横並びロックアップ (BrandLockup)。size はヘッダー (768px 以上) の高さ
  brand-lockup:
    rounded: "{rounded.none}"
    size: "48px"
  footer-text:
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
---

<!--
  このファイルは Google Labs の DESIGN.md オープン仕様 (https://github.com/google-labs-code/design.md) に従う。
  - フロントマターのトークンが正 (normative)。本文はその使いどころと理由。
  - 検証: `npm run lint:design` (エラー 0 を維持する。orphaned-tokens 等の warning は許容)
  - トークンを変えたら LP の `src/styles/tokens.css` も同じ値に揃える (`npx -y @google/design.md@0.4.0 export --format dtcg DESIGN.md` で値を照合できる)
  - 許容している lint warning: orphaned-tokens (コンポーネント未参照のトークン)、button-filled の contrast-ratio (半透明背景を単体で計算する誤検知)
  - React 実装の個別レイアウト・モーション・振る舞いは docs/archive/lp-blueprint-react.md (旧 React 版の記録) に分離している
-->

# Design System: Naji la boule

## Overview

**Creative North Star: 「宵闇のカウンター (The Counter at Nightfall)」**

銀座の喧騒から一段降りた、灯りを落としたカウンター。深い焦茶の闇が面の大半を占め、そこに盃の縁のような金がひと筋だけ差す。声を張らず、行間で語る。このサイトは店の空気そのものを再現する装置であり、情報を並べる場所ではない。1 セクションが 1 画面ぶんの余白を持ち、写真は減光して地に溶かし、文字は明朝体だけで組む。動きはあるが、すべて「ゆっくり現れて、そこに留まる」だけで、跳ねたり滑ったりしない。

姉妹の Shopify ショップ (伊彌彦米の EC) も同じ世界観を共有する。ショップ側は Liquid テーマなので、このファイルのトークン値と Do's and Don'ts を手で移し替える (Tailwind は使わない)。

**Key Characteristics:**
- 面の基本は焦茶 (`brand` #241816) 一色。明度差ではなくノイズと放射グラデーションで奥行きを出す
- 差し色は金 (`accent` #C8A67B) のみ。ホバー・フォーカス・小ラベルに限って使い、面を塗らない
- 書体は Zen Old Mincho の 1 書体だけ (和文も欧文も)。サンセリフは存在しない
- ウェイトは 400 が既定。700 は言語スイッチのアクティブ表示にしか使わない
- 写真は必ず減光し (Hero 70% / 章 75〜80% / ACCÈS 30%)、下端を `brand` へ溶かすグラデーションを重ねる
- 角丸も影もない。ブランドの 9 色ドットだけが円形で、淡いグローをまとう
- 余白は広く。縦 96px / 160px、横 24px / 80px を標準とし、迷ったら広い方を選ぶ
- 動きは 1 秒のフェードが基本。`prefers-reduced-motion` を必ず尊重する

## Colors

パレットは「焦茶の階調 + 白の階調 + 金 1 色」で構成し、それ以外の彩度のある色はブランドドットの装飾にしか現れない。

### Primary
- **金 (`accent` / `primary`, #C8A67B)**: 唯一の差し色。ボタンのホバー反転面、リンクのホバー色、フォーカスリング (2px / offset 2px)、`MARMITE` `L’ATTENTE` `OBANZAI` `RIZ ET SOUPE` `BOUTIQUE` `ACCÈS` などの仏語小ラベル、言語スイッチのアクティブ表示に使う。静止状態の面を塗ることはない。

### Neutral
- **焦茶 (`brand`, #241816)**: 全体の背景。写真の下端を溶かすグラデーションの終点も同じ色。
- **深い焦茶 (`brand-dark`, #1f1513)**: body 背景の右下に落とすラジアルグラデーションの暗部。以前は Access の背景にも使ったが、2026-09-12 に写真背景へ替えた。
- **浮いた焦茶 (`brand-light`, #2a1d1b)**: body 背景の左上に差す微光の起点 (`accent` を 6% 混ぜる)。カードやホバー面にも使えるが、LP では背景以外に使っていない。
- **本文の白 (`text`, #f8f8f8)**: 見出し・本文・ボタン文字の既定色。純白 (#fff) は使わない。
- **やわらかい白 (`text-soft`, oklch(87.2% 0.01 258.338) ≈ #d1d5dc)**: 章 (壱〜四) と BOUTIQUE の本文。長めの段落を白より一段落として読ませる。
- **沈めた白 (`text-muted`, oklch(70.7% 0.022 261.325) ≈ #99a1af)**: タグライン、章番号 (壱弐参四)、仮写真の注記、`ADDRESS` `TEL` などのフィールドラベル、フッター。暗背景で許容するいちばん薄い文字色。
- **罫線の白 (`line-strong` 50% / `line` 20% / `line-faint` 5%)**: それぞれ outline ボタンの枠、BOUTIQUE の箱の枠 (filled ボタンの枠も同じ)、フッター上の区切り線。白のアルファで引き、実色の罫線は使わない。
- **スクロールバー (`scrollbar-thumb`, #443330)**: WebKit スクロールバーのつまみ。トラックは `brand`。

### Brand Dots (装飾専用)
白・黒・赤・青・黄・緑・橙・桃・紫の 9 色 (`dot-*`) は、公式アイコンの 3×3 ドットと、セクションに散らす微小な光点にだけ使う。UI の意味色 (成功・警告・リンクなど) に転用しない。値は公式アイコン (`public/favicon.svg`) が正。ページ内ではロックアップ (`BrandLockup`) の左側に同じ SVG (`src/assets/icon.svg`) を焦茶の四角ごと inline で置き、色は SVG 内の値をそのまま使う (グローや縁取りの加工はしない)。

### Named Rules
**The One Gold Rule.** 金は 1 画面のうちごく一部にしか現れない。CTA も静止時は白の罫線で、ホバーして初めて金に反転する。金が面として存在する時間は「触れている間」だけ。

**The Dimmed Photo Rule.** 写真をそのままの明るさで置かない。Hero は brightness 0.8 × 彩度 0.8 × 不透明度 0.7、章の写真は brightness 0.75 (壱・弐) / 0.8 (参・四)、ACCÈS の背景は brightness 0.3 × 彩度 0.7 に落とし、いずれも `brand` へのグラデーションで地に沈める。BOUTIQUE に写真は置かない。

## Typography

**Display / Body Font:** Zen Old Mincho (和文・欧文とも) → serif
**Label Font:** 同上。サンセリフの補助書体は導入しない。

**Character:** 和文も欧文も Zen Old Mincho の 1 書体で組み、古典的な明朝の静かな佇まいで銀座らしい格を出す。欧文書体を別に持たないので、和欧混植でも書体指定を切り替えない。`font-feature-settings: "palt"` を body に当て、和文のプロポーショナル詰めを常時有効にする。Google Fonts からは 400 と 700 だけを読み込む (フェイクボールド防止)。

### Hierarchy
右列はモバイル (768px 未満) の値。フロントマターの `typography` はデスクトップ値。

- **Display** (`display`, 400, 3.5rem / 行間 1.11 / 字間 0.2em): Hero の h1 だけ。**縦書き** (`writing-mode: vertical-rl`) で、高さに収めるため `min(display, 6.5vh)` を上限にし、行間 1.7 (= 2 列の間隔)。改行は文言側で明示する (右列「銀座の夜、」左列「米と汁を嗜む。」)。モバイル 2.25rem。
- **Headline** (`headline`, 400, 2.5rem / 1.2 / 0.1em): 章 (壱〜四) と BOUTIQUE の h2。章の h2 は縦書きで、2 列に分ける改行は文言側で明示する (「寄り添う、\n旬菜（しゅんさい）。」)。1 列 10 文字以内 (PC の高さ 448px に折り返さずに入る上限)。モバイル 1.875rem。
- **Title** (`title`, 400, 1.875rem / 1.625 / 0.1em): 現在の LP では未使用 (Philosophy を 2026-09-12 に廃止)。姉妹ショップで使えるようトークンは残す。モバイル 1.5rem。
- **Logo**: 店名は文字で組まず、ロゴ (`src/assets/logo.svg`、Iowan Old Style のワードマーク + Noto Sans JP Light のカナをアウトライン化した SVG) を、常に公式アイコンを左に添えた横並びロックアップ (`BrandLockup`) で置く。高さはヘッダー 48px / モバイル 28px (`--logo-height` / `--logo-height-mobile`)、Access の見出し (h2、ロゴが `role="img"`) 72px / 52px (`--logo-height-access*`)、Footer 40px (`--logo-height-footer`)。ロゴは `fill: currentColor` で置き場所の文字色を継ぐ (ヘッダー・Access は白、Footer は `text-soft`)。
- **Body** (`body`, 400, 1rem / 2 / 0.1em): 本文。行間 2 は意図的に広い。モバイル 0.875rem (行間はそのまま)。章の本文は縦書きで、行間 2 が列の間隔になる。1 行 23 文字以内 (高さ 420px に折り返さずに入る上限)。
- **Menu** (`menu`, 400, 0.875rem / 1.43 / 0.1em): デスクトップナビ、ボタン文字 (md / lg)。
- **Label** (`label`, 400, 0.75rem / 1.33 / 0.1em): 言語スイッチ、章番号 (壱弐参四、`text-muted`)、仮写真の注記 (figcaption)、`ADDRESS` `TEL` `HOURS` のフィールドラベル、sm ボタン、営業時間の注記。
- **Label Wide** (`label-wide`, 400, 0.75rem / 1.33 / 0.3em): `MARMITE` `L’ATTENTE` `OBANZAI` `RIZ ET SOUPE` (章番号の右に添える) と `BOUTIQUE` `ACCÈS` のセクションラベル。金。
- **Caption** (`caption`, 400, 10px / 1.5 / 0.1em): フッターの著作権表記のみ。

### 数字と約物
- 電話番号・営業時間・年号は `font-variant-numeric: tabular-nums` を数字を含む要素に直接付ける (継承に頼らず、数字を含む要素に直接)
- アポストロフィは曲線 `’`、レンジは en dash `–` (`18:30 – 23:30`)、三点リーダーは `…`
- 引用符は和文で「」、欧文で曲線の “ ”
- 体言止め + 読点のブランド語感 (「一釜、一膳。」「待つという、贅沢。」「そして、一膳。」) を新規コピーでも維持する。章には漢数字の章番号 (壱弐参四) と仏語の小ラベルを添える

### Named Rules
**The Serif-Only Rule.** すべての文字が明朝体。ラベルも数字もボタンも例外はない。

**The Tone-Not-Weight Rule.** 強調は太さではなく色のトーンで行う。「軽さ」は `text-soft` / `text-muted` と行間 2 で表現し、`font-weight: 300` は使わない。700 を使うのは言語スイッチのアクティブ表示だけ。

**The Tracking Floor Rule.** 字間 0.1em (`tracking-widest`) が下限。詰めた字間は存在しない。

## Layout

**単一ブレークポイント (+ ナビだけ 1 本)。** レスポンシブの分岐は 768px (`md`) の 1 本だけ。モバイルは 1 カラム縦積み、768px 以上で 2 カラムに開く。中間段階は作らない。唯一の例外はヘッダーのナビリンク 5 本で、ロックアップ + リンク 5 本 + RESERVATION が 768〜1023px に収まらないため 1024px (`64rem`) 以上で表示する (`Header.astro` のみ)。

**セクションの余白。** 縦 96px (`section-y`) / 160px (`section-y-md`)、横 24px (`section-x`) / 80px (`section-x-md`)。Hero は `100vh`。章 4 つは 1 つの列 (padding 縦 section-y / 横 section-x) に `card-gap` で並べ、BOUTIQUE はその直後なので上の余白は 0。「1 セクション = 1 画面ぶんの余白」が基準。

**コンテナ幅。** 標準は 80rem (1280px) 中央寄せ。BOUTIQUE のように文章だけのセクションは 48rem (768px) に絞る。ACCÈS のフィールド 3 列は 56rem。

**2 カラムの比率。** 章は写真 60 : 文章 40 (`flex: 60 1 0` / `40 1 0`、下限 300px、間 64px) で左右を交互に反転 (壱・参は写真左、弐・四は写真右。写真が右のときは文章列を右寄せ)。Access のフィールドは 200px 下限の auto-fit グリッド (1〜3 列、間 32px × 48px)。

**モバイルの画像の扱い。** 章は wrap で 1 列に積む。写真 (4:3) → 文章の順で、写真が右の章 (`row-reverse`) でも写真が上に来る。文章の縦書きブロックはモバイルでも縦書きのまま (高さ 420px)。

**固定ヘッダー。** 上端固定、余白 24px (768px 以上で 40px)、`brand` 90% → 透明の下向きグラデーションと 2px の背景ぼかしで写真の上に浮かせる。ブランドのアンカーは `flex-shrink: 0` で潰れないようにする。ナビリンク 5 本 (Concept · Saké · Obanzai · Boutique · Access) は 1024px 以上だけで、それ未満は右上に RESERVATION ボタンだけを置く。

**縦の積み方。** 見出し下 32px (`stack`)、段落下 32〜48px (`stack` / `stack-lg`)、地図など補助要素の上 64px (`stack-xl`)。章の間は 96px / 128px (`card-gap` / `card-gap-md`)。章の中は、ラベル行 → 縦書きブロックの間 40px、縦書きの h2 → 本文の間 40px (列の間隔)。

## Elevation & Depth

**影は使わない。** `box-shadow` も `drop-shadow` も UI には存在しない。奥行きは次の 3 つだけで作る。

1. **体の背景 3 層。** ベースの `brand` の上に、240px タイルの SVG フラクタルノイズ (`soft-light` 合成、不透明度 0.7) を敷き、左上から `accent` 6% を混ぜた `brand-light` の楕円グラデーション、右下から `brand-dark` の楕円グラデーションを差す。3 層とも `background-attachment: fixed`。
2. **写真の減光とグラデーション。** 写真は Dimmed Photo Rule で暗くし、その上に `brand` へ溶けるグラデーションを重ねる。Hero は上 70% → 45% 地点で 20% → 下 100%、章は下から 100% → 45% 地点で透明 (全体 60%)、ACCÈS は上下 100% で中央 40%。
3. **背景ぼかし。** ヘッダーは 2px のバックドロップフィルタで、下の写真を感じさせながら読みやすさを確保する。

**唯一の発光。** ブランドドットだけが `0 0 10px` のグローを持つ (白ドット 50%、色ドット 30%、黒ドットはグローなし)。セクションに散らす光点は 1px のぼかしで滲ませる。

**レイヤー順序。** Hero の写真 0 < Hero の文字 10 < ヘッダー 40。全画面のオーバーレイは持たない。

### Named Rules
**The Flat-Dark Rule.** 面は平らで、影で持ち上げない。手前にあるものは「暗い地に対して明るい」のではなく「地と同じ色で、光だけが違う」。

## Shapes

**角は直角。** ボタン、写真、カード、iframe、すべて `border-radius: 0`。角丸は円形の要素 (ブランドドット、装飾の光点) と WebKit スクロールバーのつまみ (4px) にしか現れない。

**線は 1px。** ボタンの枠、BOUTIQUE の箱の枠 (`line`)、フッターの区切りは、いずれも 1px の細線。太い罫線や塗りの分割線はない。

**写真の比率。** 章の写真は 4:3 (`aspect-ratio: 4 / 3`)、Hero と ACCÈS の背景は画面いっぱいに `object-fit: cover` (Hero は `object-position: 40% 55%`、ACCÈS は `30% 40%`)。地図の iframe は高さ 320px で `grayscale(100%) brightness(0.85)`。

**アイコンは持たない。** アイコンフォントも SVG アイコンセットも使わない。外部リンクの印は文字の `↗`。

**ブランドモチーフ。** 3×3 の 9 ドット (白・黒・赤 / 青・黄・緑 / 橙・桃・紫 の順) が唯一の図形要素で、公式アイコンの中にだけ現れる (Brand Lockup 参照)。ページ内に単独のドットは置かない。

## Components

### Buttons
- **Shape:** 直角、1px の枠、字間 0.1em、文字は `RESERVATION` のように英字大文字
- **Outline (`button-outline`):** 透明地に `line-strong` (白 50%) の枠、文字は `text`。ホバーで地・枠ともに `accent`、文字は `brand` に反転
- **Filled (`button-filled`):** 白 5% の地に `line` (白 20%) の枠。ホバーで地が白、文字が `brand`。現在の LP では未使用 (Access の予約ブロックを 2026-09-12 に廃止。予約導線はヘッダーの RESERVATION だけ)
- **Sizes:** sm 8px × 24px / 0.75rem (ヘッダー)、md 12px × 32px / 0.875rem (BOUTIQUE、横 40px)、lg 16px × 32px / 0.875rem (未使用)
- **Transition:** 背景色・枠色・文字色を 500ms で同時に遷移
- **Focus:** `accent` 2px のアウトライン、offset 2px (全リンク・ボタン共通)

### Header & Navigation
- **Desktop:** 左にアイコン + ロゴのロックアップ (高さ 48px)、右にナビリンク 5 本 (Concept · Saké · Obanzai · Boutique · Access → `#concept #sake #obanzai #shop #access`、`nav-link`、ホバーで `accent` へ 300ms、**1024px 以上だけ**) と sm の Outline ボタン。ブランドのアンカーは `flex-shrink: 0`。ヘッダーは開演の最後 (遅延 1.4s) に 1 秒でフェードイン
- **Mobile:** ロックアップは高さ 28px (RESERVATION ボタンと並べて 375px に収める)。1024px 未満はリンクを省き、右上に sm の Outline ボタンだけを置く。ハンバーガーメニューは持たない (各セクションへはスクロールで届く)
- **Language Switch:** 英語版を追加するまで非表示。追加時は `JP | EN` の静的リンク (0.75rem、字間 0.1em、アクティブは `accent` + 700 + 1px 下線) をナビの右に置く

### Section Label + Heading
- **Pattern:** `label-wide` の仏語ラベル (`BOUTIQUE` `ACCÈS`) を `accent` で置く。BOUTIQUE は 8px 下に `headline` の h2、32px 下に本文。ACCÈS は 24px 下に h2 としてアイコン + ロゴのロックアップ (高さ 72px、モバイル 52px)、64px 下にフィールド
- **Chapter Kicker:** 章は漢数字の章番号 (`label`、`text-muted`) と仏語ラベル (`label-wide`、`accent`) を baseline 揃えで 16px 空けて横に並べ、40px 下に縦書きブロック (`writing-mode: vertical-rl`、高さ 420px、48rem〜は `clamp(448px, 34vw, 468px)`。h2 が右、本文が左、間 40px)。写真が右の章では右寄せ
- **Field Label:** Access の `ADDRESS` `TEL` `HOURS` は `field-label` (`text-muted`、0.75rem、字間 0.1em) で、4px 下に値

### Photo Treatment
- **Hero:** `object-fit: cover` (`40% 55%`)、brightness 0.8 × 彩度 0.8、不透明度 0.7、20 秒かけて 1.1 → 1.2 倍にゆっくりズームし往復 (無限)。上に `brand` 70% → 20% (45% 地点) → 100% のグラデーション
- **Chapter (壱〜四):** 4:3 (`aspect-ratio: 4 / 3`)、brightness 0.75 (壱・弐) / 0.8 (参・四)、ホバーで 2 秒かけて 1.05 倍。下から `brand` → 透明 (45% 地点) を不透明度 0.6 で重ねる。参 (おばんざい) は仮写真で、figcaption (`label`、`text-muted`、上 12px) に注記を添える (正式写真が入ったら外す)。写真は章ごとに複数枚 (5 枚まで) 登録でき、2 枚以上のときは 1 秒表示 → 0.4 秒のクロスフェードで順に見せる (Motion Grammar「章の写真スライドショー」)。位置と減光は章の全写真に共通
- **ACCÈS:** brightness 0.3 × 彩度 0.7 で全面背景に (`30% 40%`)、上下を `brand` で締める (中央 40%)
- **BOUTIQUE:** 写真は置かない。`line` の 1px 枠で囲った 48rem の箱 (padding 縦 `clamp(48px, 8vw, 96px)` × 横 section-x)

### Brand Lockup (アイコン + ロゴ)
- **Style:** 公式アイコン SVG (焦茶の四角 + 3×3 ドット) を左、ロゴを右に同じ高さで横並び。間隔は高さの 0.3 倍。アニメーションは付けない (2026-09-12 のユーザー指示。必要になったら指示がある)
- **Usage:** ヘッダー (リンク、48px / 28px)、Access の見出し (h2、72px / 52px)、Footer (40px) の 3 箇所。Hero には置かない (h1 とタグラインだけ)

### Footer
- **Style:** 上に `line-faint` の 1px 罫線、上 64px / 下 32px、中央揃え。アイコン + ロゴのロックアップ (高さ 40px、ロゴの色は `text-soft`) を置き、32px 下に `footer-text` (`text-muted`、10px、字間 0.1em、`tabular-nums`)。文言は `© {年} Naji la boule. All Rights Reserved.`

### Motion Grammar
- **開演 (ページ表示時):** 写真が 0.15 → 0.7 に 1.2s で明るくなり、縦書きの見出し (遅延 0.5s、y +10px、1s) → タグライン (0.9s、1s) → ヘッダー (1.4s、1s) の順に現れる。Hero にアイコンは置かない (2026-09-12 に撤去)。合計約 2.4s、ブロッキングしない
- **スクロール時の浮き上がり:** `animation-timeline: view()` で、要素が視界に入る区間 (entry 0% → 40%) に不透明度 0 → 1、y +30px → 0。`@supports` で段階適用し、非対応では常時表示
- **ホバー:** 色は 300ms、ボタンの反転は 500ms、写真の拡大は 2 秒。いずれも ease-out
- **章の写真スライドショー:** 写真を 2 枚以上登録した章は、各写真を 1 秒見せ、次の写真が 0.4 秒 (ease-in-out) で上に溶けて現れる (1 枚あたり 1.4 秒周期、無限ループ)。前の写真は次が現れきってから消すので、両方が半透明になって焦茶が透ける瞬間はない。ホバー中は止まる (写真の拡大と同時に働く)。JS は使わず、枚数ごとの keyframes (2〜5 枚) で組む
- **イージング:** ease-out / ease-in-out のみ。スプリング、バウンス、オーバーシュートは使わない
- **Reduced motion:** 全 animation / transition を無効化し、`scroll-behavior: auto` を強制。即時表示にする。章のスライドショーは 1 枚目を静止表示
- **JS を使わない:** 動きは CSS だけで書く。JS でしか作れない動きは採用しない

## Do's and Don'ts

### Do:
- **Do** すべての文字を Zen Old Mincho の明朝で組む。ウェイトは 400、Google Fonts の読み込みも 400 と 700 だけ。例外はロゴだけ (アウトライン化した SVG なので書体を読み込まない)
- **Do** 小ラベルは英字大文字で字間 0.1em 以上。主要カテゴリは仏語 (`MARMITE` `L’ATTENTE` `OBANZAI` `RIZ ET SOUPE` `BOUTIQUE` `ACCÈS`)
- **Do** 本文は行間 2、字間 0.1em、色は `text-soft` か `text-muted`
- **Do** 写真は必ず減光し、`brand` へのグラデーションで下端を地に溶かす
- **Do** セクション余白は縦 96px / 160px、横 24px / 80px。迷ったら広い方
- **Do** 動きは 1 秒のフェード (不透明度、必要なら y +30px) を基本にし、ホバーは 300〜500ms
- **Do** `prefers-reduced-motion` を CSS で尊重する (全 animation / transition を無効化)
- **Do** 数字は `tabular-nums`、約物は `’` `–` `…`、和文の引用は「」
- **Do** フォーカスリングは `accent` 2px / offset 2px を全リンク・ボタンに
- **Do** 暗背景の小さい文字は `text-muted` (≈ #99a1af) を下限にする
- **Do** 見出しは h1 を 1 ページに 1 つ (Hero)、各セクションの先頭を h2 にする
- **Do** 動きは CSS だけで書き、`@supports` と reduced-motion で段階的に落とす
- **Do** 縦書き (`writing-mode: vertical-rl`) は Hero の h1 と章の見出し・本文だけに使う。列の区切りは文言側の `\n` で明示し、見出しは 1 列 10 文字以内、本文は 1 行 23 文字以内に収める

### Don't:
- **Don't** サンセリフを使わない。ラベルにも数字にも
- **Don't** 角丸を付けない。円形の要素とスクロールバー以外に `border-radius` は存在しない
- **Don't** `box-shadow` / `drop-shadow` を使わない。グローはブランドドットだけ
- **Don't** 静止状態の面を `accent` で塗らない。金はホバー・フォーカス・小ラベルの差し色
- **Don't** ブランドドットの 9 色を UI の意味色や装飾以外に転用しない
- **Don't** 写真を原色・全輝度で置かない
- **Don't** ハイフンでレンジを書かない (en dash を使う)。直線のアポストロフィを使わない
- **Don't** `text-muted` より薄い灰色 (≈ #6a7282 以下) を文字色に使わない。コントラスト比 4.5:1 を割る
- **Don't** 太字で強調しない。`font-weight: 300` も使わない
- **Don't** フェードを 1 秒より速くしない。スプリング・バウンス系のイージングを使わない
- **Don't** アイコンライブラリを入れない。矢印は `↗` の文字で
- **Don't** 768px 以外にブレークポイントを増やさない (例外はヘッダーのナビリンクを出す 1024px だけ)
- **Don't** 文言をコンポーネントに直書きしない。ja / en の両方を i18n データに置く (欧文の装飾ラベルと画像 alt は例外)
- **Don't** 配信 JS を増やさない。アニメーションライブラリも入れない
