# LP 移植ブループリント (React → Astro)

> **退役済み (2026-09-10)**: 旧 React 版 (コミット 76ac9d2) の記録。Astro 版は `docs/superpowers/specs/2026-09-10-astro-rebuild-design.md` の §13 / §14 で照合済み。現行の決め事は `DESIGN.md` を参照。

**抽出元**: React 実装 コミット `76ac9d2` (2026-09-10 時点の `main`)
**用途**: Astro 版を「見た目・動き・振る舞い」の全てで現行と一致させるための照合仕様。[`DESIGN.md`](../../DESIGN.md) が「なぜ・どう使うか」を持つのに対し、この文書は「現行実装が何をしているか」を Tailwind クラスと数値でそのまま写す。
**寿命**: Astro 版が末尾のチェックリストを全て満たしたら `docs/archive/` へ移すか削除する。恒久的な決め事は `DESIGN.md` に書き、ここには足さない。

前提: Astro 版でも Tailwind v4 を継続する (2026-09-10 決定)。したがって本書のクラス文字列は `.astro` にそのまま貼れる。変わるのは motion ライブラリ (JS 駆動アニメーション) と React の状態管理だけで、それぞれ §13 と §14 に CSS / 素の JS で再現する指針を置く。

---

## 1. ページ骨格

### 1.1 `<html>` / `<head>` / `<body>`

| 項目 | 値 |
|---|---|
| `<html>` | `lang="ja"` (言語切替で `ja` / `en` に同期) `class="dark"` `style="color-scheme: dark"` |
| `<body>` | `class="antialiased"` |
| theme-color | `#241816` |
| フォント | `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=Playfair+Display:wght@400;700&display=swap` + `preconnect` を `fonts.googleapis.com` / `fonts.gstatic.com` (crossorigin) に |
| Hero 画像 preload | `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="…/hero/background-800.webp 800w, …-1600.webp 1600w, …-2400.webp 2400w" imagesizes="100vw">` |
| favicon | `favicon-32x32.png` / `favicon-16x16.png` / `apple-touch-icon.png` (180) / `site.webmanifest` |
| SEO | `<title>Naji la boule | Ginza</title>`、canonical、hreflang (ja / en=`?lang=en` / x-default)、OGP (`images/ogp.jpg` 1200×630)、`twitter:card=summary_large_image`、JSON-LD `Restaurant` (index.html から移植) |
| noscript | 店名・住所・電話を静的に表示 (index.html の `<noscript>` を移植) |

### 1.2 DOM の順序と z-index

```
<Loader>                                   fixed inset-0 z-[70]
<div inert={loading} aria-hidden={loading}>
  <header>                                 fixed top-0 z-40
  <HamburgerButton>                        fixed top-6 right-6 z-[60] (md:hidden)
  <MobileNav>                              fixed inset-0 z-50 (md:hidden、開いている間だけ DOM に存在)
  <main>
    #top (Hero) → #philosophy → #experience → #shop → #access
  </main>
  <footer>
</div>
```

Loader 表示中はラッパー全体を `inert` + `aria-hidden` にしてフォーカスとクリックを遮る。

### 1.3 ブレークポイントとコンテナ

- ブレークポイントは **`md` = 768px (48rem) の 1 本だけ**。`sm` / `lg` / `xl` は使わない
- コンテナ: `max-w-7xl` (80rem) が標準、BOUTIQUE の文章は `max-w-3xl` (48rem)
- セクションの余白: `px-6 py-24 md:px-20 md:py-40` (24 / 96px → 80 / 160px)

### 1.4 Tailwind v4 の既定値 (このプロジェクトが依存しているもの)

| クラス | 実値 |
|---|---|
| `text-xs` / `sm` / `base` / `lg` / `xl` / `2xl` / `3xl` / `4xl` | 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.25 rem (行間はそれぞれ 1.333 / 1.43 / 1.5 / 1.56 / 1.4 / 1.333 / 1.2 / 1.11) |
| `md:text-[3.5rem]` `md:text-[2.5rem]` | font-size のみ上書き。行間は `text-4xl` (1.11) / `text-3xl` (1.2) の比率が残る |
| `tracking-widest` | 0.1em |
| `leading-relaxed` / `leading-loose` | 1.625 / 2 |
| `text-gray-300` / `text-gray-400` / `border-gray-600` | oklch(87.2% 0.01 258.338) ≈ #d1d5dc / oklch(70.7% 0.022 261.325) ≈ #99a1af / oklch(44.6% 0.03 256.802) ≈ #4a5565 |
| `border-white/50` `/20` `/5` | #ffffff80 / #fff3 / #ffffff0d |
| `bg-brand/80` `from-brand/90` `/85` `/60` `via-brand/50` `/40` | #241816 の 80 / 90 / 85 / 60 / 50 / 40% |
| `duration-300` / `500` / `[2s]` | 0.3s / 0.5s / 2s、イージングは既定の `cubic-bezier(0.4, 0, 0.2, 1)` |
| `size-1` / `1.5` / `2` / `3` / `4` | 4 / 6 / 8 / 12 / 16 px |
| `blur-[1px]`、`backdrop-blur-[2px]`、`backdrop-blur-[28px]`、`backdrop-saturate-150` | そのまま |

