<!-- 出典: ~/Downloads/design_handoff_lp_b/README.md (2026-09-12 受領)。デザイン見本 LP-B.dc.html と同梱画像はリポジトリに含めず、画像は src/assets/images/{hero,chapters,access}/ に配置した。本文は受領時のまま -->

# Handoff: Naji la boule LP 新構成（B案「献立」）

対象リポジトリ: `atimot/najilaboule`（Astro 7 + 素の CSS + TypeScript、配信 JS ゼロ）
このフォルダの `LP-B.dc.html` は **HTML で作ったデザインリファレンス**です。そのまま配信するものではなく、リポジトリの既存の書き方（`src/components/*.astro` + scoped `<style>`、`src/content/ja.ts` の文言、`src/styles/tokens.css` のトークン、`<Picture>` による画像最適化）で**作り直す**ためのお手本です。

忠実度: **hifi**。色・書体・余白・比率は最終値なので、そのまま再現してください。トークンはすべて既存の `tokens.css` / `DESIGN.md` の値です（新しい色・書体は増やしません）。

---

## 1. 全体構成（上から順）

| # | セクション id | 役割 | 新規 / 流用 |
|---|---|---|---|
| 0 | `header` | 固定ヘッダー（ロックアップ + ナビ + RESERVATION） | Header.astro を改修（ナビ更新） |
| 1 | `#top` | ヒーロー。炎の写真、**縦書き**の h1、仏語タグライン | Hero.astro を改修 |
| 2 | `#concept` | 壱 MARMITE「一釜、一膳。」 | 新規（Chapter コンポーネント） |
| 3 | `#sake` | 弐 L’ATTENTE「待つという、贅沢。」 | 新規（Chapter） |
| 4 | `#obanzai` | 参 OBANZAI「寄り添う、おばんざい。」 | 新規（Chapter） |
| 5 | `#riz` | 四 RIZ ET SOUPE「そして、一膳。」 | 新規（Chapter） |
| 6 | `#shop` | BOUTIQUE。枠線つきの中央寄せ + ONLINE SHOP ボタン | Boutique.astro を改修（背景写真なし） |
| 7 | `#access` | ACCÈS。写真を背景に、ロックアップ h2 + 住所/電話/営業時間 + Google マップ | Access.astro を改修（予約ブロックは削除） |
| 8 | `footer` | 現行のまま | Footer.astro そのまま |

削除するもの: Philosophy.astro、Experience.astro（3 カード）、Access の RESERVATION ブロック（見出し・注記・filled ボタン）、Boutique の背景写真。

---

## 2. 文言（`src/content/ja.ts` に置く。ハードコード禁止）

改行 `\n` は現行どおり `white-space: pre-line` で表示。

```ts
hero: {
  title: '銀座の夜、\n米と汁を嗜む。',            // 現行のまま
  tagline: 'Riz et Soupe, et un peu d’alcool.', // 現行のまま
},
chapters: {
  concept: {
    number: '壱', label: 'MARMITE',
    title: '一釜、一膳。',
    body: 'ご注文のあとに火を入れ、一釜ずつ炊き上げます。\n蓋を開けた瞬間の湯気と、粒の艶。\n炊きたてのお米を、そのままお楽しみください。',
  },
  sake: {
    number: '弐', label: 'L’ATTENTE',
    title: '待つという、贅沢。',
    body: '釜が湯気を上げるまでの、ひととき。\nただの待ち時間ではなく、銀座の夜の余白です。\n盃を傾けながら、ゆっくりとお過ごしください。',
  },
  obanzai: {
    number: '参', label: 'OBANZAI',
    title: '寄り添う、\nおばんざい。',           // 縦書きで 2 列になる改行。必須
    body: '盃の肴に、炊きたての米の相手に。\n季節の素材を、小鉢にひとつずつ仕立てました。\nお好みのものを、お好きなだけ。',
    note: '※ 仮写真（正式な写真に差し替え予定）', // 正式写真が入ったら削除
  },
  riz: {
    number: '四', label: 'RIZ ET SOUPE',
    title: 'そして、一膳。',
    body: '釜で炊きあがったお米を、心ゆくまで。\nおばんざいと、備え付けの汁を添えて。\n銀座の夜の締めくくりに、静かな一膳を。',
  },
},
boutique: {
  title: 'この一粒を、\nご自宅へ。',
  body: '当店のお米は、オンラインショップでもお求めいただけます。\n店で出会った味を、ご家庭の食卓でも。',
  ctaAriaLabel: 'オンラインショップ（外部サイト・新しいタブで開きます）',
},
access: {
  label: 'ACCÈS',
  address: '東京都中央区銀座6-12-12\n銀座ステラビル2階',   // 現行のまま
  hoursMain: '営業時間 18:30 – 23:30',                    // 現行のまま（en dash）
  hoursClosed: '定休日 土日祝日',                          // 現行のまま
  mapTitle: '店舗の地図 — 東京都中央区銀座6-12-12 銀座ステラビル2階',
},
header: { nav: { concept: 'Concept', sake: 'Saké', obanzai: 'Obanzai', shop: 'Boutique', access: 'Access' } },
```

