# Playwright E2E (Chromium + WebKit、旧 WebKit 含む) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ブラウザで描いた結果の回帰を Chromium / WebKit (最新 + iOS 18 相当の WebKit 18.5) で自動検出する E2E を足し、Safari 17.4〜26.4 でヘッダーメニューが散る不具合をテストで固定して直す。

**Architecture:** `@playwright/test` を devDependency に入れ、`astro preview` (port 4173) を webServer にした 4 プロジェクト (chromium / webkit / mobile-chrome / mobile-safari) で `tests/e2e/lp.spec.ts` の 4 本を回す。旧 WebKit は `scripts/e2e-legacy.mjs` が `@playwright/test` を一時的にピン版へ差し替え、ブラウザを `.playwright-legacy/` に隔離して webkit 系 2 プロジェクトだけ回す。CI は既存 `verify` job が dist を artifact に上げ、新 job `e2e` (matrix `latest` / `webkit-legacy`) が受け取って実行する。

**Tech Stack:** Astro 7、`@playwright/test` 1.63.0 (最新) と 1.53.2 (WebKit 18.5)、GitHub Actions (ubuntu-latest、actions/upload-artifact@v7、actions/download-artifact@v8)。

**Spec:** `docs/superpowers/specs/2026-09-15-playwright-e2e-design.md`

## Global Constraints

- 配信 JS は増やさない (テストとスクリプトは dist に入らない。`npm run build` の verify-dist 52 件がそのまま通ること)
- `package-lock.json` は手編集しない。依存の追加は `npx -y npm@latest install -D ...` 経由。追加後に `npm run check:lockfile` を通す
- `.astro` / `.ts` / `.css` を触ったら `npm run lint` と `npm run build` を通す (`tsconfig.json` の include は `**/*` なので `playwright.config.ts` と `tests/` も `astro check` の対象)
- テストのセレクタは role と id を優先し、クラス名 (`.menu__list` など) は使わない
- テストは dist を事前ビルド前提で動く (`npm run build` → `npm run test:e2e`)。baseURL は base パスつき `http://localhost:4173/najilaboule/` なので `page.goto('./')` で開く (`'/'` だと base パスが消える)
- 旧 WebKit のピン版は `scripts/e2e-legacy.mjs` の定数 `LEGACY_VERSION = '1.53.2'` の 1 か所だけに書く
- コミットメッセージは日本語、末尾に `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`。add は自分が触ったファイルだけ明示する (作業ツリーに未追跡の `riz-desktop-slide1.jpeg` と `tmp/` があるが触らない)
- ブランチ `claude/playwright-e2e` で作業し、main には直接コミットしない

---

### Task 1: Playwright の基盤とテスト 1「ページが読み込める」

**Files:**
- Modify: `package.json` (devDependencies、scripts)
- Modify: `package-lock.json` (npm 経由でのみ)
- Create: `playwright.config.ts`
- Create: `tests/e2e/fixtures.ts`
- Create: `tests/e2e/lp.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `tests/e2e/fixtures.ts` が `test` と `expect` を export する (`@playwright/test` の `test` を拡張し、`page` に Google Maps の遮断とエラー収集を足したもの)。以降のタスクのテストは必ず `import { test, expect } from './fixtures';` を使う
- Produces: npm script `test:e2e` = `playwright test`
- Produces: プロジェクト名 `chromium` / `webkit` / `mobile-chrome` / `mobile-safari` (Task 3 の `--project=` で使う)

- [ ] **Step 1: `@playwright/test` を devDependency に入れる (lockfile は npm@latest 経由)**

```bash
cd /Users/tomitad/work/najilaboule
npx -y npm@latest install -D @playwright/test@1.63.0
npm run check:lockfile
git diff --stat package.json package-lock.json
```

Expected: `check:lockfile` が通る。package.json の devDependencies に `"@playwright/test": "^1.63.0"` が入る。

- [ ] **Step 2: ブラウザを入れる (Chromium と WebKit)**

```bash
npx playwright install chromium webkit
```

Expected: `~/Library/Caches/ms-playwright/` に `chromium-*` と `webkit-2359` が揃う (webkit-2359 は既にあれば再利用される)。

- [ ] **Step 3: `.gitignore` に生成物を足す**

`test-results` の行の直後に 3 行追加する:

```gitignore
test-results
playwright-report/
blob-report/
.playwright-legacy/
```

- [ ] **Step 4: `playwright.config.ts` を作る**

```ts
import { defineConfig, devices } from '@playwright/test';

