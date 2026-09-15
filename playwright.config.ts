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