`@theme` には DESIGN.md の色トークンに加えて **`--font-serif: "Playfair Display", "Shippori Mincho", serif`** と **`--animate-slow-zoom`** が必要 (`font-serif` / `animate-slow-zoom` クラスがこれを参照する)。

---

## 2. グローバル CSS (`src/index.css` 全文)

Astro 版では `src/styles/global.css` 等にそのまま移す。`@theme` の色は DESIGN.md のフロントマターと同値を保つ。

```css
@import "tailwindcss";

@theme {
  --color-brand: #241816;
  --color-brand-dark: #1f1513;
  --color-brand-light: #2a1d1b;
  --color-accent: #C8A67B;

  --color-dot-white: #FFFFFF;
  --color-dot-black: #000000;
  --color-dot-red: #E60012;
  --color-dot-blue: #0099CC;
  --color-dot-yellow: #FFD700;
  --color-dot-green: #009944;
  --color-dot-orange: #F39800;
  --color-dot-pink: #E6007F;
  --color-dot-purple: #920783;

  --font-serif: "Playfair Display", "Shippori Mincho", serif;

  --animate-slow-zoom: slow-zoom 20s infinite alternate;
}

@keyframes slow-zoom {
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-brand);
    background-image:
      url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
      radial-gradient(ellipse 90% 70% at 20% 10%, color-mix(in srgb, var(--color-accent) 6%, var(--color-brand-light)) 0%, transparent 50%),
      radial-gradient(ellipse 80% 80% at 85% 85%, var(--color-brand-dark) 0%, transparent 55%);
    background-attachment: fixed, fixed, fixed;
    background-size: 240px 240px, auto, auto;
    background-repeat: repeat, no-repeat, no-repeat;
    background-blend-mode: soft-light, normal, normal;
    color: #f8f8f8;
    font-family: var(--font-serif);
    font-feature-settings: "palt";
    overflow-x: hidden;
    min-height: 100vh;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul,
  ol {
    list-style: none;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-brand);
  }

  ::-webkit-scrollbar-thumb {
    background: #443330;
    border-radius: 4px;
  }
}
```

---

## 3. 共有コンポーネント

### 3.1 BrandDots (3×3 ドット)

```html
<div aria-hidden="true" class="grid grid-cols-3 {GAP}">
  <div class="rounded-full {SIZE} {COLOR[i]}"></div>  <!-- ×9、順序固定 -->
</div>
```

| size | `{SIZE}` | `{GAP}` | 使用箇所 |
|---|---|---|---|
| `sm` | `size-2` | `gap-2` | Access (`inline-grid opacity-50 mb-8` を追加) |
| `md` | `size-3 md:size-4` | `gap-3 md:gap-4` | Hero |
| `lg` | `size-3` | `gap-2` | Loader (`mb-8`、animated) |

`{COLOR[i]}` (i = 0..8):

```
bg-dot-white shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-white)_50%,transparent)]
bg-dot-black border border-gray-600
bg-dot-red shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-red)_30%,transparent)]
bg-dot-blue shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-blue)_30%,transparent)]
bg-dot-yellow shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-yellow)_30%,transparent)]
bg-dot-green shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-green)_30%,transparent)]
bg-dot-orange shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-orange)_30%,transparent)]
bg-dot-pink shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-pink)_30%,transparent)]
bg-dot-purple shadow-[0_0_10px_color-mix(in_srgb,var(--color-dot-purple)_30%,transparent)]
```

animated (Loader のみ): 各ドット `opacity 0→1, scale 0→1`、0.5s、`ease-out`、遅延 `i × 0.1s` (§13 M3)。

### 3.2 ReservationButton

```html
<a href="tel:03-6228-5803" aria-label="{t.aria_reservation} (03-6228-5803)"
   class="inline-block text-center tracking-widest transition-[background-color,border-color,color] duration-500 cursor-pointer {VARIANT} {SIZE}">
  RESERVATION
</a>
```

| variant | クラス |
|---|---|
| `outline` | `border border-white/50 bg-transparent text-inherit hover:bg-accent hover:border-accent hover:text-brand` |
| `filled` | `bg-white/5 border border-white/20 text-inherit hover:bg-white hover:text-brand` |

| size | クラス | 使用箇所 |
|---|---|---|
| `sm` | `py-2 px-6 text-xs` | Header (desktop, outline) |
| `md` | `py-3 px-8 text-sm` | MobileNav (outline) |
| `lg` | `py-4 px-8 text-sm w-full` | Access (filled) |

### 3.3 LanguageSwitch (JP | EN)

