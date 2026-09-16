// 旧 WebKit (iOS の 1 つ前のメジャー相当) で E2E を回す。`npm run test:e2e:legacy`。
// Playwright はテスト runner とブラウザの版が結びついているので、@playwright/test ごと一時的に差し替える。
//   1. npm i --no-save @playwright/test@<LEGACY_VERSION>  (package.json と package-lock.json は触らない)
//   2. ブラウザは .playwright-legacy/ に隔離して入れる。共有キャッシュ (~/Library/Caches/ms-playwright) に入れると、
//      別版の CLI が「自分が知らないブラウザ」を GC して他のツールのブラウザまで消すため
//   3. webkit / mobile-safari の 2 プロジェクトだけ実行する
//   4. ローカルでは最後に npm ci で node_modules を復元する (CI では省く)
// ピン版の見直し: 年 1 回 (9 月の iOS メジャーリリース後)、iOS の 1 つ前のメジャーに合わせて上げる。
// Playwright と WebKit の対応は https://playwright.dev/docs/release-notes の各版の Browser Versions を見る。
// 注意: ピン版を WebKit 26.5 以上に上げると、Header.astro の .menu__list { height: auto } が直している fit-content バグを
// 再現するブラウザがなくなり、テスト 2 はその回帰を検知しなくなる。上げるときは height: auto を一時的に外して赤になる版かを確かめる。
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

/** WebKit 18.5 = iOS 18 相当 */
const LEGACY_VERSION = '1.53.2';
const CI = !!process.env.CI;
const browsersPath = resolve('.playwright-legacy');

/** コマンドを実行して終了コードを返す (出力はそのまま流す) */
function run(command, args, extraEnv = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...extraEnv } });
  return result.status ?? 1;
}

let status = run('npm', ['i', '--no-save', '--no-package-lock', `@playwright/test@${LEGACY_VERSION}`]);
if (status === 0) {
  status = run('npx', ['playwright', 'install', ...(CI ? ['--with-deps'] : []), 'webkit'], { PLAYWRIGHT_BROWSERS_PATH: browsersPath });
}
if (status === 0) {
  status = run('npx', ['playwright', 'test', '--project=webkit', '--project=mobile-safari'], { PLAYWRIGHT_BROWSERS_PATH: browsersPath });
}
if (!CI) {
  const restored = run('npm', ['ci']);
  if (status === 0) status = restored;
}
process.exit(status);
