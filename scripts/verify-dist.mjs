// dist/index.html の不変条件を検査する。`npm run build` の最後に走る。
// 検査を足すときは checks に [名前, 真偽値] を追加する。
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) ?? []).length;

const assetsDir = new URL('../dist/_astro/', import.meta.url);
const css = readdirSync(assetsDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(f, assetsDir), 'utf8'))
  .join('\n')
  .replace(/\s+/g, '');

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
  ['h1 はちょうど 1 つ', count(/<h1\b/g) === 1],
  ['#top セクション', /<section[^>]*id="top"/.test(html)],
  ['Hero 画像は AVIF source + fetchpriority=high', /<source[^>]*type="image\/avif"/.test(html) && /<img[^>]*fetchpriority="high"/.test(html)],
  ['Hero 画像の preload (avif)', (() => { const tags = html.match(/<link[^>]*rel="preload"[^>]*>/g) ?? []; return tags.some((tag) => /as="image"/.test(tag) && /type="image\/avif"/.test(tag) && /imagesrcset="[^"]+"/.test(tag) && /imagesizes="100vw"/.test(tag) && /fetchpriority="high"/.test(tag)); })()],
  ['#philosophy セクション', /<section[^>]*id="philosophy"/.test(html)],
  ['Philosophy は h2 1 つの単一コンテンツ (article なし)', /<h2[^>]*id="philosophy-title"/.test(html) && count(/<article\b/g) === 0],
  ['Philosophy の写真は 1 枚 (alt が 1 回)', count(/alt="指先に乗せた一粒の米"/g) === 1],
  ['#experience セクション', /<section[^>]*id="experience"/.test(html)],
  ['RIZ / SOUPE / MARIAGE ラベル', ['RIZ', 'SOUPE', 'MARIAGE'].every((l) => html.includes(`>${l}</span>`))],
  ['Experience の h2 ×3', ['結ぶ、米。', 'ほどける、汁。', '揺蕩う、盃。'].every((s) => new RegExp(`<h2[^>]*>\\s*${s}\\s*</h2>`).test(html))],
  ['#shop セクション', /<section[^>]*id="shop"/.test(html)],
  ['ONLINE SHOP は外部リンク属性つき', /<a[^>]*href="https:\/\/iyahiko\.square\.site\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/.test(html)],
  ['#access セクション', /<section[^>]*id="access"/.test(html)],
  ['Access の見出しはロックアップ (ロゴが role=img、GINZA ラベルなし)', /<h2[^>]*id="access-title"[^>]*>[\s\S]*?<svg[^>]*role="img"[^>]*aria-label="Naji la boule ナジラブール"[\s\S]*?<\/h2>/.test(html) && !/>GINZA</.test(html)],
  ['地図 iframe に title と lazy', (() => { const m = html.match(/<iframe[^>]*>/); return !!m && /title="店舗の地図[^"]*"/.test(m[0]) && /loading="lazy"/.test(m[0]); })()],
  ['<footer> に著作権表記', /<footer[^>]*>[\s\S]*All Rights Reserved\.[\s\S]*<\/footer>/.test(html)],
  ['フッターにロゴ SVG (currentColor)', (() => { const m = html.match(/<footer[\s\S]*?<\/footer>/); return !!m && /<svg[^>]*fill="currentColor"/.test(m[0]); })()],
  ['アイコン + ロゴのロックアップが Header / Access / Footer (rect ×3)、Hero にはない', count(/<rect\b/g) === 3 && count(/<circle\b/g) === 27 && /<header[\s\S]*?<rect\b[\s\S]*?<\/header>/.test(html) && /<section[^>]*id="access"[\s\S]*?<rect\b/.test(html) && /<footer[\s\S]*?<rect\b[\s\S]*?<\/footer>/.test(html) && !/<rect\b/.test(html.match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? '')],
  ['src/assets/icon.svg と public/favicon.svg が同一', readFileSync(new URL('../src/assets/icon.svg', import.meta.url), 'utf8') === readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')],
  ['h2 は 6 つ', count(/<h2\b/g) === 6],
  ['CSS: .reveal の animation-timeline が longhand で残っている', css.includes('animation-timeline:view()')],
  ['CSS: animation ショートハンドに timeline が畳み込まれていない', !/animation:[^;}]*view\(\)/.test(css)],
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