/**
 * ブラウザで描いた結果の回帰検査 (E2E)。dist/index.html の静的な不変条件は scripts/verify-dist.mjs が見る。
 * dist は事前ビルド前提: `npm run build` → `npm run test:e2e`。
 * 旧 WebKit (iOS の 1 つ前のメジャー相当) で回すときは `npm run test:e2e:legacy` (scripts/e2e-legacy.mjs)。
 * 設計: docs/superpowers/specs/2026-09-15-playwright-e2e-design.md
 */
const CI = !!process.env.CI;
const PORT = 4173;
/** base パス (/najilaboule/) を含む。テストは page.goto('./') で開く ('/' だと base パスが消える) */
const BASE_URL = `http://localhost:${PORT}/najilaboule/`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: BASE_URL,
    // ローカルは起動中の preview (4173) を再利用する。CI は毎回起動
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
});
```

- [ ] **Step 5: `tests/e2e/fixtures.ts` を作る**

```ts
import { test as base, expect } from '@playwright/test';

/**
 * 全テスト共通の page:
 * - Google Maps の iframe (Access) は空の HTML で応答する。外部依存とネットワークのノイズを排除するため。
 *   abort だと Chromium が "Failed to load resource" を console error に出すので fulfill にする
 * - console の error と pageerror を集め、テスト後に 0 件であることを確認する
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/google\.com\/maps/, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '' }));
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await use(page);
    expect(errors, 'console error / pageerror が出ている').toEqual([]);
  },
});

export { expect };
```

- [ ] **Step 6: テスト 1 を書く (`tests/e2e/lp.spec.ts`)**

```ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('ページが読み込める (h1、フォント、Hero の写真)', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);

  // Zen Old Mincho は自前ホストでサブセット化されている。family 名にはハッシュが付く ("Zen Old Mincho-xxxx")
  const fontLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some((face) => face.family.includes('Zen Old Mincho') && face.status === 'loaded');
  });
  expect(fontLoaded, 'Zen Old Mincho が読み込まれていない').toBe(true);

  const hero = page.locator('#top img[fetchpriority="high"]');
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth), 'Hero の写真が描かれていない').toBeGreaterThan(0);
});
```

- [ ] **Step 7: npm script を足して、テストを走らせる**

`package.json` の scripts に追加 (`check:lockfile` の後):

```json
    "check:lockfile": "node scripts/check-lockfile.mjs",
    "test:e2e": "playwright test",
    "test:e2e:legacy": "node scripts/e2e-legacy.mjs"
```

(`test:e2e:legacy` の実体は Task 3 で作る。この時点では定義だけ)

```bash
npm run build
npm run test:e2e
```

Expected: `4 passed` (4 プロジェクト × 1 本)。`[...document.fonts]` で `astro check` が型エラーを出す場合は `Array.from(document.fonts)` に置き換える (実行結果は同じ)。

- [ ] **Step 8: lint を通す**

```bash
npm run lint
```

Expected: エラー 0 (`playwright.config.ts` と `tests/e2e/*.ts` も対象)。

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e/fixtures.ts tests/e2e/lp.spec.ts .gitignore
git commit -m "test: Playwright E2E の基盤と「ページが読み込める」テストを追加

Chromium / WebKit × PC / スマホの 4 プロジェクトで astro preview (4173) を検査する。
Google Maps の iframe は空応答に差し替え、console error と pageerror は 0 件を確認する。

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: テスト 2「ヘッダーメニューが開閉し、パネルが伸びたヘッダーの中に収まる」

**Files:**
- Modify: `tests/e2e/lp.spec.ts` (テスト 1 の後に追加)

**Interfaces:**
- Consumes: `./fixtures` の `test` / `expect`
- Produces: このテストが Task 3 (旧 WebKit) で赤になり、Task 4 (修正) で緑になる

- [ ] **Step 1: テスト 2 を書く**

`tests/e2e/lp.spec.ts` のテスト 1 の直後に追加:

```ts
test('ヘッダーメニューが開閉し、パネルが伸びたヘッダーの中に収まる', async ({ page }) => {
  const header = page.getByRole('banner');
  const toggle = header.getByRole('button', { name: 'メニュー' });
  const brand = header.getByRole('link', { name: /Naji la boule/ });
  const menu = page.locator('#menu');
  const closedHeight = (await header.boundingBox())!.height;

  await toggle.click();
  await expect(menu).toBeVisible();
  // 開く transition (500ms) が終わるのを待つ。ヘッダーの padding-bottom も同じ 500ms で伸びる
  await expect.poll(() => menu.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await menu.evaluate((el) => el.matches(':popover-open'))).toBe(true);

  const links = menu.getByRole('link');
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) await expect(link).toBeVisible();

  // 各 li の高さ。WebKit 17.4〜26.4 は popover の UA `height: fit-content` を fixed + grid でビューポート高に解決し、
  // li が 402px (スマホ) / 372px (PC) に伸びる。正常なら 47px / 56.75px
  const items = menu.locator('li');
  await expect(items).toHaveCount(2);
  for (const item of await items.all()) {
    const box = (await item.boundingBox())!;
    expect(box.height, 'li が縦に伸びている (popover の height を明示していない?)').toBeLessThan(100);
  }

  // パネルは伸びたヘッダーの地に収まり、リンクの左端はロックアップの左端と揃う
  const headerBox = (await header.boundingBox())!;
  const menuBox = (await menu.boundingBox())!;
  expect(menuBox.y + menuBox.height, 'パネルがヘッダーの地から下にはみ出している').toBeLessThanOrEqual(headerBox.y + headerBox.height + 1);
  const brandBox = (await brand.boundingBox())!;
  const firstLinkBox = (await links.first().boundingBox())!;
  expect(Math.abs(firstLinkBox.x - brandBox.x), 'リンクの左端がロックアップと揃っていない').toBeLessThanOrEqual(1);

  // もう一度押すと閉じ、ヘッダーの高さが戻る (Esc は iOS 相当で light dismiss が揺れるので使わない)
  await toggle.click();
  await expect(menu).toBeHidden();
  await expect.poll(async () => Math.abs((await header.boundingBox())!.height - closedHeight), 'ヘッダーの高さが閉じた値に戻らない').toBeLessThan(1);
});
```

- [ ] **Step 2: 最新ブラウザで走らせる (緑になるはず)**

```bash
npm run test:e2e
```

Expected: `8 passed` (4 プロジェクト × 2 本)。最新の WebKit 26.6 と Chromium ではバグが出ないので緑。赤になった場合は、`toggle.click()` が mobile-safari で効かないなら `toggle.tap()` に変える前に `hasTouch` を確認する (Playwright の mobile emulation では `click()` で動くのが通常)。

- [ ] **Step 3: lint**

```bash
npm run lint
```

Expected: エラー 0。

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/lp.spec.ts
git commit -m "test: ヘッダーメニューの開閉とパネルの寸法を検査する

li の高さ < 100px、パネルの下端 ≤ ヘッダーの下端、リンク左端 = ロックアップ左端。
WebKit 17.4〜26.4 では li が 400px 前後に伸びるので、旧 WebKit で回すと赤になる (次で固定・修正)。

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: 旧 WebKit で回すスクリプト (赤を確認する)

**Files:**
- Create: `scripts/e2e-legacy.mjs`

**Interfaces:**
- Consumes: npm script `test:e2e:legacy` (Task 1 で定義済み)、プロジェクト名 `webkit` / `mobile-safari`
- Produces: 定数 `LEGACY_VERSION = '1.53.2'` (WebKit 18.5)。CI (Task 6) は `npm run test:e2e:legacy` を呼ぶだけ

- [ ] **Step 1: `scripts/e2e-legacy.mjs` を作る**

```js
// 旧 WebKit (iOS の 1 つ前のメジャー相当) で E2E を回す。`npm run test:e2e:legacy`。
// Playwright はテスト runner とブラウザの版が結びついているので、@playwright/test ごと一時的に差し替える。
//   1. npm i --no-save @playwright/test@<LEGACY_VERSION>  (package.json と package-lock.json は触らない)
//   2. ブラウザは .playwright-legacy/ に隔離して入れる。共有キャッシュ (~/Library/Caches/ms-playwright) に入れると、
//      別版の CLI が「自分が知らないブラウザ」を GC して他のツールのブラウザまで消すため
//   3. webkit / mobile-safari の 2 プロジェクトだけ実行する
//   4. ローカルでは最後に npm ci で node_modules を復元する (CI では省く)
// ピン版の見直し: 年 1 回 (9 月の iOS メジャーリリース後)、iOS の 1 つ前のメジャーに合わせて上げる。
// Playwright と WebKit の対応は https://playwright.dev/docs/release-notes の各版の Browser Versions を見る。
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

let status = run('npm', ['i', '--no-save', `@playwright/test@${LEGACY_VERSION}`]);
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
```

- [ ] **Step 2: 旧 WebKit で走らせて、テスト 2 が赤になることを確認する**

```bash
npm run test:e2e:legacy
```

Expected: `@playwright/test@1.53.2` が入り、`.playwright-legacy/webkit-<ビルド番号>` (18.5 のビルド) がダウンロードされ、テスト 1 は緑、**テスト 2 が webkit / mobile-safari の両方で赤** (`li が縦に伸びている` の expect で `Received: 372` / `402`)。最後に `npm ci` で node_modules が 1.63.0 に戻る。

赤にならない場合は仮説が崩れているので止めて調べる (Header.astro を先に触らない)。

- [ ] **Step 3: node_modules が戻っていることと、最新版のテストがまだ動くことを確認する**

```bash
grep '"version"' node_modules/@playwright/test/package.json
npm run test:e2e
```

Expected: `1.63.0`、`8 passed`。

- [ ] **Step 4: Commit (テストは旧 WebKit で赤のまま。次のタスクで直す)**

```bash
git add scripts/e2e-legacy.mjs
git commit -m "test: 旧 WebKit (iOS の 1 つ前のメジャー相当) で E2E を回すスクリプト

@playwright/test を一時的に 1.53.2 (WebKit 18.5) に差し替え、ブラウザは .playwright-legacy/ に
隔離して webkit / mobile-safari だけ実行する。ローカルは最後に npm ci で復元。

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Header.astro の修正 (旧 WebKit で緑にする)

**Files:**
- Modify: `src/components/Header.astro` (`.menu__list` のルール。`position: fixed;` の行の直後)

**Interfaces:**
- Consumes: Task 2 のテスト 2、Task 3 の `npm run test:e2e:legacy`

- [ ] **Step 1: `.menu__list` に `height: auto` を足す**

`src/components/Header.astro` の `.menu__list {` ブロックで、`position: fixed;` の直後に追加:

```css
  .menu__list {
    position: fixed;
    /* UA の height: fit-content を打ち消す。WebKit 17.4〜26.4 は position: fixed + display: grid の要素の fit-content を
       包含ブロック (ビューポート) の高さに解決し、パネルが画面いっぱいに伸びて li が 400px 前後になる (26.5 で修正済み) */
    height: auto;
    inset: calc(var(--header-pad) * 2 + var(--lockup-height)) 0 auto;