```html
<div class="flex gap-4 text-xs tracking-widest font-serif {EXTRA}">
  <button class="bg-transparent border-none text-inherit cursor-pointer p-0 transition-opacity duration-300 hover:opacity-70 {ACTIVE}" aria-pressed="true|false">JP</button>
  <span class="opacity-50" aria-hidden="true">|</span>
  <button class="…同上…" aria-pressed="true|false">EN</button>
</div>
```

- `{ACTIVE}` (現在の言語のみ): `font-bold text-accent border-b border-accent`
- `{EXTRA}`: Header (desktop) は `hidden md:flex pointer-events-auto`、MobileNav 内は `gap-6 text-sm`
- クリックで言語を切り替え、MobileNav 内ではメニューも閉じる

---

## 4. Loader

```html
<div role="status" aria-label="{t.aria_loading}"
     class="fixed inset-0 z-[70] bg-brand flex flex-col items-center justify-center">
  <BrandDots size="lg" class="mb-8" animated />
  <p class="text-2xl tracking-[0.3em] font-serif">Naji la boule</p>
</div>
```

- 表示時間 2500ms (reduced-motion 時 500ms) → 退場フェード (§13 M2) → DOM から除去
- 退場開始と同時にラッパーの `inert` / `aria-hidden` を外す (React では `onComplete` がこのタイミング)
- 表示中は body スクロールをロック (§14.1)
- 店名は §13 M4 でフェードイン

---

## 5. Header

### 5.1 ヘッダー本体 (常時)

```html
<header class="fixed top-0 w-full z-40 p-6 md:p-10 flex justify-between items-start bg-linear-to-b from-brand/90 to-transparent text-white backdrop-blur-[2px]">
  <a href="#top" class="font-serif text-xl md:text-2xl tracking-widest cursor-pointer text-left p-0">
    Naji la boule
    <span lang="ja" class="text-xs md:text-sm tracking-[0.2em] block mt-1 text-gray-400">{t.brand_kana}</span>
  </a>
  <div class="flex flex-row items-center gap-6">
    <nav class="hidden md:block">
      <ul class="flex gap-8 text-sm tracking-widest items-center">
        <li><a href="#access" class="transition-colors duration-300 hover:text-accent">{t.nav_access}</a></li>
        <li><ReservationButton variant="outline" size="sm" /></li>
      </ul>
    </nav>
    <LanguageSwitch class="hidden md:flex pointer-events-auto" />
  </div>
</header>
```

- 店名リンク: 修飾キーなし左クリックのみ `preventDefault` して `window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })`。Cmd / Ctrl / Shift / 中クリックは素のリンク挙動を残す
- ヘッダーは §13 M5 でフェードイン

### 5.2 HamburgerButton (md 未満)

```html
<div class="fixed top-6 right-6 z-[60] md:hidden">
  <button class="relative flex flex-col justify-center items-center w-10 h-10 cursor-pointer z-[60] bg-transparent border-none p-0"
          aria-label="{open ? t.aria_menu_close : t.aria_menu_open}" aria-expanded="{open}" aria-controls="mobile-menu">
    <span class="absolute w-7 h-px bg-white transition-transform duration-300 origin-center {open ? 'translate-y-0 rotate-45' : '-translate-y-1'}"></span>
    <span class="absolute w-7 h-px bg-white transition-transform duration-300 origin-center {open ? 'translate-y-0 -rotate-45' : 'translate-y-1'}"></span>
  </button>
</div>
```

### 5.3 MobileNav (md 未満、開いている間だけ存在)

```html
<nav id="mobile-menu" role="dialog" aria-label="{t.menu_label}"
     class="fixed inset-0 z-50 bg-brand/80 backdrop-blur-[28px] backdrop-saturate-150 overflow-y-auto overscroll-contain md:hidden">
  <div class="min-h-dvh flex flex-col items-center justify-center py-20 px-6">  <!-- この要素自身のタップで閉じる -->
    <ul class="flex flex-col items-center gap-8 text-lg tracking-widest">
      <li><a href="#access" class="transition-colors duration-300 hover:text-accent">{t.nav_access}</a></li>   <!-- クリックで閉じる -->
      <li class="mt-4"><ReservationButton variant="outline" size="md" /></li>
    </ul>
    <div class="mt-12"><LanguageSwitch class="gap-6 text-sm" /></div>
  </div>
</nav>
```

- `aria-modal` は付けない (閉じるボタンがダイアログ外にあるため)。背景の隔離は `inert` で行う (§14.2)
- 開閉・項目・言語スイッチのアニメーションは §13 M19〜M21

---

## 6. Hero (`#top`)