欧文の装飾ラベル（MARMITE / L’ATTENTE / OBANZAI / RIZ ET SOUPE / BOUTIQUE / ACCÈS / RESERVATION / ONLINE SHOP / ADDRESS / TEL / HOURS）と章番号（壱弐参四）は現行ルールどおりコンポーネント直書きでも可。ただし **Zen Old Mincho のサブセットは `ja.ts` / `config.ts` / `alts.ts` から字形を集める**ので、和文（壱弐参四・※注記）は必ず `ja.ts` に置くこと。`È` `’` `–` も `ja.ts` 経由で確実にサブセットへ入れる。

`SITE.riceShopUrl` は差し替え予定（未確定）。確定まで現行の URL のままで構いません。

---

## 3. 画像（`src/assets/images/` に追加、`images.ts` / `alts.ts` に登録）

| 用途 | ファイル（この handoff の `images/`） | 表示比率 | 減光 | alt (ja) |
|---|---|---|---|---|
| ヒーロー背景 | `najila_top2.jpg` | 全画面 cover、`object-position: 40% 55%` | `saturate(0.8) brightness(0.8)`、opacity 0.7、上に勾配 | ''（装飾） |
| 壱 コンセプト | `najila_top3.jpg` | **4:3** cover、`object-position: 50% 50%` | `brightness(0.75)` + 下勾配 | 湯気を上げる釜 |
| 弐 お酒 | `najila_top12.jpg` | 4:3 cover、`50% 50%` | `brightness(0.75)` + 下勾配 | カウンターに置かれたグラスの酒 |
| 参 おばんざい（仮） | `obanzai_smp.jpg` | 4:3 cover、`50% 45%` | `brightness(0.8)` + 下勾配 | 小鉢に盛られたおばんざい |
| 四 炊きあがり | `najila_top7.jpg` | 4:3 cover、`50% 50%` | `brightness(0.8)` + 下勾配 | 釜で炊きあがったご飯と備え付けの汁 |
| ACCÈS 背景 | `najila_map1.jpg` | 全幅 cover、`object-position: 30% 40%` | `brightness(0.3) saturate(0.7)` + 上下勾配 | ''（装飾） |

同梱の JPEG は長辺 2000px に縮小済み。原寸（6000px）はユーザーの `tmp/najila_top/` にあるので、そちらを `src/assets/images/` に置き `<Picture formats={['avif','webp']} widths={[800,1600]}>` に任せてよい。ヒーローは現行どおり `widths=[800,1600,2400]` + `priority` + `<head>` の AVIF preload。

「下勾配」= `linear-gradient(to top, var(--color-brand), transparent 45%)` を `opacity: 0.6` で重ねる（現行 Experience の `.card__frame::after` の派生）。

---

## 4. セクション仕様

共通: 書体は `var(--font-serif)` のみ、ウェイト 400、角丸・影なし。トークン名は `tokens.css` のもの。フォールバックの実測値を括弧で併記。

