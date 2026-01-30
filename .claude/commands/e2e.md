---
description: Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts.
---

# E2E Command

このコマンドは**e2e-runner**エージェントを呼び出し、Playwrightを使用してE2Eテストの生成、メンテナンス、実行を行います。

## このコマンドの機能

1. **テストジャーニーの生成** - ユーザーフロー用のPlaywrightテストを作成
2. **E2Eテストの実行** - ブラウザ間でテストを実行
3. **アーティファクトのキャプチャ** - 失敗時のスクリーンショット、ビデオ、トレース
4. **結果のアップロード** - HTMLレポートとJUnit XML
5. **不安定なテストの特定** - 不安定なテストを隔離

## 使用するタイミング

`/e2e`を使用する場面:
- 重要なユーザージャーニーのテスト（ログイン、取引、決済）
- マルチステップフローがエンドツーエンドで動作することの検証
- UIインタラクションとナビゲーションのテスト
- フロントエンドとバックエンド間の統合の検証
- 本番デプロイの準備

## 動作方法

e2e-runnerエージェントは以下を行います:

1. **ユーザーフローを分析**し、テストシナリオを特定
2. **Playwrightテストを生成**（Page Object Modelパターンを使用）
3. **複数のブラウザでテストを実行**（Chrome、Firefox、Safari）
4. **失敗をキャプチャ**（スクリーンショット、ビデオ、トレース）
5. **レポートを生成**（結果とアーティファクト）
6. **不安定なテストを特定**し、修正を推奨

## 使用例

```
User: /e2e マーケット検索と表示フローをテスト

Agent (e2e-runner):
# E2E Test Generation: Market Search and View Flow

## 特定されたテストシナリオ

**ユーザージャーニー:** マーケット検索 → 結果表示 → マーケットクリック → 詳細表示

**テストカバレッジ:**
1. マーケットページに移動
2. セマンティック検索を実行
3. 検索結果を確認
4. 最初の結果をクリック
5. マーケット詳細ページが読み込まれることを確認
6. チャートがレンダリングされることを確認

## 生成されたテストコード

```typescript
// tests/e2e/markets/search-and-view.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'
import { MarketDetailsPage } from '../../pages/MarketDetailsPage'

test.describe('Market Search and View Flow', () => {
  test('user can search markets and view details', async ({ page }) => {
    // 1. マーケットページに移動
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // ページが読み込まれたことを確認
    await expect(page).toHaveTitle(/Markets/)
    await expect(page.locator('h1')).toContainText('Markets')

    // 2. セマンティック検索を実行
    await marketsPage.searchMarkets('election')

    // APIレスポンスを待機
    await page.waitForResponse(resp =>
      resp.url().includes('/api/markets/search') && resp.status() === 200
    )

    // 3. 検索結果を確認
    const marketCards = marketsPage.marketCards
    await expect(marketCards.first()).toBeVisible()
    const resultCount = await marketCards.count()
    expect(resultCount).toBeGreaterThan(0)

    // 検索結果のスクリーンショットを撮影
    await page.screenshot({ path: 'artifacts/search-results.png' })

    // 4. 最初の結果をクリック
    const firstMarketTitle = await marketCards.first().textContent()
    await marketCards.first().click()

    // 5. マーケット詳細ページが読み込まれることを確認
    await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)

    const detailsPage = new MarketDetailsPage(page)
    await expect(detailsPage.marketName).toBeVisible()
    await expect(detailsPage.marketDescription).toBeVisible()

    // 6. チャートがレンダリングされることを確認
    await expect(detailsPage.priceChart).toBeVisible()

    // マーケット名が一致することを確認
    const detailsTitle = await detailsPage.marketName.textContent()
    expect(detailsTitle?.toLowerCase()).toContain(
      firstMarketTitle?.toLowerCase().substring(0, 20) || ''
    )

    // マーケット詳細のスクリーンショットを撮影
    await page.screenshot({ path: 'artifacts/market-details.png' })
  })

  test('search with no results shows empty state', async ({ page }) => {
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // 存在しないマーケットを検索
    await marketsPage.searchMarkets('xyznonexistentmarket123456')

    // 空の状態を確認
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    await expect(page.locator('[data-testid="no-results"]')).toContainText(
      /no.*results|no.*markets/i
    )

    const marketCount = await marketsPage.marketCards.count()
    expect(marketCount).toBe(0)
  })

  test('can clear search and see all markets again', async ({ page }) => {
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // 初期マーケット数
    const initialCount = await marketsPage.marketCards.count()

    // 検索を実行
    await marketsPage.searchMarkets('trump')
    await page.waitForLoadState('networkidle')

    // フィルタされた結果を確認
    const filteredCount = await marketsPage.marketCards.count()
    expect(filteredCount).toBeLessThan(initialCount)

    // 検索をクリア
    await marketsPage.searchInput.clear()
    await page.waitForLoadState('networkidle')

    // すべてのマーケットが再度表示されることを確認
    const finalCount = await marketsPage.marketCards.count()
    expect(finalCount).toBe(initialCount)
  })
})
```

## テストの実行

```bash
# 生成されたテストを実行
npx playwright test tests/e2e/markets/search-and-view.spec.ts

Running 3 tests using 3 workers

  ✓  [chromium] › search-and-view.spec.ts:5:3 › user can search markets and view details (4.2s)
  ✓  [chromium] › search-and-view.spec.ts:52:3 › search with no results shows empty state (1.8s)
  ✓  [chromium] › search-and-view.spec.ts:67:3 › can clear search and see all markets again (2.9s)

  3 passed (9.1s)