```html
<section id="top" class="relative h-screen flex items-center justify-center overflow-hidden">
  <div aria-hidden="true" class="absolute inset-0 z-0">
    <img src="images/hero/background-1600.webp"
         srcset="images/hero/background-800.webp 800w, images/hero/background-1600.webp 1600w, images/hero/background-2400.webp 2400w"
         sizes="100vw" alt="" width="1600" height="893" fetchpriority="high"
         class="w-full h-full object-cover opacity-50 grayscale scale-110 animate-slow-zoom">
    <div class="absolute inset-0 bg-linear-to-b from-brand/60 via-transparent to-brand"></div>
  </div>
  <div class="relative z-10 text-center px-6 md:px-20">
    <div class="w-fit mx-auto mb-10"><BrandDots size="md" /></div>            <!-- M6 -->
    <h1 class="text-4xl md:text-[3.5rem] font-serif tracking-[0.2em] mb-6 whitespace-pre-line">{t.hero_title}</h1>  <!-- M7 -->
    <p class="text-sm md:text-base leading-loose tracking-widest text-gray-400">{t.hero_tagline}</p>              <!-- M8 -->
  </div>
</section>
```

注意: 背景 `<img>` は `scale-110` (CSS `scale: 110%`) と keyframes の `transform: scale(1.1→1.2)` が **乗算** され、実効倍率は 1.21 → 1.32。現行の見え方なので、移植時もこの二重掛けを再現する (意図的に直す場合は DESIGN.md の Photo Treatment も更新すること)。

---

## 7. Philosophy (`#philosophy`)

```html
<section id="philosophy"
         class="px-6 py-24 md:px-20 md:py-40 min-h-screen md:min-h-0 relative flex items-center">
         <!-- mouseenter / focusin で自動送り停止、mouseleave / focusout (セクション外へ) で再開 -->
  <div aria-hidden="true" class="hidden md:block pointer-events-none">
    <span class="absolute top-24 right-[8%] size-1.5 rounded-full bg-accent/40 blur-[1px]"></span>
    <span class="absolute bottom-32 right-[18%] size-1 rounded-full bg-dot-yellow/30 blur-[1px]"></span>
  </div>

  <div class="max-w-7xl mx-auto w-full md:flex md:flex-row md:items-center md:justify-between md:gap-8">

    <!-- 画像ブロック (M10): モバイルは背面に絶対配置、md 以上で 55% 幅の通常フロー -->
    <div class="absolute inset-0 w-full pointer-events-none z-0 md:static md:w-[55%]">
      <div class="absolute inset-0 overflow-hidden md:relative md:inset-auto md:h-[700px]">
        <div class="hidden md:block md:absolute md:-top-10 md:-left-10 md:size-2 md:rounded-full md:bg-dot-red md:blur-[1px] md:z-10"></div>
        <!-- ×3 スライド。active 以外は opacity 0 + aria-hidden -->
        <div class="absolute inset-0" style="opacity: {active ? 1 : 0}" aria-hidden="{!active}">   <!-- M12 -->
          <img src srcset sizes="(min-width: 768px) 44rem, 100vw" alt="{image.alt[lang]}" width="1600" height="893" loading="lazy"
               class="w-full h-full object-cover brightness-[0.25]">
        </div>
        <div class="absolute inset-0 bg-linear-to-b from-brand/85 via-brand/50 to-brand/85 z-10 md:hidden"></div>
      </div>
    </div>

    <!-- テキストブロック (M11): モバイル中央揃え、md 以上で 45% 幅・左揃え -->
    <div class="relative z-10 w-full text-center md:w-[45%] md:text-left">
      <div class="mx-auto md:max-w-none">
        <div class="grid">
          <!-- ×3 スライド。全て grid-area 1/1 に重ね、active 以外は opacity 0 + pointer-events-none + aria-hidden -->
          <div class="[grid-area:1/1] {active ? '' : 'pointer-events-none'}" style="opacity: {active ? 1 : 0}" aria-hidden="{!active}">   <!-- M12 -->
            <div class="mx-auto max-w-[92vw] md:max-w-none">
              <h2 class="text-2xl md:text-3xl font-serif mb-8 md:mb-12 leading-relaxed tracking-widest whitespace-pre-line">{slide.title}</h2>
              <div class="text-sm md:text-base leading-loose tracking-widest text-gray-300 whitespace-pre-line"><p>{slide.body}</p></div>
            </div>
          </div>
        </div>

        <!-- インジケータ。-mx-2 はボタンの p-2 を相殺してドットをテキスト左端に揃える -->
        <div class="mt-16 -mx-2 flex justify-center md:justify-start">
          <button class="group/dot p-2 bg-transparent border-none cursor-pointer"
                  aria-label="{t.aria_slide_show}: {title (改行→空白)} ({n}/3)" aria-current="{active ? 'true' : undefined}">
            <span class="block size-2 rounded-full bg-dot-white transition-[opacity,transform] duration-300 {active ? 'opacity-100 scale-125' : 'opacity-40 group-hover/dot:opacity-70'}"></span>   <!-- M13 -->
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
```

自動送りの条件は §14.3。

---

