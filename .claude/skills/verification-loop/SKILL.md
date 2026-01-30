# 検証ループスキル

Claude Codeセッション用の包括的な検証システム。

## 使用するタイミング

このスキルを呼び出す：
- 機能や重要なコード変更の完了後
- PR作成前
- 品質ゲートの合格を確認したい時
- リファクタリング後

## 検証フェーズ

### フェーズ1：ビルド検証
```bash
# Check if project builds
npm run build 2>&1 | tail -20
# OR
pnpm build 2>&1 | tail -20
```

ビルドが失敗した場合、続行前に停止して修正。

### フェーズ2：型チェック
```bash
# TypeScript projects
npx tsc --noEmit 2>&1 | head -30

# Python projects
pyright . 2>&1 | head -30
```

すべての型エラーを報告。続行前にクリティカルなものを修正。

### フェーズ3：リントチェック
```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### フェーズ4：テストスイート
```bash
# Run tests with coverage
npm run test -- --coverage 2>&1 | tail -50

# Check coverage threshold
# Target: 80% minimum
```

報告：
- 総テスト数：X
- パス：X
- 失敗：X
- カバレッジ：X%

### フェーズ5：セキュリティスキャン
```bash
# Check for secrets
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Check for console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### フェーズ6：差分レビュー
```bash
# Show what changed
git diff --stat
git diff HEAD~1 --name-only
```

変更された各ファイルを以下についてレビュー：
- 意図しない変更
- 欠落したエラー処理
- 潜在的なエッジケース

## 出力フォーマット

すべてのフェーズを実行した後、検証レポートを作成：

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

## 継続モード

長いセッションでは、15分ごとまたは大きな変更後に検証を実行：

```markdown
Set a mental checkpoint:
- After completing each function
- After finishing a component
- Before moving to next task

Run: /verify
```

## フックとの統合

このスキルはPostToolUseフックを補完するが、より深い検証を提供。
フックは問題を即座にキャッチ、このスキルは包括的なレビューを提供。
