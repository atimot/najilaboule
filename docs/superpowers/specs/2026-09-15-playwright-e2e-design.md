# Playwright E2E (Chromium + WebKit、旧 WebKit 含む) の導入 — 設計

作成: 2026-09-15。ブランチ `claude/playwright-e2e`。

## 背景

2026-09-15、Safari (iOS を含む WebKit 17.4〜26.4) でヘッダーメニューを開くと項目が散る不具合が報告された。原因は popover の UA スタイル `height: fit-content` を、古い WebKit が `position: fixed` + `display: grid` の要素に対して包含ブロック (ビューポート) の高さに解決すること。`<ul>` がビューポート高になり grid の行が伸びて 2 本目のリンクがヘッダーの地の外に落ちる。26.5 で修正済み。

既存の検査 `scripts/verify-dist.mjs` は `dist/index.html` の静的な不変条件 (52 件) を見るだけで、ブラウザで描いた結果は見ていない。Chrome だけで確認していると WebKit 固有の差に気づけない。

## 目的

- ブラウザで描いた結果の回帰を、Chromium と WebKit の両方で自動検出する
- 最新の WebKit だけでなく、iOS の 1 つ前のメジャーに相当する古い WebKit でも同じテストを回し、旧版固有のバグも拾う
- 今回の不具合を「テストが赤 → 修正で緑」の形で固定する

## 範囲外 (今回やらない)

Firefox、axe (アクセシビリティ自動検査)、スクリーンショット比較、CI でのブラウザキャッシュ、実機クラウド。`href` や DOM 構造の検査は verify-dist に任せ、重複させない。

## 構成

```
playwright.config.ts          プロジェクト 4 つ、webServer (astro preview --port 4173)、baseURL
tests/e2e/fixtures.ts         page を拡張: Google Maps の iframe を空応答に差し替え、console error / pageerror を集めて teardown で 0 件を確認
tests/e2e/lp.spec.ts          テスト本体 (下記 4 本)
scripts/e2e-legacy.mjs        旧 WebKit で回す手順を 1 か所に (ピン版の定数、ブラウザの隔離、node_modules の復元)
.github/workflows/ci.yml      verify が dist を artifact に上げ、新 job e2e (matrix: latest / webkit-legacy) が受け取って実行
src/components/Header.astro   修正: .menu__list に height: auto
CLAUDE.md / .gitignore        コマンド・構造・ルールの追記、生成物の除外
```

`tsconfig.json` は `**/*` を含むので、`npm run lint` (astro check) が `playwright.config.ts` と `tests/` も型検査する。

## プロジェクト (playwright.config.ts)

| name | device | 幅 |
| --- | --- | --- |
| chromium | Desktop Chrome | 1280×800 |
| webkit | Desktop Safari | 1280×800 |
| mobile-chrome | Pixel 7 | 端末既定 |
| mobile-safari | iPhone 15 | 端末既定 |

- `testDir: 'tests/e2e'`、`fullyParallel: true`、`forbidOnly` と `retries: 1` は CI のみ、`trace: 'retain-on-failure'`
- `reporter`: ローカルは `list`、CI は `list` + `html` (開かない)
- `use.baseURL`: `http://localhost:4173/najilaboule/` (base パスつき)
- `webServer`: `npx astro preview --port 4173`、`url` は baseURL、ローカルは起動中のサーバーを再利用 (`reuseExistingServer: !CI`)。**dist は事前ビルド前提** (`npm run build` → `npm run test:e2e`)。dist がなければ preview が失敗して止まる

## テスト (tests/e2e/lp.spec.ts)

4 プロジェクトすべてで同じ 4 本を回す。セレクタは role と id を優先し、クラス名は避ける。

1. **ページが読み込める** — `h1` が 1 つ。`document.fonts.ready` の後に family が `Zen Old Mincho` を含む FontFace が `loaded`。Hero の `img[fetchpriority="high"]` が `naturalWidth > 0`。fixture が console error / pageerror を 0 件で確認
2. **ヘッダーメニューが開閉し、パネルがヘッダーの中に収まる** — `header` 内の button「メニュー」を押す → `#menu` が `:popover-open`、不透明度が 1 になるまで待つ (transition 500ms)。リンク 2 本が見える。**各 `li` の高さが 100px 未満** (今回のバグでは 402px / 372px になる)。パネルの下端 ≤ ヘッダーの下端 + 1px (伸びた地に収まる)。リンクの左端とロックアップ (link「Naji la boule …」) の左端の差 ≤ 1px。もう一度ボタンを押すと `#menu` が消え、ヘッダーの高さが閉じた値に戻る (Esc は iOS 相当で挙動が揺れるので使わない)
3. **4 章の見出しと写真が描かれる** — `#concept #sake #obanzai #riz` それぞれで `h2` が見え、最初の写真 (`img`) をスクロールで表示して `naturalWidth > 0` になるまで待つ (lazy load)
4. **BOUTIQUE と TEL が見える** — `#shop` の link「ONLINE SHOP …」と `#access` の link「03-6228-5803」がスクロール後に見える

