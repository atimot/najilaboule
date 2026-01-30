# Git ワークフロー

## コミットメッセージ形式

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: ~/.claude/settings.json でグローバルに Attribution は無効化済み。

## Pull Request ワークフロー

PR作成時:
1. 完全なコミット履歴を分析（最新コミットだけでなく）
2. `git diff [base-branch]...HEAD` で全変更を確認
3. 包括的なPRサマリーを作成
4. TODOを含むテスト計画を記載
5. 新規ブランチの場合は `-u` フラグでプッシュ

## 機能実装ワークフロー

1. **まず計画**
   - **planner** エージェントで実装計画を作成
   - 依存関係とリスクを特定
   - フェーズに分割

2. **TDDアプローチ**
   - **tdd-guide** エージェントを使用
   - 先にテストを書く（RED）
   - テストをパスする実装（GREEN）
   - リファクタリング（IMPROVE）
   - 80%以上のカバレッジを確認

3. **コードレビュー**
   - コード記述直後に **code-reviewer** エージェントを使用
   - CRITICAL と HIGH の問題に対処
   - 可能な限り MEDIUM の問題も修正

4. **コミット & プッシュ**
   - 詳細なコミットメッセージ
   - Conventional Commits 形式に従う
