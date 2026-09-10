// dist/index.html の不変条件を検査する。`npm run build` の最後に走る。
// 検査を足すときは checks に [名前, 真偽値] を追加する。
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) ?? []).length;

const checks = [
  ['html lang="ja"', /<html[^>]*\slang="ja"/.test(html)],
  ['配信 JS ゼロ (JSON-LD 以外の <script> がない)', !/<script\b(?![^>]*application\/ld\+json)/.test(html)],
  ['Google Fonts への外部参照がない', !/fonts\.(googleapis|gstatic)\.com/.test(html)],
  ['Playfair Display の @font-face が自前ホストされている', /@font-face[^}]*Playfair Display/.test(html) || /_astro\/fonts\//.test(html)],
  ['canonical', html.includes('<link rel="canonical" href="https://atimot.github.io/najilaboule/"')],
  ['JSON-LD Restaurant', /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"Restaurant"/.test(html)],
  ['og:image', html.includes('content="https://atimot.github.io/najilaboule/images/ogp.jpg"')],
  ['skip link', html.includes('class="skip-link"')],
  ['theme-color', html.includes('<meta name="theme-color" content="#241816"')],
  ['<header> がある', /<header\b/.test(html)],
  ['ヘッダーに電話予約リンク', /<header[\s\S]*?href="tel:03-6228-5803"[\s\S]*?<\/header>/.test(html)],
  ['ナビに aria-label', /<nav[^>]*aria-label="メインナビゲーション"/.test(html)],
  ['h1 はちょうど 1 つ', count(/<h1\b/g) === 1],
  ['#top セクション', /<section[^>]*id="top"/.test(html)],
  ['Hero 画像は AVIF source + fetchpriority=high', /<source[^>]*type="image\/avif"/.test(html) && /<img[^>]*fetchpriority="high"/.test(html)],
  ['Hero 画像の preload (avif)', /<link rel="preload" as="image" type="image\/avif" imagesrcset="[^"]+" imagesizes="100vw" fetchpriority="high">/.test(html)],
  ['#philosophy セクション', /<section[^>]*id="philosophy"/.test(html)],
  ['Philosophy の 3 幕 (article ×3)', count(/<article\b/g) === 3],
  ['Philosophy の写真 alt (デスクトップ用とモバイル用)', count(/alt="指先に乗せた一粒の米"/g) === 2 && count(/alt="水引で結ばれた米の贈り物"/g) >= 2],
  ['#experience セクション', /<section[^>]*id="experience"/.test(html)],
  ['RIZ / SOUPE / MARIAGE ラベル', ['RIZ', 'SOUPE', 'MARIAGE'].every((l) => html.includes(`>${l}</span>`))],
  ['Experience の h2 ×3', ['結ぶ、米。', 'ほどける、汁。', '揺蕩う、盃。'].every((s) => new RegExp(`<h2[^>]*>\\s*${s}\\s*</h2>`).test(html))],
  ['#shop セクション', /<section[^>]*id="shop"/.test(html)],
  ['ONLINE SHOP は外部リンク属性つき', /<a[^>]*href="https:\/\/iyahiko\.square\.site\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/.test(html)],
  ['#access セクション', /<section[^>]*id="access"/.test(html)],
  ['地図 iframe に title と lazy', /<iframe[^>]*title="店舗の地図[^"]*"[^>]*loading="lazy"/.test(html)],
  ['<footer> に著作権表記', /<footer[^>]*>[\s\S]*All Rights Reserved\.[\s\S]*<\/footer>/.test(html)],
  ['h2 は 8 つ', count(/<h2\b/g) === 8],
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