生成されたアーティファクト:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## テストレポート

```
╔══════════════════════════════════════════════════════════════╗
║                    E2E Test Results                          ║
╠══════════════════════════════════════════════════════════════╣
║ Status:     ✅ ALL TESTS PASSED                              ║
║ Total:      3 tests                                          ║
║ Passed:     3 (100%)                                         ║
║ Failed:     0                                                ║
║ Flaky:      0                                                ║
║ Duration:   9.1s                                             ║
╚══════════════════════════════════════════════════════════════╝

アーティファクト:
📸 Screenshots: 2 files
📹 Videos: 0 files (失敗時のみ)
🔍 Traces: 0 files (失敗時のみ)
📊 HTML Report: playwright-report/index.html

レポートを表示: npx playwright show-report
```

✅ E2Eテストスイートがセマンティック検索フロー用に準備完了！
```

## テストアーティファクト

テスト実行時に以下のアーティファクトがキャプチャされます:

**すべてのテストで:**
- タイムラインと結果を含むHTMLレポート
- CI統合用のJUnit XML

**失敗時のみ:**
- 失敗状態のスクリーンショット
- テストのビデオ録画
- デバッグ用のトレースファイル（ステップバイステップのリプレイ）
- ネットワークログ
- コンソールログ

## アーティファクトの表示

```bash
# ブラウザでHTMLレポートを表示
npx playwright show-report

# 特定のトレースファイルを表示
npx playwright show-trace artifacts/trace-abc123.zip

# スクリーンショットはartifacts/ディレクトリに保存
open artifacts/search-results.png
```

## 不安定なテストの検出

テストが断続的に失敗する場合:

```
⚠️  FLAKY TEST DETECTED: tests/e2e/markets/trade.spec.ts

テストは10回中7回パス（70%パス率）

よくある失敗:
"Timeout waiting for element '[data-testid="confirm-btn"]'"

推奨される修正:
1. 明示的な待機を追加: await page.waitForSelector('[data-testid="confirm-btn"]')
2. タイムアウトを増加: { timeout: 10000 }
3. コンポーネント内の競合状態を確認
4. 要素がアニメーションで隠れていないか確認

隔離の推奨: 修正されるまでtest.fixme()としてマーク
```

## ブラウザ設定

デフォルトで複数のブラウザでテストを実行:
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox (Desktop)
- ✅ WebKit (Desktop Safari)
- ✅ Mobile Chrome (オプション)

`playwright.config.ts`で設定を調整してブラウザを変更できます。

## CI/CD統合

CIパイプラインに追加:

```yaml
# .github/workflows/e2e.yml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npx playwright test

- name: Upload artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## PMX固有の重要フロー

PMXでは、以下のE2Eテストを優先:

**🔴 CRITICAL（常にパスする必要あり）:**
1. ユーザーがウォレットを接続できる
2. ユーザーがマーケットを閲覧できる
3. ユーザーがマーケットを検索できる（セマンティック検索）
4. ユーザーがマーケット詳細を表示できる
5. ユーザーが取引を行える（テスト資金で）
6. マーケットが正しく解決される
7. ユーザーが資金を引き出せる

**🟡 IMPORTANT:**
1. マーケット作成フロー
2. ユーザープロファイルの更新
3. リアルタイム価格更新
4. チャートのレンダリング
5. マーケットのフィルタリングとソート
6. モバイルレスポンシブレイアウト

## ベストプラクティス

**DO:**
- ✅ 保守性のためにPage Object Modelを使用
- ✅ セレクタにdata-testid属性を使用
- ✅ 任意のタイムアウトではなくAPIレスポンスを待機
- ✅ 重要なユーザージャーニーをエンドツーエンドでテスト
- ✅ mainにマージする前にテストを実行
- ✅ テスト失敗時にアーティファクトを確認

**DON'T:**
- ❌ 脆いセレクタを使用（CSSクラスは変更される可能性あり）
- ❌ 実装の詳細をテスト
- ❌ 本番環境に対してテストを実行
- ❌ 不安定なテストを無視
- ❌ 失敗時のアーティファクト確認をスキップ
- ❌ すべてのエッジケースをE2Eでテスト（ユニットテストを使用）

## 重要な注意事項

**PMXにおけるCRITICAL:**
- 実際のお金が関わるE2Eテストはtestnet/stagingのみで実行する必要があります
- 本番環境に対して取引テストを絶対に実行しない
- 金融テストには`test.skip(process.env.NODE_ENV === 'production')`を設定
- 少額のテスト資金のみを持つテストウォレットを使用

## 他のコマンドとの統合

- `/plan`を使用してテストする重要なジャーニーを特定
- `/tdd`をユニットテスト用に使用（より高速で詳細）
- `/e2e`を統合テストとユーザージャーニーテストに使用
- `/code-review`を使用してテスト品質を確認

## 関連エージェント

このコマンドは以下の`e2e-runner`エージェントを呼び出します:
`~/.claude/agents/e2e-runner.md`

## クイックコマンド

```bash
# すべてのE2Eテストを実行
npx playwright test

# 特定のテストファイルを実行
npx playwright test tests/e2e/markets/search.spec.ts

# headedモードで実行（ブラウザを表示）
npx playwright test --headed

# テストをデバッグ
npx playwright test --debug

# テストコードを生成
npx playwright codegen http://localhost:3000

# レポートを表示
npx playwright show-report
```
