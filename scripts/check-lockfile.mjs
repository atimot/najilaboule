// package-lock.json に wasm 系 optional 依存 (@emnapi/*) が含まれているか検査する。
// macOS の古い npm で lockfile を再生成すると脱落し、ローカルは通るのに Linux CI の
// npm ci だけが落ちる事故を、push 前に検出するための単一の正 (skills から参照)。
import { readFileSync } from 'node:fs';

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
const need = ['@emnapi/core', '@emnapi/runtime'];
const missing = need.filter(
  (pkg) => !Object.keys(lock.packages).some((k) => k.endsWith('node_modules/' + pkg)),
);

if (missing.length) {
  console.error('lockfile に欠落:', missing.join(', '));
  console.error('`npx -y npm@latest install --package-lock-only` で再生成してください。');
  process.exit(1);
}
console.log('wasm optional deps OK');
