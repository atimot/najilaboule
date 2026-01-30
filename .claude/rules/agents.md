# エージェント管理

## 利用可能なエージェント

`.claude/agents/` に配置:

| Agent | 用途 | 使用タイミング |
|-------|---------|-------------|
| planner | 実装計画 | 複雑な機能、リファクタリング |
| architect | システム設計 | アーキテクチャの決定 |
| tdd-guide | テスト駆動開発 | 新機能、バグ修正 |
| code-reviewer | コードレビュー | コード記述後 |
| security-reviewer | セキュリティ分析 | コミット前 |
| build-error-resolver | ビルドエラー修正 | ビルド失敗時 |
| e2e-runner | E2Eテスト | 重要なユーザーフロー |
| refactor-cleaner | 不要コード削除 | コード保守 |
| doc-updater | ドキュメント | ドキュメント更新 |

## 即時エージェント使用

ユーザーの指示なしで使用:
1. 複雑な機能リクエスト - **planner** エージェントを使用
2. コード記述・修正直後 - **code-reviewer** エージェントを使用
3. バグ修正や新機能 - **tdd-guide** エージェントを使用
4. アーキテクチャの決定 - **architect** エージェントを使用

## 並列タスク実行

独立した操作には必ず並列実行を使用:

```markdown
# GOOD: 並列実行
3つのエージェントを並列起動:
1. Agent 1: auth.ts のセキュリティ分析
2. Agent 2: キャッシュシステムのパフォーマンスレビュー
3. Agent 3: utils.ts の型チェック

# BAD: 不要な順次実行
Agent 1、次に Agent 2、次に Agent 3
```

## 多角的分析

複雑な問題には、役割分担したサブエージェントを使用:
- Factual reviewer（事実確認）
- Senior engineer（シニアエンジニア視点）
- Security expert（セキュリティ専門家）
- Consistency reviewer（一貫性チェック）
- Redundancy checker（冗長性チェック）