## 8. Experience (`#experience`)

```html
<section id="experience" class="px-6 py-24 md:px-20 md:py-40 relative">
  <div aria-hidden="true" class="hidden md:block pointer-events-none">
    <span class="absolute top-[18%] left-[6%] size-1.5 rounded-full bg-accent/30 blur-[1px]"></span>
    <span class="absolute top-[48%] right-[5%] size-1 rounded-full bg-dot-red/25 blur-[1px]"></span>
    <span class="absolute bottom-[20%] left-[10%] size-1 rounded-full bg-dot-blue/25 blur-[1px]"></span>
  </div>
  <div class="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">
    <!-- カード ×3: riz (reverse) / soupe / mariage (reverse) -->
    <div class="flex flex-col items-center gap-12 {reverse ? 'md:flex-row-reverse' : 'md:flex-row'}">
      <div class="w-full md:w-1/2">                                                            <!-- M14 -->
        <div class="relative aspect-video overflow-hidden group">
          <img src srcset sizes="(min-width: 768px) 40rem, 100vw" alt="{image.alt[lang]}" width="1600" height="893" loading="lazy"
               class="w-full h-full object-cover brightness-90 transition-transform duration-[2s] group-hover:scale-105">   <!-- M16 -->
          <div class="absolute inset-0 bg-linear-to-t from-brand via-transparent to-transparent opacity-60"></div>
        </div>
      </div>
      <div class="w-full md:w-1/2 {reverse ? 'md:pr-10' : 'md:pl-10'}">                       <!-- M15 -->
        <span class="text-xs tracking-[0.3em] text-accent block mb-2">{RIZ | SOUPE | MARIAGE}</span>
        <h2 class="text-3xl md:text-[2.5rem] font-serif mb-8 tracking-widest">{t.{key}_title}</h2>
        <p class="text-sm md:text-base leading-loose tracking-widest text-gray-400 mb-8 whitespace-pre-line">{t.{key}_desc}</p>
      </div>
    </div>
  </div>
</section>
```

| key | ラベル | reverse | 画像 |
|---|---|---|---|
| riz | RIZ | true (画像右) | `images/menu/item-02` |
| soupe | SOUPE | false (画像左) | `images/menu/item-01` |
| mariage | MARIAGE | true (画像右) | `images/menu/item-03` |

---

## 9. BOUTIQUE (`#shop`)

```html
<section id="shop" class="relative px-6 py-24 md:px-20 md:py-40 overflow-hidden">
  <div aria-hidden="true" class="absolute inset-0 z-0">
    <img src="images/philosophy/slide-03-1600.webp" srcset="…slide-03-800.webp 800w, …slide-03-1600.webp 1600w"
         sizes="100vw" alt="" width="1600" height="893" loading="lazy"
         class="w-full h-full object-cover brightness-[0.3]">
    <div class="absolute inset-0 bg-linear-to-b from-brand via-brand/40 to-brand"></div>
  </div>
  <div class="relative z-10 max-w-3xl mx-auto text-center">                                   <!-- M17 -->
    <span class="text-xs tracking-[0.3em] text-accent block mb-2">BOUTIQUE</span>
    <h2 class="text-3xl md:text-[2.5rem] font-serif mb-8 tracking-widest whitespace-pre-line">{t.shop_title}</h2>
    <p class="text-sm md:text-base leading-loose tracking-widest text-gray-300 mb-12 whitespace-pre-line">{t.shop_desc}</p>
    <a href="https://iyahiko.square.site/" target="_blank" rel="noopener noreferrer" aria-label="{t.aria_rice_shop}"
       class="inline-block text-center tracking-widest py-3 px-10 text-sm border border-white/50 bg-transparent text-inherit transition-[background-color,border-color,color] duration-500 hover:bg-accent hover:border-accent hover:text-brand">
      ONLINE SHOP <span aria-hidden="true">↗</span>
    </a>
  </div>
</section>
```

背景画像は Philosophy 3 枚目 (`riceGiftImage`) と同じファイルを共用する。

---

## 10. Access (`#access`)

