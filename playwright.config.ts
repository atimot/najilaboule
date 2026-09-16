import { defineConfig, devices } from '@playwright/test';

/**
 * ブラウザで描いた結果の回帰検査 (E2E)。dist/index.html の静的な不変条件は scripts/verify-dist.mjs が見る。
 * dist は事前ビルド前提: `npm run build` → `npm run test:e2e`。
 * 旧 WebKit (iOS の 1 つ前のメジャー相当) で回すときは `npm run test:e2e:legacy` (scripts/e2e-legacy.mjs)。
 * 設計: docs/superpowers/specs/2026-09-15-playwright-e2e-design.md
 */
const CI = !!process.env.CI;
/** テスト専用の preview のポート。手で立てる `npm run preview` (4173) とは分け、テストは毎回自分で立てる
    (別のチェックアウトの dist を拾って偽の緑になるのを防ぐ)。別ポートにしたいときは E2E_PORT */
const PORT = Number(process.env.E2E_PORT ?? 4174);
if (!Number.isInteger(PORT) || PORT <= 0) throw new Error(`E2E_PORT が不正です: ${process.env.E2E_PORT}`);
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
    // 起動中のサーバーは再利用しない (別のチェックアウトの dist を検査してしまうため)。ポートが使用中なら Playwright がエラーで止まる
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