```

- [ ] **Step 2: ビルドして旧 WebKit で走らせる (緑になるはず)**

```bash
npm run build
npm run test:e2e:legacy
```

Expected: verify-dist 52 件通過。旧 WebKit で `4 passed` (2 プロジェクト × 2 本)。

- [ ] **Step 3: 最新ブラウザと lint も通す**

```bash
npm run test:e2e
npm run lint
```

Expected: `8 passed`、lint エラー 0。

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "fix: Safari 17.4〜26.4 でヘッダーメニューの項目が画面いっぱいに散るのを直す

popover の UA スタイル height: fit-content を、古い WebKit は fixed + grid の要素で
包含ブロック (ビューポート) の高さに解決する。height: auto を明示して打ち消す。

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: テスト 3「4 章の見出しと写真」とテスト 4「BOUTIQUE と TEL」

**Files:**
- Modify: `tests/e2e/lp.spec.ts` (テスト 2 の後に追加)

**Interfaces:**
- Consumes: `./fixtures` の `test` / `expect`

- [ ] **Step 1: テスト 3 と 4 を書く**

`tests/e2e/lp.spec.ts` のテスト 2 の直後に追加:

```ts
/** 章の並び (src/i18n の CHAPTER_KEYS と同じ id) */
const CHAPTERS = ['concept', 'sake', 'obanzai', 'riz'] as const;