```html
<section id="access" class="px-6 py-24 md:px-20 md:py-40 bg-brand-dark relative">
  <div class="max-w-7xl mx-auto text-center">
    <div class="mb-12">                                                                        <!-- M18a -->
      <BrandDots size="sm" class="inline-grid opacity-50 mb-8" />
      <h2 class="text-3xl md:text-[2.5rem] font-serif mb-2 tracking-widest">Naji la boule</h2>
      <p class="text-xs tracking-[0.3em] text-gray-400">GINZA</p>
    </div>

    <div class="grid gap-12 text-left mb-16 md:grid-cols-2">                                   <!-- M18b -->
      <div class="flex flex-col gap-6">
        <div>
          <p class="text-xs text-gray-400 tracking-widest mb-1">ADDRESS</p>
          <p class="font-serif whitespace-pre-line">{t.address_text}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 tracking-widest mb-1">TEL</p>
          <p class="font-serif whitespace-pre-line">
            <a href="tel:03-6228-5803" class="tabular-nums transition-colors duration-300 hover:text-accent">03-6228-5803</a>
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 tracking-widest mb-1">HOURS</p>
          <p class="font-serif tabular-nums whitespace-pre-line">{t.hours_main}<br><span class="text-xs text-gray-400">{t.hours_closed}</span></p>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <div>
          <p class="text-xs text-gray-400 tracking-widest mb-1">RESERVATION</p>
          <p class="font-serif mb-2">{t.access_reservation_heading}</p>
          <p class="text-sm leading-loose tracking-widest text-gray-400 whitespace-pre-line">{t.access_reservation_note}</p>
        </div>
        <ReservationButton variant="filled" size="lg" />
      </div>
    </div>

    <div>                                                                                      <!-- M18c -->
      <div class="w-full h-64">
        <iframe title="{t.map_title}"
                src="https://www.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%8A%80%E5%BA%A76-12-12%20%E9%8A%80%E5%BA%A7%E3%82%B9%E3%83%86%E3%83%A9%E3%83%93%E3%83%AB2%E9%9A%8E&output=embed&hl={lang}"
                width="100%" height="100%" style="border: 0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </div>
</section>
```

---

## 11. Footer

```html
<footer class="py-8 text-center text-[10px] tracking-widest tabular-nums text-gray-400 border-t border-white/5">
  © {現在の年} Naji la boule. All Rights Reserved.
</footer>
```

---

## 12. 文言と画像データ

- 表示文字列は `src/i18n/data.ts` の `translations` (ja / en) と `philoSlides` を **そのまま移植**する。本書には転記しない
- 画像メタデータは `src/images/data.ts` をそのまま移植する (srcset / sizes / alt ja+en / width / height / loading / fetchPriority)
- `SITE_CONFIG` (店名・電話・URL・ショップ URL) は `src/constants.ts` から

---

## 13. モーション一覧 (motion ライブラリ → CSS)

イージングの対応: motion の `easeOut` = `cubic-bezier(0, 0, 0.58, 1)` = CSS `ease-out`、`easeInOut` = `cubic-bezier(0.42, 0, 0.58, 1)` = CSS `ease-in-out`。`duration` 指定のみで `ease` 未指定の motion トランジションは `easeOut`。

| ID | 要素 | トリガー | プロパティ | duration | delay | easing | reduced-motion 時 |
|---|---|---|---|---|---|---|---|
| M1 | Loader 表示 | マウント | (タイマー) | 2500ms | – | – | 500ms |
| M2 | Loader 退場 | M1 経過 | opacity 1→0、完了後 DOM から除去 | 1s | 0 | ease-in-out | 0.5s |
| M3 | Loader ドット ×9 | マウント | opacity 0→1, scale 0→1 | 0.5s | i×0.1s | ease-out | opacity のみ (transform は動かさない) |
| M4 | Loader 店名 | マウント | opacity 0→1, y 10px→0 | 1s | 1s | ease-out | delay 0 / 0.2s |
| M5 | Header | マウント | opacity 0→1 | 1s | 2.5s | ease-out | delay 0.3s / 0.5s |
| M6 | Hero ドット | マウント | opacity 0→1 | 2s | 0.8s | ease-out | delay 0.3s / 0.5s |
| M7 | Hero h1 | マウント | opacity 0→1, y 10px→0 | 2s | 1.0s | ease-out | delay 0.3s / 0.5s |
| M8 | Hero タグライン | マウント | opacity 0→1 | 2s | 1.5s | ease-out | delay 0.3s / 0.5s |
| M9 | Hero 背景画像 | 常時 | transform scale 1.1→1.2 (`scale-110` と乗算、§6 注意) | 20s | – | ease、infinite alternate | CSS で 0.01ms |
| M10 | Philosophy 画像ブロック | セクションが画面に入る (once) | opacity 0→1, y 30px→0 | 1s | 0 | ease-out | CSS で 0.01ms |
| M11 | Philosophy テキストブロック | 同上 | 同上 | 1s | 0.2s | ease-out | 同上 |
| M12 | Philosophy スライド (画像層・テキスト層とも) | activeIndex 変化 | opacity 0↔1 (クロスフェード) | 1s | 0 | ease-out | 同上 (自動送りは停止) |
| M13 | Philosophy インジケータ | active 変化 / hover | opacity 0.4↔1 (hover 0.7), scale 1↔1.25 | 0.3s | 0 | 既定 (`cubic-bezier(0.4,0,0.2,1)`) | 同上 |
| M14 | Experience 画像 | カードが画面に入る (once、rootMargin −100px) | opacity 0→1, y 30px→0 | 1s | 0 | ease-out | 同上 |
| M15 | Experience テキスト | 同上 | 同上 | 1s | 0.2s | ease-out | 同上 |
| M16 | Experience 画像 hover | hover | scale 1→1.05 | 2s | 0 | 既定 | 同上 |
| M17 | BOUTIQUE ブロック | セクションが画面に入る (once、−100px) | opacity 0→1, y 30px→0 | 1s | 0 | ease-out | 同上 |
| M18a/b/c | Access 見出し / グリッド / 地図 | 同上 | 同上 | 1s | 0 / 0.2s / 0.4s | ease-out | 同上 |
| M19 | MobileNav 開閉 | open 変化 | opacity 0→1 (閉: 1→0、完了後 DOM から除去) | 0.5s | 0 | ease-out | 同上 |
| M20 | MobileNav 項目 ×2 (Access、ボタン) | open | opacity 0→1 (0.3s), y 20px→0 (spring stiffness 500 / damping 25 ≈ 0.4s) | 上記 | i×0.1s | opacity は `cubic-bezier(0.25, 0.1, 0.35, 1)`、y はスプリング | 同上 |
| M21 | MobileNav 言語スイッチ | open | opacity 0→1 | 0.3s | 0.5s | `cubic-bezier(0.25, 0.1, 0.35, 1)` | 同上 |
| M22 | ハンバーガー 2 本線 | open 変化 | translate ±4px→0、rotate 0→±45° | 0.3s | 0 | 既定 | 同上 |
| M23 | ホバー各種 | hover | ナビ・TEL リンク color 0.3s / 言語スイッチ opacity 0.3s / ボタン bg・border・color 0.5s | – | – | 既定 | 同上 |
| M24 | 店名クリック | click | `scrollTo` top、smooth | – | – | – | `behavior: auto` |

