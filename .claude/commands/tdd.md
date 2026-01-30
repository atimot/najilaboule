---
description: Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.
---

# TDD Command

このコマンドは**tdd-guide**エージェントを呼び出し、テスト駆動開発方法論を適用します。

## このコマンドの機能

1. **インターフェースをスキャフォールド** - まず型/インターフェースを定義
2. **テストを最初に生成** - 失敗するテストを書く（RED）
3. **最小限のコードを実装** - パスするために必要なだけ書く（GREEN）
4. **リファクタリング** - テストをグリーンに保ちながらコードを改善（REFACTOR）
5. **カバレッジを確認** - 80%以上のテストカバレッジを確保

## 使用するタイミング

`/tdd`を使用する場面:
- 新機能の実装
- 新しい関数/コンポーネントの追加
- バグ修正（まずバグを再現するテストを書く）
- 既存コードのリファクタリング
- 重要なビジネスロジックの構築

## 動作方法

tdd-guideエージェントは以下を行います:

1. **インターフェースを定義** - 入力/出力用
2. **失敗するテストを書く**（コードがまだ存在しないため）
3. **テストを実行**し、正しい理由で失敗することを確認
4. **最小限の実装を書く** - テストをパスさせる
5. **テストを実行**し、パスすることを確認
6. **コードをリファクタリング** - テストをグリーンに保ちながら
7. **カバレッジを確認**し、80%未満ならテストを追加

## TDDサイクル

```
RED → GREEN → REFACTOR → REPEAT

RED:      失敗するテストを書く
GREEN:    パスするための最小限のコードを書く
REFACTOR: コードを改善、テストはパスを維持
REPEAT:   次の機能/シナリオ
```

## 使用例

```
User: /tdd マーケットの流動性スコアを計算する関数が必要

Agent (tdd-guide):
# TDD Session: Market Liquidity Score Calculator

## Step 1: インターフェースを定義（SCAFFOLD）

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: 実装
  throw new Error('Not implemented')
}
```

## Step 2: 失敗するテストを書く（RED）

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1日前
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

## Step 3: テストを実行 - 失敗を確認

```bash
npm test lib/liquidity.test.ts

FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market (2 ms)
    Error: Not implemented

1 test failed, 0 passed
```

✅ 予想通りテストが失敗。実装の準備完了。

## Step 4: 最小限のコードを実装（GREEN）

```typescript
// lib/liquidity.ts
export function calculateLiquidityScore(market: MarketData): number {
  // ゼロボリュームのエッジケースを処理
  if (market.totalVolume === 0) {
    return 0
  }

  // コンポーネントスコアを計算（0-100スケール）
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // 最近の活動ボーナス
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // 加重平均
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // 0-100にクランプ
}
```

## Step 5: テストを実行 - パスを確認

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ すべてのテストがパス！

## Step 6: リファクタリング（IMPROVE）

```typescript
// lib/liquidity.ts - 定数と可読性を改善してリファクタリング
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

## Step 7: テストがまだパスすることを確認

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ リファクタリング完了、テストはまだパス！

## Step 8: カバレッジを確認

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ TDDセッション完了！
```

## TDDベストプラクティス

**DO:**
- ✅ 実装の前にテストを最初に書く
- ✅ 実装前にテストを実行して失敗を確認
- ✅ テストをパスするための最小限のコードを書く
- ✅ テストがグリーンになった後にのみリファクタリング
- ✅ エッジケースとエラーシナリオを追加
- ✅ 80%以上のカバレッジを目指す（重要なコードは100%）

**DON'T:**
- ❌ テスト前に実装を書く
- ❌ 各変更後のテスト実行をスキップ
- ❌ 一度に多くのコードを書く
- ❌ 失敗するテストを無視
- ❌ 実装の詳細をテスト（動作をテストする）
- ❌ すべてをモック（統合テストを好む）

## 含めるべきテストタイプ

**ユニットテスト**（関数レベル）:
- ハッピーパスシナリオ
- エッジケース（空、null、最大値）
- エラー条件
- 境界値

**統合テスト**（コンポーネントレベル）:
- APIエンドポイント
- データベース操作
- 外部サービス呼び出し
- フック付きReactコンポーネント

**E2Eテスト**（`/e2e`コマンドを使用）:
- 重要なユーザーフロー
- マルチステッププロセス
- フルスタック統合

## カバレッジ要件

- **すべてのコードで80%最低**
- **100%必須**:
  - 金融計算
  - 認証ロジック
  - セキュリティ重要なコード
  - コアビジネスロジック

## 重要な注意事項

**MANDATORY**: テストは実装の前に書かれる必要があります。TDDサイクルは:

1. **RED** - 失敗するテストを書く
2. **GREEN** - パスする実装を書く
3. **REFACTOR** - コードを改善

REDフェーズを決してスキップしないでください。テスト前にコードを決して書かないでください。

## 他のコマンドとの統合

- まず`/plan`を使用して何を構築するかを理解
- `/tdd`を使用してテストと一緒に実装
- ビルドエラーが発生した場合は`/build-and-fix`を使用
- 実装をレビューするには`/code-review`を使用
- カバレッジを確認するには`/test-coverage`を使用

## 関連エージェント

このコマンドは以下の`tdd-guide`エージェントを呼び出します:
`~/.claude/agents/tdd-guide.md`

そして以下の`tdd-workflow`スキルを参照できます:
`~/.claude/skills/tdd-workflow/`