test('4 章の見出しと写真が描かれる', async ({ page }) => {
  for (const id of CHAPTERS) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading', { level: 2 }), `${id} の見出しが見えない`).toBeVisible();

    // 写真は loading="lazy"。スクロールで表示してから描画を待つ (最初のスライドの img)
    const photo = section.locator('img').first();
    await photo.scrollIntoViewIfNeeded();
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => (img.complete ? img.naturalWidth : 0)), `${id} の写真が描かれていない`)
      .toBeGreaterThan(0);
  }
});

test('BOUTIQUE のボタンと TEL のリンクが見える', async ({ page }) => {
  const cta = page.locator('#shop').getByRole('link', { name: /ONLINE SHOP/ });
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();

  const tel = page.locator('#access').getByRole('link', { name: '03-6228-5803' });
  await tel.scrollIntoViewIfNeeded();
  await expect(tel).toBeVisible();
});
```

- [ ] **Step 2: 走らせる**

```bash
npm run test:e2e
npm run lint
```

Expected: `16 passed` (4 プロジェクト × 4 本)、lint エラー 0。Access の Google Maps は fixture が空応答にしているので、iframe 由来の console error は出ない。

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/lp.spec.ts
git commit -m "test: 4 章の見出しと写真、BOUTIQUE と TEL のリンクの描画を検査する

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: CI に e2e job を足す

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `docs/superpowers/specs/2026-09-15-playwright-e2e-design.md` (matrix 名 `webkit-18.5` → `webkit-legacy`。ピン版はスクリプトの 1 か所に置くので、job 名に版を埋めない)

**Interfaces:**
- Consumes: npm script `test:e2e` / `test:e2e:legacy`

- [ ] **Step 1: `verify` job の末尾で dist を artifact に上げる**

`.github/workflows/ci.yml` の `- name: Build` ステップの直後に追加:

```yaml
      - name: Build
        run: npm run build

      # e2e job が同じ dist を使う (ビルドは 1 回だけ)
      - name: Upload dist for e2e
        uses: actions/upload-artifact@v7
        with:
          name: dist
          path: dist
          retention-days: 1