### CSS で再現する指針

- **マウント時フェード (M4〜M8)**: `@keyframes` (`from { opacity: 0; translate: 0 10px }`) を `animation: … both` で当て、`animation-delay` に表の delay を入れる。`animation-fill-mode: both` で開始前の非表示を保証する
- **画面内トリガー (M10, M11, M14, M15, M17, M18)**: 要素に `data-reveal` を付け、初期状態 `opacity: 0; translate: 0 30px`。IntersectionObserver (`threshold: 0`、M14 以降は `rootMargin: '-100px'`) で `is-visible` を付け、`transition: opacity 1s ease-out, translate 1s ease-out` + `transition-delay` で表現する。once なので observe 解除
- **Loader 退場 (M2)・MobileNav 閉 (M19)**: `transition: opacity` で 0 にした後、`transitionend` で `hidden` / DOM 除去。`prefers-reduced-motion` では CSS が 0.01ms にするので `transitionend` はほぼ即時に発火する
- **スタッガー (M3, M20)**: `style="--i: {index}"` と `animation-delay: calc(var(--i) * 0.1s)`
- **M20 のスプリング**: CSS では `translate 0.4s ease-out` で近似する
- **M9**: `slow-zoom` keyframes をそのまま (`@theme` の `--animate-slow-zoom`)
- **reduced-motion**: CSS の 0.01ms ルールが全 CSS アニメーションを止めるため、JS 側で必要なのは Loader タイマー (500ms)、自動送り停止、`scrollTo` の `behavior: 'auto'` の 3 点だけ。判定は `matchMedia('(prefers-reduced-motion: reduce)')` で、`change` も監視する

---

## 14. 振る舞い仕様 (デザインに影響するもの)

### 14.1 スクロールロック
- Loader 表示中と MobileNav 表示中は `document.documentElement.style.overflow` と `document.body.style.overflow` を `hidden` にする (iOS Safari は body だけでは効かない)
- 複数の呼び出し元が重なるので参照カウントで管理し、最後の解除で元の値に戻す

### 14.2 MobileNav
- 開いたら `header` / `main` / `footer` に `inert` を付け、Tab / Shift+Tab をハンバーガー + メニュー内の `a[href], button:not([disabled])` の間で循環させる
- Esc で閉じる。メニューの余白 (`min-h-dvh` の div 自身) のタップで閉じる。Access リンクと言語スイッチの選択でも閉じる
- 閉じたらハンバーガーへフォーカスを戻し、`inert` を外す
- 開いたまま 768px 以上に広がったら閉じる (`matchMedia('(min-width: 768px)')` の `change`)。ハンバーガーは `md:hidden` なので md 以上で開かれることはない

### 14.3 Philosophy の自動送り
- 間隔 7000ms。次の 3 条件が **すべて** 満たされる間だけ動く: セクションが画面内 (IntersectionObserver、once でない) / reduced-motion でない / セクションが hover も focus もされていない
- インジケータで手動切替したらタイマーを仕切り直す
- `focusout` は `relatedTarget` がセクション外のときだけ「focus 解除」とみなす

