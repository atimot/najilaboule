import { defineConfig, devices } from '@playwright/test';

// LP の「起動スモーク」専用の最小構成。
// - vite preview を自動起動し、ビルド成果物 (dist) をベースパス付きで配信して検証する
// - reducedMotion: 'reduce' でアプリ側の Loader 短縮・アニメ無効化を効かせ、決定論的かつ高速にする
const PREVIEW_ORIGIN = 'http://localhost:4173';
const BASE_PATH = '/najilaboule/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: PREVIEW_ORIGIN,
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview',
    url: `${PREVIEW_ORIGIN}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