### 4.0 Header（Header.astro 改修）
- 現行の見た目・動き（fixed / 勾配 / blur 2px / 1.4s 遅延フェードイン / ロックアップ 28px→48px）はそのまま。
- ナビのリンクを `Concept · Saké · Obanzai · Boutique · Access` の 5 本に（`#concept #sake #obanzai #shop #access`）。書式は現行 `.nav__link`（menu 0.875rem / 字間 0.1em / hover accent 300ms）。
- **ブランドのアンカーに `flex-shrink: 0`** を付ける（ロックアップが潰れて重なるのを防ぐ）。
- リンク 5 本 + RESERVATION はロックアップと合わせて 768〜1023px に収まらないため、**リンク群は 1024px 以上で表示**（`@media (min-width: 64rem)`）。それ未満は現行どおり RESERVATION ボタンのみ。CLAUDE.md の「ブレークポイントは 768px の 1 本」と衝突するので、`64rem` を追加する旨を CLAUDE.md / DESIGN.md Layout に追記するか、リンクを減らして 768px に収めるかを判断してください（デザインの意図は「5 本を 1024px 以上で」）。

### 4.1 Hero（Hero.astro 改修）
- `height: 100vh`、写真は上記の減光 + 勾配 `linear-gradient(to bottom, color-mix(in srgb, var(--color-brand) 70%, transparent), color-mix(in srgb, var(--color-brand) 20%, transparent) 45%, var(--color-brand))`。開演アニメーションは現行のもの（`hero-photo-in` は 0.15 → **0.7**、slow-zoom 20s）。
- **h1 は縦書き**: `writing-mode: vertical-rl`。コンテナ（`max-width: 80rem`、横 padding は section-x）の**右端**に置き、右余白 `clamp(0px, 6vw, 96px)`。
  - display サイズだが高さに収めるため `font-size: min(var(--text-display*), 6.5vh)`（モバイル 2.25rem / md 3.5rem を上限）、`line-height: 1.7`（= 2 列の間隔）、`letter-spacing: 0.2em`。改行は文言側の `\n`（縦書きでは右列「銀座の夜、」左列「米と汁を嗜む。」）。
  - `rise-in 1s ease-out 0.5s both`（現行と同じ）。
- タグラインは**横書き**で左下に絶対配置: `left: section-x`、`bottom: clamp(48px, 10vh, 96px)`、body サイズ（0.875rem / md 1rem）、行間 2、字間 0.1em、`text-muted`、`fade-in 1s 0.9s`。

### 4.2 Chapter（新規 `Chapter.astro`。4 回使う）
外側: 4 章を縦に並べるラッパー `display: flex; flex-direction: column; gap: var(--space-card-gap)`（96px / md 128px）、padding `section-y section-x`（96px 24px / md 160px 80px）。各章は `max-width: 80rem; margin-inline: auto`。

1 章のレイアウト（`display: flex; flex-wrap: wrap; align-items: center; gap: 64px`）:
- **写真**: `flex: 60 1 0; min-width: min(100%, 300px)`。枠は `aspect-ratio: 4 / 3; overflow: hidden`。img は cover + 上記減光、`transition: scale 2s`、hover で `scale: 1.05`（現行 Experience と同じ）。おばんざいのみ `figcaption`（label 0.75rem / 1.33 / 字間 0.1em / text-muted、上 12px）に仮写真注記。
- **文章列**: `flex: 40 1 0; min-width: min(100%, 300px); display: flex; flex-direction: column; gap: 40px`。
  - 章番号 + ラベル行: `display: flex; align-items: baseline; gap: 16px`。番号「壱」= label 0.75rem / 1.33 / 字間 0.1em / `text-muted`。ラベル「MARMITE」= label-wide 0.75rem / 1.33 / **字間 0.3em** / `accent`。
  - **縦書きブロック**: `writing-mode: vertical-rl; height: clamp(420px, 34vw, 440px); display: flex; flex-direction: column; gap: 40px`（vertical-rl では column = 右→左に並ぶ。h2 が右、本文が左）。
    - h2: headline 1.875rem / md 2.5rem、行間 1.2、字間 0.1em。
    - p: body 0.875rem / md 1rem、**行間 2（= 列間隔）**、字間 0.1em、`text-soft`、`pre-line`。本文 1 行は 23 文字以内に収めているので 420px で折り返さない。文言を変えるときはこの制約を守る。