```

- [ ] **Step 2: `e2e` job を足す**

ファイル末尾 (jobs の下) に追加:

```yaml
  # ブラウザで描いた結果の回帰検査 (Playwright)。latest は同梱の Chromium / WebKit で 4 プロジェクト、
  # webkit-legacy は iOS の 1 つ前のメジャー相当の WebKit で webkit 系 2 プロジェクト (ピン版は scripts/e2e-legacy.mjs)
  e2e:
    name: e2e (${{ matrix.name }})
    needs: verify
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        name: [latest, webkit-legacy]
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Download dist
        uses: actions/download-artifact@v8
        with:
          name: dist
          path: dist

      - name: Install browsers
        if: matrix.name == 'latest'
        run: npx playwright install --with-deps chromium webkit

      - name: Run E2E (latest Chromium / WebKit)
        if: matrix.name == 'latest'
        run: npm run test:e2e

      - name: Run E2E (legacy WebKit)
        if: matrix.name == 'webkit-legacy'
        run: npm run test:e2e:legacy

      - name: Upload report
        if: failure()
        uses: actions/upload-artifact@v7
        with:
          name: playwright-report-${{ matrix.name }}
          path: playwright-report
          retention-days: 7
```

ファイル冒頭のコメント `# PR の検証用ワークフロー (build / lint)。` を `# PR の検証用ワークフロー (build / lint / e2e)。` に直す。