### 14.4 言語
- 優先順位: `?lang=ja|en` → `localStorage['najilaboule:language']` → 既定 `ja`。ブラウザ言語での自動判定は **しない** (Googlebot が en-US で描画するため)
- 明示的な選択 (パラメータ・保存済み・切替操作) のときだけ: `localStorage` へ保存、`<meta name="description">` を差し替え、`<link rel="canonical">` を `…/` または `…/?lang=en` に、`history.replaceState` で URL の `?lang` を同期
- `<html lang>` は常に現在の言語に同期
- Astro 版で `/en/` の静的ルートに変える場合は、この節と `index.html` の hreflang を **Astro 側の spec で改めて決める** (本書は現行の挙動を記録するだけ)

### 14.5 リンク
- 店名 → 最上部へスムーススクロール (修飾キー・中クリックは素通し、§5.1)
- `#access` へのページ内リンクはブラウザ既定のジャンプ (smooth 指定なし)
- 外部リンク (ONLINE SHOP) は `target="_blank" rel="noopener noreferrer"` + 「外部サイト・新しいタブ」を含む aria-label

### 14.6 a11y の要点
- h1 は Hero の 1 つだけ。各セクション先頭とスライドのタイトルは h2
- 装飾画像は `alt=""` + 親に `aria-hidden="true"`、内容画像は ja / en の alt
- ハンバーガーの `aria-label` は開閉で切替、`aria-expanded` / `aria-controls` 付き
- スライドの非アクティブ層は `aria-hidden` + `pointer-events-none`
- Loader は `role="status"` + aria-label

---

## 15. 画像ファイル

| 用途 | ファイル (public/images/) | サイズ | sizes | loading |
|---|---|---|---|---|
| Hero 背景 | `hero/background-{800,1600,2400}.webp` | 1600×893 | `100vw` | eager、`fetchpriority="high"`、preload |
| Philosophy ×3 | `philosophy/slide-0{1,2,3}-{800,1600}.webp` | 1600×893 | `(min-width: 768px) 44rem, 100vw` | lazy |
| Experience ×3 | `menu/item-0{1,2,3}-{800,1600}.webp` (01=汁, 02=米, 03=酒) | 1600×893 | `(min-width: 768px) 40rem, 100vw` | lazy |
| BOUTIQUE 背景 | `philosophy/slide-03-*` (共用) | 1600×893 | `100vw` | lazy |
| OGP | `ogp.jpg` | 1200×630 | – | – |

WebP 品質 78。元データは `assets/images-original/`。

---

## 16. 移植チェックリスト

Astro 版で以下を全て満たしたら本書を退役させる。目視は **390px と 1440px × ja と en** の 4 通りで行う。

**静的な見た目**
- [ ] body 背景の 3 層 (ノイズ・左上の金の微光・右下の暗部) が出ている
- [ ] Header: 位置・グラデーション・ぼかし・店名とカナの大きさ・字間
- [ ] Hero: 画像の減光とグレースケール、上下グラデーション、h1 / タグラインのサイズと字間、ドットの大きさ
- [ ] Philosophy: モバイルで画像が背面、md で 55:45。h2 の行間 1.625、本文 gray-300、インジケータの位置 (テキスト左端に揃う)
- [ ] Experience: 画像の左右交互、16:9、下方向グラデーション、ラベル→h2→本文の余白
- [ ] BOUTIQUE: 背景の減光 30% と上下グラデーション、48rem の文章幅、ONLINE SHOP ボタン
- [ ] Access: `brand-dark` 背景、ドット 50%、2 列グリッド、tabular-nums、filled ボタン、地図 256px
- [ ] Footer: 10px、罫線 5%
- [ ] 装飾の光点 (Philosophy 2 個、Experience 3 個) が md 以上でだけ出る

**動き**
- [ ] Loader 2.5s → 1s 退場、その間に Hero が M6〜M8 の順で現れ、Header が 2.5s 後にフェードイン
- [ ] スクロールでセクションが 1s で浮き上がる (once)。Experience 以降は 100px 手前で発火
- [ ] Philosophy が 7s ごとに 1s でクロスフェードし、hover / focus / 画面外で止まる
- [ ] ハンバーガー開閉 0.3s、メニュー 0.5s フェード + 項目スタッガー
- [ ] ホバー: ボタン反転 0.5s、リンク色 0.3s、写真ズーム 2s
- [ ] `prefers-reduced-motion` で Loader 0.5s、フェード即時、自動送り停止、smooth scroll 無効

**振る舞い**
- [ ] 言語切替で文言・`<html lang>`・description・canonical・URL が変わり、再訪で保持される
- [ ] MobileNav: スクロールロック、Tab 循環、Esc、余白タップ、フォーカス戻し、768px 跨ぎで閉じる
- [ ] 店名クリックで最上部へ (修飾キーは素通し)

**品質**
- [ ] `npm run lint:design` がエラー 0
- [ ] Lighthouse (Performance / Accessibility / SEO) が現行 React 版と同等以上
- [ ] JS 転送量が現行 (約 105KB gzip) より大幅に小さい
