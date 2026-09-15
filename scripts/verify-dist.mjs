// dist/index.html の不変条件を検査する。`npm run build` の最後に走る。
// 検査を足すときは checks に [名前, 真偽値] を追加する。
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) ?? []).length;
const section = (id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
const header = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
// Astro のスコープ属性 (data-astro-cid-*) が付くので、タグは [^>]* で属性を許して探す
const menu = header.match(/<ul id="menu"[^>]*>[\s\S]*?<\/ul>/)?.[0] ?? '';

const assetsDir = new URL('../dist/_astro/', import.meta.url);
const css = readdirSync(assetsDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(f, assetsDir), 'utf8'))
  .join('\n')
  .replace(/\s+/g, '');

const CHAPTERS = [
  ['concept', '一合、一会。', 'MARMITE', '壱', '湯気を上げる釜'],
  ['sake', '待つという、贅沢。', 'L’ATTENTE', '弐', 'カウンターに置かれたグラスの酒'],
  ['obanzai', '寄り添う、駿菜。', 'SYUNSAI', '参', '木枠の箱に小鉢で並ぶおばんざい'],
  ['riz', 'そして、一膳。', 'RIZ ET SOUPE', '四', 'お膳に揃えた炊きたてのご飯と汁、梅干し'],
];

const checks = [
  ['html lang="ja"', /<html[^>]*\slang="ja"/.test(html)],
  ['配信 JS ゼロ (JSON-LD 以外の <script> がない)', !/<script\b(?![^>]*application\/ld\+json)/.test(html)],
  ['Google Fonts への外部参照がない', !/fonts\.(googleapis|gstatic)\.com/.test(html)],
  ['Zen Old Mincho の @font-face が自前ホストされている', /@font-face[^}]*Zen Old Mincho[^}]*_astro\/fonts\//.test(html)],
  ['Playfair Display が残っていない', !/Playfair/.test(html)],
  ['canonical', html.includes('<link rel="canonical" href="https://atimot.github.io/najilaboule/"')],
  ['JSON-LD Restaurant', /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"Restaurant"/.test(html)],
  ['og:image', html.includes('content="https://atimot.github.io/najilaboule/images/ogp.jpg"')],
  ['skip link', html.includes('class="skip-link"')],
  ['theme-color', html.includes('<meta name="theme-color" content="#241816"')],
  ['SVG favicon の link', html.includes('<link rel="icon" type="image/svg+xml" href="/najilaboule/favicon.svg"')],
  ['<header> がある', /<header\b/.test(html)],
  ['ヘッダーのロゴは inline SVG (currentColor、<img> なし)', (() => { const m = html.match(/<header[\s\S]*?<\/header>/); return !!m && /<svg[^>]*fill="currentColor"/.test(m[0]) && /<svg[^>]*viewBox="/.test(m[0]) && !/<img\b/.test(m[0]); })()],
  ['ナビに aria-label', /<nav[^>]*aria-label="メインナビゲーション"/.test(header)],
  ['ヘッダーのメニューは popover (JS なし): button[popovertarget=menu] に隠しテキスト「メニュー」、ul#menu[popover]', /<button type="button" class="menu__toggle" popovertarget="menu"[^>]*>\s*<span class="sr-only"[^>]*>メニュー<\/span>\s*<span class="menu__glyph" aria-hidden="true"[^>]*><\/span>\s*<\/button>/.test(header) && /^<ul id="menu" class="menu__list" popover[\s>]/.test(menu) && !/<details\b|<summary\b/.test(header)],
  ['メニューのリンクは Instagram と Online Shop の 2 本 (外部リンク属性つき、↗ を添える)', (() => { const links = menu.match(/<a\b[^>]*class="menu__link"[^>]*>[\s\S]*?<\/a>/g) ?? []; return links.length === 2 && ['Instagram', 'Online Shop'].every((label, i) => new RegExp(`target="_blank"[^>]*rel="noopener noreferrer"[^>]*aria-label="${label}（外部サイト・新しいタブで開きます）"[^>]*>\\s*${label}\\s*<span aria-hidden="true"[^>]*>↗</span>`).test(links[i])); })()],
  ['メニューの Online Shop は BOUTIQUE のボタンと同じ URL', menu.includes('href="https://iyahiko.square.site/"')],
  ['ヘッダーにナビリンク 5 本と RESERVATION ボタンが残っていない (2026-09-14 に廃止)', !/nav__link|RESERVATION|href="tel:|href="#(concept|sake|obanzai|shop|access)"/.test(header) && !/RESERVATION/.test(html)],
  ['電話予約リンク (tel:) は Access の 1 箇所だけ', count(/href="tel:03-6274-6608"/g) === 1 && section('access').includes('href="tel:03-6274-6608"')],
  ['h1 はちょうど 1 つ', count(/<h1\b/g) === 1],
  ['#top セクション', /<section[^>]*id="top"/.test(html)],
  ['Hero 画像は AVIF source + fetchpriority=high', /<source[^>]*type="image\/avif"/.test(html) && /<img[^>]*fetchpriority="high"/.test(html)],
  ['Hero 画像の preload (avif)', (() => { const tags = html.match(/<link[^>]*rel="preload"[^>]*>/g) ?? []; return tags.some((tag) => /as="image"/.test(tag) && /type="image\/avif"/.test(tag) && /imagesrcset="[^"]+"/.test(tag) && /imagesizes="100vw"/.test(tag) && /fetchpriority="high"/.test(tag)); })()],
  ['章のセクション ×4 (#concept #sake #obanzai #riz) が aria-labelledby つき', CHAPTERS.every(([id]) => new RegExp(`<section[^>]*id="${id}"[^>]*aria-labelledby="${id}-title"`).test(section(id)))],
  ['章の h2 ×4', CHAPTERS.every(([id, title]) => new RegExp(`<h2[^>]*id="${id}-title"[^>]*>\\s*${title}\\s*</h2>`).test(html))],
  ['章のラベル MARMITE / L’ATTENTE / SYUNSAI / RIZ ET SOUPE', CHAPTERS.every(([, , label]) => html.includes(`>${label}</span>`))],
  ['章番号 壱弐参四', CHAPTERS.every(([, , , num]) => html.includes(`>${num}</span>`))],
  ['章の写真 ×4 (alt が 1 回ずつ)', CHAPTERS.every(([, , , , alt]) => count(new RegExp(`alt="${alt}"`, 'g')) === 1)],
  ['章の写真は .chapter__slide に包まれる (各章 1 枚以上。複数枚ならスライドショー)', CHAPTERS.every(([id]) => /<div class="chapter__slide[^"]*"[^>]*>\s*<picture\b/.test(section(id)))],
  ['4 章とも写真 2 枚以上でスライドショーが付く (chapter__frame--slideshow)', CHAPTERS.every(([id]) => /class="chapter__frame chapter__frame--slideshow"/.test(section(id)) && (section(id).match(/class="chapter__slide"/g) ?? []).length >= 2)],
  ['仮写真の注記 (figcaption) が残っていない', !/仮写真/.test(html) && !/<figcaption\b/.test(html)],
  ['弐・四は写真が右 (chapter--reverse)', /id="sake"[^>]*class="[^"]*chapter--reverse/.test(section('sake')) && /id="riz"[^>]*class="[^"]*chapter--reverse/.test(section('riz')) && !/chapter--reverse/.test(section('concept')) && !/chapter--reverse/.test(section('obanzai'))],
  ['#shop セクションに背景写真がない', section('shop') !== '' && !/<picture\b|<img\b/.test(section('shop'))],
  ['ONLINE SHOP は外部リンク属性つき', /<a[^>]*href="https:\/\/iyahiko\.square\.site\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/.test(html)],
  ['#access セクション', section('access') !== ''],
  // 空の alt は compressHTML で alt="" ではなく alt と出る
  ['#access に背景写真 (装飾、alt が空)', /<picture\b/.test(section('access')) && /<img[^>]*\salt(?:=""|(?=[\s>]))/.test(section('access'))],
  ['ACCÈS ラベル', section('access').includes('>ACCÈS</span>')],
  ['Access の見出しはロックアップ (ロゴが role=img、GINZA ラベルなし)', /<h2[^>]*id="access-title"[^>]*>[\s\S]*?<svg[^>]*role="img"[^>]*aria-label="Naji la boule ナジラブール"[\s\S]*?<\/h2>/.test(html) && !/>GINZA</.test(html)],
  ['地図 iframe に title と lazy', (() => { const m = html.match(/<iframe[^>]*>/); return !!m && /title="店舗の地図[^"]*"/.test(m[0]) && /loading="lazy"/.test(m[0]); })()],
  ['地図は Google マップの掲載「Naji la boule」の埋め込み (共有→地図を埋め込む の URL。ftid と店名を照合)', (() => { const m = html.match(/<iframe[^>]*>/); return !!m && /src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*!1s0x60188baa66ba6b1f%3A0xc672e7499dfbb371!2sNaji%20la%20boule[^"]*!1sja!2sjp[^"]*"/.test(m[0]); })()],
  ['<footer> に著作権表記', /<footer[^>]*>[\s\S]*All Rights Reserved\.[\s\S]*<\/footer>/.test(html)],
  ['フッターにロゴ SVG (currentColor)', (() => { const m = html.match(/<footer[\s\S]*?<\/footer>/); return !!m && /<svg[^>]*fill="currentColor"/.test(m[0]); })()],
  ['アイコン + ロゴのロックアップが Header / Access / Footer (rect ×3)、Hero にはない', count(/<rect\b/g) === 3 && count(/<circle\b/g) === 27 && /<header[\s\S]*?<rect\b[\s\S]*?<\/header>/.test(html) && /<rect\b/.test(section('access')) && /<footer[\s\S]*?<rect\b[\s\S]*?<\/footer>/.test(html) && !/<rect\b/.test(section('top'))],
  ['src/assets/icon.svg と public/favicon.svg が同一', readFileSync(new URL('../src/assets/icon.svg', import.meta.url), 'utf8') === readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')],
  ['h2 は 6 つ (章 4 + BOUTIQUE + ACCÈS)', count(/<h2\b/g) === 6],
  ['CSS: 縦書き (writing-mode: vertical-rl) が使われている', css.includes('writing-mode:vertical-rl')],
  ['CSS: .reveal の animation-timeline が longhand で残っている', css.includes('animation-timeline:view()')],
  ['CSS: animation ショートハンドに timeline が畳み込まれていない', !/animation:[^;}]*view\(\)/.test(css)],
  ['CSS: 章のスライドショー keyframes (2〜5 枚ぶん) が残っている', [2, 3, 4, 5].every((n) => css.includes(`@keyframeschapter-slide-${n}{`))],
  ['CSS: スライドショーは 1 枚 6 秒周期で、フェードは周期の 1/6 (変数は --slide-period だけ)', css.includes('--slide-period:6s') && css.includes('--slide-fade:calc(var(--slide-period)/6)') && !css.includes('--slide-hold')],
  ['CSS: 章の写真にホバー効果がない (拡大も一時停止もしない)', !/chapter__frame[^{]*:hover/.test(css) && !css.includes('animation-play-state') && !css.includes('scale:1.05')],
  ['CSS: メニューの開閉は :popover-open で描く (グリフの ×、パネルの transition は @starting-style と allow-discrete で往復)', /:popover-open[^{]*menu__glyph/.test(css) && /\.menu__list[^{]*:popover-open[^{]*\{[^}]*opacity:1/.test(css) && /\.menu__list[^{]*:popover-open[^{]*\{[^}]*display:grid/.test(css) && !(css.match(/\.menu__list\[[^\]]*\]\{[^}]*\}/g) ?? []).some((rule) => rule.includes('display:grid')) && /@starting-style\{[^}]*:popover-open/.test(css) && /transition:[^;}]*display[^;}]*allow-discrete/.test(css)],
  ['CSS: 1024px (64rem) のブレークポイントが残っていない', !/min-width:64rem|min-width:1024px/.test(css)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`\nverify-dist: ${failed} 件失敗`);
  process.exit(1);
}
console.log(`\nverify-dist: ${checks.length} 件すべて通過`);