- [ ] **Step 3: YAML の構文を確認する**

```bash
npx -y js-yaml .github/workflows/ci.yml > /dev/null && echo "yaml ok"
```

Expected: `yaml ok`。

- [ ] **Step 4: spec の matrix 名を直す**

`docs/superpowers/specs/2026-09-15-playwright-e2e-design.md` の CI 節で `webkit-18.5` を `webkit-legacy` に置き換える (2 か所: 「新 job `e2e` (matrix: latest / webkit-18.5)」の構成の行と「matrix `webkit-18.5`:」の行、および受け入れ基準の `e2e (webkit-18.5)`)。理由を 1 文足す: 「job 名に版を埋めないのは、ピン版を `scripts/e2e-legacy.mjs` の 1 か所で管理するため」。

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml docs/superpowers/specs/2026-09-15-playwright-e2e-design.md
git commit -m "ci: Playwright E2E を latest / webkit-legacy の 2 job で回す

verify が dist を artifact に上げ、e2e job が受け取って実行する (ビルドは 1 回)。
失敗時は playwright-report を 7 日保持する。

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: CLAUDE.md の更新

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: コマンドを足す**

「## コマンド」のコードブロックで `npm run preview` の行の後に追加:

```bash
npm run test:e2e     # Playwright (Chromium / WebKit × PC / スマホ)。dist を使うので先に npm run build。起動中の preview (4173) があれば再利用
npm run test:e2e:legacy  # 旧 WebKit (iOS の 1 つ前のメジャー相当) で webkit 系 2 プロジェクトだけ。@playwright/test を一時的に差し替え、最後に npm ci で戻す
```

コードブロック直後の文を次に差し替える:

`.astro` / `.ts` / `.css` を編集したら `npm run lint`、`npm run build`、`npm run test:e2e` を自分で実行して検証する。エラーはその場で直してから先に進む。ヘッダーや popover など WebKit で挙動が変わりやすい箇所を触ったら `npm run test:e2e:legacy` も通す。

- [ ] **Step 2: 構造を足す**

「## 構造」のツリーで `scripts/verify-dist.mjs` の行の後に追加:

```
scripts/e2e-legacy.mjs   旧 WebKit で E2E を回す (ピン版 LEGACY_VERSION はここだけ。年 1 回、9 月の iOS メジャー後に 1 つ前のメジャーへ上げる)
playwright.config.ts     E2E の設定 (4 プロジェクト、webServer は astro preview --port 4173、baseURL は base パスつき)
tests/e2e/               fixtures.ts (Google Maps の遮断、console error / pageerror の収集) と lp.spec.ts (読み込み / ヘッダーメニュー / 4 章 / BOUTIQUE と TEL)
```

- [ ] **Step 3: ルールを足す**

「## ルール」の末尾に追加:

