import { test, expect } from '@playwright/test';

const BASE_PATH = '/najilaboule/';

// 自前コード由来かどうかを URL で判定する。Google Fonts / Maps など外部由来の
// コンソールノイズや失敗リクエストは LP の健全性とは無関係なので除外する
// (誤検知で自律マージを止めないため)。
const isOwnOrigin = (url: string) => url.includes('localhost:4173');

test('LP がランタイムエラーなく起動し、主要要素と資産が揃う', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    if (!isOwnOrigin(msg.location()?.url ?? '')) return;
    consoleErrors.push(msg.text());
  });

  const pageErrors: string[] = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const badResponses: string[] = [];
  page.on('response', (res) => {
    if (res.status() >= 400 && isOwnOrigin(res.url())) {
      badResponses.push(`${res.status()} ${res.url()}`);
    }
  });

  await page.goto(BASE_PATH, { waitUntil: 'networkidle' });

  // Loader を抜けて Hero の h1 が表示される = アプリが正常に mount した証明。
  // (build が通っても実行時にクラッシュすればここで落ちる)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10_000 });

  // 証拠として全画面スクショを残す (人間が非同期で目視確認できるよう artifact 化)。
  await page.screenshot({ path: 'test-results/smoke-home.png', fullPage: true });

  expect(pageErrors, `未捕捉の実行時エラー:\n${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `自前コード由来のコンソールエラー:\n${consoleErrors.join('\n')}`).toEqual([]);
  // ベースパス起因の資産崩れ (画像 404 等) を検出する。
  expect(badResponses, `4xx/5xx を返した自前リクエスト:\n${badResponses.join('\n')}`).toEqual([]);
});