- **左右の交互**: 壱・参は写真が左（通常の `row`）、弐・四は写真が右（`flex-direction: row-reverse`）。弐・四は文章列を `align-items: flex-end`（ラベル行と縦書きブロックを右寄せ）。
- モバイル（wrap して 1 列）: 写真 → 文章の順に積む。`row-reverse` でも wrap で写真が上に来る。
- 表示アニメーション: 写真と文章列それぞれに現行 `.reveal`（`animation-timeline: view()`、entry 0%→40%）。

### 4.3 Boutique（Boutique.astro 改修）
- 背景写真なし。セクション padding は上 0 / 左右 section-x / 下 section-y。
- 内箱: `max-width: 48rem; margin-inline: auto; padding: clamp(48px, 8vw, 96px) section-x; border: 1px solid var(--color-line)`（白 20%）、中央揃え、`.reveal`。
- 中身は現行と同じ並び: label-wide「BOUTIQUE」(accent) → 8px → h2 headline → 32px → 本文 body / 行間 2 / `text-soft` → 48px → Outline ボタン md（`padding-inline: 40px`）「ONLINE SHOP ↗」`external`。

### 4.4 Access（Access.astro 改修）
- `position: relative; overflow: hidden`、背景に `najila_map1.jpg`（brightness 0.3 / saturate 0.7）+ 勾配 `linear-gradient(to bottom, var(--color-brand), color-mix(in srgb, var(--color-brand) 40%, transparent), var(--color-brand))`（現行 Boutique の背景の作り）。`background: var(--color-brand-dark)` は不要。
- 中身（`max-width: 80rem`、中央揃え、z-index 1）:
  1. label-wide「ACCÈS」(accent) → 24px → h2 = 現行どおり `<BrandLockup label>`（72px / モバイル 52px）。下 64px。
  2. フィールド 3 列: `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 32px 48px; max-width: 56rem; margin: 0 auto 64px`。各セルは現行 `.field__label`（ADDRESS / TEL / HOURS）+ 値。TEL は `tel:` リンク、`tabular-nums`、hover accent。HOURS の定休日は現行 `.field__note`。
  3. Google マップ iframe: 現行と同じ src、**高さ 320px**、`filter: grayscale(100%) brightness(0.85)`（世界観に沈める）。
- 削除: RESERVATION ラベル / 「ご予約」/ 注記 / filled ボタン。予約導線はヘッダーの RESERVATION ボタンのみ。

### 4.5 Footer
現行 Footer.astro のまま。

---

## 5. トークン（すべて既存）

色: brand `#241816`、brand-dark `#1f1513`、brand-light `#2a1d1b`、accent `#C8A67B`、text `#f8f8f8`、text-soft `oklch(87.2% 0.01 258.338)`、text-muted `oklch(70.7% 0.022 261.325)`、line-strong `rgba(255,255,255,.5)`、line `rgba(255,255,255,.2)`、line-faint `rgba(255,255,255,.05)`。
文字: display 3.5rem/2.25rem・1.11・0.2em、headline 2.5rem/1.875rem・1.2・0.1em、body 1rem/0.875rem・2・0.1em、menu 0.875rem・1.43、label 0.75rem・1.33・0.1em、label-wide 字間 0.3em、caption 10px。
余白: section-x 24/80、section-y 96/160、stack 32、stack-lg 48、stack-xl 64、card-gap 96/128。
動き: fade/rise 1s ease-out、hover 300ms、ボタン 500ms、写真 hover 2s、`prefers-reduced-motion` で全停止。

新しく使う CSS（DESIGN.md に追記推奨）: `writing-mode: vertical-rl`（Hero h1 と Chapter の見出し・本文）、`aspect-ratio: 4 / 3`（Chapter 写真）、Boutique の 1px `line` 枠、Access の地図 `grayscale`。

---

## 6. 受け入れチェック
- `npm run lint` / `npm run build`（verify-dist: 配信 JS ゼロ、h1 が 1 つ、外部フォントなし）が通る。
- 1280px でこの handoff の `LP-B.dc.html`（ブラウザで直接開ける）と見比べて、各章の写真 4:3・縦書き 2 ブロック・左右交互が一致する。
- 縦書きの見出しが列の途中で折れない（おばんざいは 2 列）。本文は各行 1 列に収まる。
- 375px で 1 列に積まれ、ヘッダーは RESERVATION のみ。1024px 以上でナビ 5 本が出る。
- 「reduced motion」で動きが止まる。