```
- **popover / dialog など top layer の要素は UA スタイルに頼らずサイズを明示する** (`height: auto` など)。UA の `height: fit-content` は WebKit 17.4〜26.4 で fixed + grid の要素がビューポート高に解決される (2026-09-15 のメニューの不具合)。`margin: auto` / `border` / `padding` / `overflow: auto` / `color` / `background-color` も UA 既定があることを忘れない
- E2E のセレクタは role と id を優先し、クラス名は使わない。href や DOM 構造の検査は `verify-dist.mjs`、描いた結果の検査は Playwright と分担する
```

- [ ] **Step 4: CI の説明を足す**

「## CI とデプロイ」の 1 行目を次に差し替える:

- PR と main への push で CI (`.github/workflows/ci.yml`) が走る: `verify` (check:lockfile → `npm ci` → lint → build → dist を artifact に) と `e2e` (matrix `latest` = 同梱の Chromium / WebKit で 4 プロジェクト、`webkit-legacy` = 旧 WebKit で webkit 系 2 プロジェクト)。**両方の緑を確認してからマージする**(ブランチ保護・auto-merge は使わない手動運用)。失敗時は artifact `playwright-report-<name>` にレポートが残る

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md に E2E のコマンド・構造・ルール (top layer 要素は UA スタイルに頼らない) を追記

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: 総合検証と PR

**Files:** なし (検証と push のみ)

- [ ] **Step 1: 全部通す**

```bash
npm run check:lockfile
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:legacy
git status --short
```

Expected: すべて成功。`test:e2e` は `16 passed`、`test:e2e:legacy` は `8 passed`。`git status` に自分の未コミットの変更が残っていない (未追跡の `riz-desktop-slide1.jpeg` と `tmp/` は元からあるもので触らない)。

- [ ] **Step 2: push して PR を作る**

```bash
git push -u origin claude/playwright-e2e
gh pr create --title "Playwright E2E (Chromium + WebKit、旧 WebKit 含む) を導入し、Safari 17.4〜26.4 のメニュー崩れを修正" --body "$(cat <<'EOF'
## 概要

- Safari (WebKit 17.4〜26.4) でヘッダーメニューを開くと項目が画面いっぱいに散る不具合を修正 (`.menu__list { height: auto }`)。原因は popover の UA スタイル `height: fit-content` を古い WebKit が fixed + grid の要素でビューポート高に解決すること
- ブラウザで描いた結果の回帰を検出する Playwright E2E を追加。Chromium / WebKit × PC / スマホの 4 プロジェクトで 4 本 (読み込み / ヘッダーメニューの開閉と寸法 / 4 章 / BOUTIQUE と TEL)
- 旧 WebKit (iOS 18 相当の 18.5) でも同じテストを回す `scripts/e2e-legacy.mjs`。修正前はこのテストが赤になることを確認済み
- CI に `e2e (latest)` / `e2e (webkit-legacy)` を追加。verify の dist を artifact 経由で共有し、ビルドは 1 回

## 設計・計画

- `docs/superpowers/specs/2026-09-15-playwright-e2e-design.md`
- `docs/superpowers/plans/2026-09-15-playwright-e2e.md`

## 確認

- `npm run lint` / `npm run build` (verify-dist 52 件) / `npm run test:e2e` (16 passed) / `npm run test:e2e:legacy` (8 passed) をローカルで通した
- CI の verify / e2e (latest) / e2e (webkit-legacy) の緑を確認してからマージする

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: CI を見届ける**

```bash
gh pr checks --watch
```

Expected: `verify`、`e2e (latest)`、`e2e (webkit-legacy)` がすべて pass。赤があれば `gh run view --log-failed` でログを読み、直してから push し直す。

- [ ] **Step 4: 報告してマージの判断を待つ**

PR の URL と CI の結果を報告する。マージは main へのデプロイを伴うので、ユーザーの指示があってから `gh pr merge --merge` する (勝手にマージしない)。
