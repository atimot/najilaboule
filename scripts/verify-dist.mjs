// dist/index.html の不変条件を検査する。`npm run build` の最後に走る。
// 検査を足すときは checks に [名前, 真偽値] を追加する。
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) ?? []).length;
const section = (id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';

const assetsDir = new URL('../dist/_astro/', import.meta.url);
const css = readdirSync(assetsDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(f, assetsDir), 'utf8'))
  .join('\n')
  .replace(/\s+/g, '');

const CHAPTERS = [
  ['concept', '一釜、一膳。', 'MARMITE', '壱', '湯気を上げる釜'],
  ['sake', '待つという、贅沢。', 'L’ATTENTE', '弐', 'カウンターに置かれたグラスの酒'],
  ['obanzai', '寄り添う、駿菜。', 'OBANZAI', '参', '小鉢に盛られたおばんざい'],
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
  ['ヘッダーに電話予約リンク', /<header[\s\S]*?href="tel:03-6228-5803"[\s\S]*?<\/header>/.test(html)],
  ['ナビに aria-label', /<nav[^>]*aria-label="メインナビゲーション"/.test(html)],
  ['ナビリンクは 5 本 (#concept #sake #obanzai #shop #access)', (() => { const m = html.match(/<nav[\s\S]*?<\/nav>/); return !!m && ['#concept', '#sake', '#obanzai', '#shop', '#access'].every((h) => m[0].includes(`href="${h}"`)) && (m[0].match(/class="nav__link"/g) ?? []).length === 5; })()],
  ['RESERVATION はヘッダーの 1 箇所だけ (Access の予約ブロックは廃止)', count(/>\s*RESERVATION\s*</g) === 1],
  ['h1 はちょうど 1 つ', count(/<h1\b/g) === 1],
  ['#top セクション', /<section[^>]*id="top"/.test(html)],
  ['Hero 画像は AVIF source + fetchpriority=high', /<source[^>]*type="image\/avif"/.test(html) && /<img[^>]*fetchpriority="high"/.test(html)],
  ['Hero 画像の preload (avif)', (() => { const tags = html.match(/<link[^>]*rel="preload"[^>]*>/g) ?? []; return tags.some((tag) => /as="image"/.test(tag) && /type="image\/avif"/.test(tag) && /imagesrcset="[^"]+"/.test(tag) && /imagesizes="100vw"/.test(tag) && /fetchpriority="high"/.test(tag)); })()],
  ['章のセクション ×4 (#concept #sake #obanzai #riz) が aria-labelledby つき', CHAPTERS.every(([id]) => new RegExp(`<section[^>]*id="${id}"[^>]*aria-labelledby="${id}-title"`).test(section(id)))],
  ['章の h2 ×4', CHAPTERS.every(([id, title]) => new RegExp(`<h2[^>]*id="${id}-title"[^>]*>\\s*${title}\\s*</h2>`).test(html))],
  ['章のラベル MARMITE / L’ATTENTE / OBANZAI / RIZ ET SOUPE', CHAPTERS.every(([, , label]) => html.includes(`>${label}</span>`))],
  ['章番号 壱弐参四', CHAPTERS.every(([, , , num]) => html.includes(`>${num}</span>`))],
  ['章の写真 ×4 (alt が 1 回ずつ)', CHAPTERS.every(([, , , , alt]) => count(new RegExp(`alt="${alt}"`, 'g')) === 1)],
  ['章の写真は .chapter__slide に包まれる (各章 1 枚以上。複数枚ならスライドショー)', CHAPTERS.every(([id]) => /<div class="chapter__slide[^"]*"[^>]*>\s*<picture\b/.test(section(id)))],
  ['壱・四 (concept / riz) は写真 2 枚以上でスライドショーが付く (chapter__frame--slideshow)', ['concept', 'riz'].every((id) => /class="chapter__frame chapter__frame--slideshow"/.test(section(id)) && (section(id).match(/class="chapter__slide"/g) ?? []).length >= 2)],
  ['弐・四は写真が右 (chapter--reverse)', /id="sake"[^>]*class="[^"]*chapter--reverse/.test(section('sake')) && /id="riz"[^>]*class="[^"]*chapter--reverse/.test(section('riz')) && !/chapter--reverse/.test(section('concept')) && !/chapter--reverse/.test(section('obanzai'))],
  ['#shop セクションに背景写真がない', section('shop') !== '' && !/<picture\b|<img\b/.test(section('shop'))],
  ['ONLINE SHOP は外部リンク属性つき', /<a[^>]*href="https:\/\/iyahiko\.square\.site\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/.test(html)],
  ['#access セクション', section('access') !== ''],
  // 空の alt は compressHTML で alt="" ではなく alt と出る
  ['#access に背景写真 (装飾、alt が空)', /<picture\b/.test(section('access')) && /<img[^>]*\salt(?:=""|(?=[\s>]))/.test(section('access'))],
  ['ACCÈS ラベル', section('access').includes('>ACCÈS</span>')],
  ['Access の見出しはロックアップ (ロゴが role=img、GINZA ラベルなし)', /<h2[^>]*id="access-title"[^>]*>[\s\S]*?<svg[^>]*role="img"[^>]*aria-label="Naji la boule ナジラブール"[\s\S]*?<\/h2>/.test(html) && !/>GINZA</.test(html)],
  ['地図 iframe に title と lazy', (() => { const m = html.match(/<iframe[^>]*>/); return !!m && /title="店舗の地図[^"]*"/.test(m[0]) && /loading="lazy"/.test(m[0]); })()],
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
