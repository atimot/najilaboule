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
