# Verification Command

現在のコードベース状態に対して包括的な検証を実行。

## 手順

この正確な順序で検証を実行:

1. **Build Check**
   - このプロジェクトのビルドコマンドを実行
   - 失敗した場合はエラーを報告して停止

2. **Type Check**
   - TypeScript/型チェッカーを実行
   - すべてのエラーをfile:lineで報告

3. **Lint Check**
   - リンターを実行
   - 警告とエラーを報告

4. **Test Suite**
   - すべてのテストを実行
   - 合格/不合格の数を報告
   - カバレッジパーセンテージを報告

5. **Console.log Audit**
   - ソースファイル内のconsole.logを検索
   - 場所を報告

6. **Git Status**
   - コミットされていない変更を表示
   - 最後のコミット以降に変更されたファイルを表示

## 出力

簡潔な検証レポートを生成:

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]

Ready for PR: [YES/NO]
```

クリティカルな問題がある場合は、修正提案とともにリストアップ。

## 引数

$ARGUMENTSは以下が可能:
- `quick` - build + typesのみ
- `full` - すべてのチェック（デフォルト）
- `pre-commit` - コミットに関連するチェック
- `pre-pr` - 完全なチェック + セキュリティスキャン
