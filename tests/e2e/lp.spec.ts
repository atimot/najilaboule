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
