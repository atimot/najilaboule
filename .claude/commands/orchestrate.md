# Orchestrate Command

複雑なタスクのための連続エージェントワークフロー。

## 使用方法

`/orchestrate [workflow-type] [task-description]`

## ワークフロータイプ

### feature
完全な機能実装ワークフロー:
```
planner -> tdd-guide -> code-reviewer -> security-reviewer
```

### bugfix
バグ調査と修正ワークフロー:
```
explorer -> tdd-guide -> code-reviewer
```

### refactor
安全なリファクタリングワークフロー:
```
architect -> code-reviewer -> tdd-guide
```

### security
セキュリティ重視のレビュー:
```
security-reviewer -> code-reviewer -> architect
```

## 実行パターン

ワークフロー内の各エージェントについて:

1. **エージェントを呼び出し** - 前のエージェントからのコンテキストを渡す
2. **出力を収集** - 構造化されたハンドオフドキュメントとして
3. **次のエージェントに渡す** - チェーン内の次へ
4. **結果を集約** - 最終レポートにまとめる

## ハンドオフドキュメントフォーマット

エージェント間でハンドオフドキュメントを作成:

```markdown
## HANDOFF: [previous-agent] -> [next-agent]

### Context
[行われたことのサマリー]

### Findings
[主要な発見または決定]

### Files Modified
[変更されたファイルのリスト]

### Open Questions
[次のエージェントへの未解決項目]

### Recommendations
[推奨される次のステップ]
```

## 例: Featureワークフロー

```
/orchestrate feature "ユーザー認証を追加"
```

実行内容:

1. **Planner Agent**
   - 要件を分析
   - 実装計画を作成
   - 依存関係を特定
   - 出力: `HANDOFF: planner -> tdd-guide`

2. **TDD Guide Agent**
   - plannerのハンドオフを読み取り
   - テストを最初に書く
   - テストをパスする実装
   - 出力: `HANDOFF: tdd-guide -> code-reviewer`

3. **Code Reviewer Agent**
   - 実装をレビュー
   - 問題をチェック
   - 改善を提案
   - 出力: `HANDOFF: code-reviewer -> security-reviewer`

4. **Security Reviewer Agent**
   - セキュリティ監査
   - 脆弱性チェック
   - 最終承認
   - 出力: 最終レポート

## 最終レポートフォーマット

```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: Add user authentication
Agents: planner -> tdd-guide -> code-reviewer -> security-reviewer

SUMMARY
-------
[1段落のサマリー]

AGENT OUTPUTS
-------------
Planner: [サマリー]
TDD Guide: [サマリー]
Code Reviewer: [サマリー]
Security Reviewer: [サマリー]

FILES CHANGED
-------------
[変更されたすべてのファイルのリスト]

TEST RESULTS
------------
[テスト合格/不合格サマリー]

SECURITY STATUS
---------------
[セキュリティ発見事項]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## 並列実行

独立したチェックの場合、エージェントを並列実行:

```markdown
### Parallel Phase
同時実行:
- code-reviewer (品質)
- security-reviewer (セキュリティ)
- architect (設計)

### Merge Results
出力を単一レポートに統合
```

## 引数

$ARGUMENTS:
- `feature <description>` - 完全な機能ワークフロー
- `bugfix <description>` - バグ修正ワークフロー
- `refactor <description>` - リファクタリングワークフロー
- `security <description>` - セキュリティレビューワークフロー
- `custom <agents> <description>` - カスタムエージェントシーケンス

## カスタムワークフロー例

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "キャッシュレイヤーを再設計"
```

## ヒント

1. **複雑な機能はplannerから開始**
2. **マージ前には常にcode-reviewerを含める**
3. **認証/決済/PIIにはsecurity-reviewerを使用**
4. **ハンドオフは簡潔に** - 次のエージェントが必要なものに焦点
5. **必要に応じてエージェント間で検証を実行**
