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
