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