fixture (tests/e2e/fixtures.ts): `page.route(/google\.com\/maps/)` を `200` の空 HTML で fulfill (外部依存とネットワークのノイズを排除。abort だと console error が出る)。`console` の `error` と `pageerror` を配列に集め、テスト後に `expect(errors).toEqual([])`。

## 旧 WebKit (scripts/e2e-legacy.mjs)

- Playwright はテスト runner とブラウザの版が結びついているので、古い WebKit を使うには `@playwright/test` ごと差し替える。`npm i --no-save @playwright/test@<PIN>` で node_modules だけ入れ替える (package.json と lockfile は触らない)
- ブラウザは `PLAYWRIGHT_BROWSERS_PATH=.playwright-legacy` に隔離して入れる。共有キャッシュ (`~/Library/Caches/ms-playwright`) に入れると別版の CLI が他のブラウザを GC してしまうため
- 実行は `--project=webkit --project=mobile-safari` の 2 つだけ
- ローカルでは最後に `npm ci` で node_modules を復元する (CI では省略)
- **ピン版**: `1.53.2` (WebKit 18.5 = iOS 18 相当)。定数はこのスクリプトの 1 か所だけ。見直しルール: iOS の 1 つ前のメジャーに合わせて年 1 回 (9 月の iOS メジャーリリース後) に上げる。Playwright と WebKit の対応は https://playwright.dev/docs/release-notes で確認する
- `npm run test:e2e:legacy` で呼ぶ

## CI (.github/workflows/ci.yml)

- `verify` (既存): build の後に `dist/` を artifact `dist` (保持 1 日) に上げる
- `e2e` (新規、`needs: verify`、`fail-fast: false`):
  - job 名に版を埋めないのは、ピン版を `scripts/e2e-legacy.mjs` の 1 か所で管理するため
  - matrix `latest`: `npm ci` → `npx playwright install --with-deps chromium webkit` → artifact を `dist/` に展開 → `npx playwright test`
  - matrix `webkit-legacy`: `npm ci` → artifact 展開 → `node scripts/e2e-legacy.mjs` (CI では `--with-deps` を付け、`npm ci` の復元は省く)
  - 失敗時のみ `playwright-report/` を artifact `playwright-report-<name>` (保持 7 日) に上げる
- ビルドは verify の 1 回だけ。PR と main への push で走り、マージ前に両方の緑を確認する運用は従来どおり

## 修正 (src/components/Header.astro)

`.menu__list` に `height: auto;` を足す。UA の `fit-content` を打ち消すため。コメントに WebKit 17.4〜26.4 のバグ (positioned な grid の fit-content が包含ブロック高になる) と、26.5 で直っていることを書く。手順は TDD: 先にテスト 2 を書き `npm run test:e2e:legacy` で赤を確認 → 修正 → 緑。最新 WebKit と Chromium ではどちらでも緑 (値は変わらない)。

## ドキュメント

- CLAUDE.md: コマンドに `npm run test:e2e` (要 build) と `npm run test:e2e:legacy`、構造に `playwright.config.ts` / `tests/e2e/` / `scripts/e2e-legacy.mjs`、ルールに「popover / dialog など top layer の要素は UA スタイル (`height: fit-content` / `margin: auto` / `overflow: auto` など) に頼らずサイズを明示する」「`.astro` / `.css` を触ったら `npm run test:e2e` も通す」「旧 WebKit のピン版は年 1 回見直す」
- .gitignore: `playwright-report/`、`blob-report/`、`.playwright-legacy/` (`test-results` は既にある)

## 受け入れ基準

- `npm run lint`、`npm run build`、`npm run test:e2e` が 4 プロジェクトすべて緑
- `npm run test:e2e:legacy` が Header.astro の修正前は赤 (テスト 2 の li 高さ)、修正後は緑
- CI の `verify` / `e2e (latest)` / `e2e (webkit-legacy)` が緑
- `package-lock.json` は `npx -y npm@latest` 経由で更新し、`npm run check:lockfile` が通る
- verify-dist の 52 件はそのまま通る
