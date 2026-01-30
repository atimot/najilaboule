---
name: strategic-compact
description: Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction.
---

# 戦略的コンパクトスキル

任意の自動コンパクションに頼るのではなく、ワークフロー内の戦略的なポイントで手動の`/compact`を提案する。

## なぜ戦略的コンパクションか？

自動コンパクションは任意のポイントでトリガーされる：
- タスクの途中でトリガーされることが多く、重要なコンテキストを失う
- 論理的なタスク境界を認識しない
- 複雑な複数ステップの操作を中断する可能性がある

論理的な境界での戦略的コンパクション：
- **探索後、実行前** - リサーチコンテキストをコンパクト化し、実装計画は保持
- **マイルストーン完了後** - 次のフェーズのために新たにスタート
- **大きなコンテキスト切り替え前** - 異なるタスクの前に探索コンテキストをクリア

## 仕組み

`suggest-compact.sh`スクリプトはPreToolUse（Edit/Write）で実行され：

1. **ツール呼び出しを追跡** - セッション内のツール呼び出しをカウント
2. **閾値検出** - 設定可能な閾値（デフォルト：50回）で提案
3. **定期的なリマインダー** - 閾値後、25回ごとにリマインド

## フックセットアップ

Add to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "tool == \"Edit\" || tool == \"Write\"",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
      }]
    }]
  }
}
```

## 設定

環境変数：
- `COMPACT_THRESHOLD` - 最初の提案までのツール呼び出し回数（デフォルト：50）

## ベストプラクティス

1. **計画後にコンパクト** - 計画が確定したら、新たにスタートするためにコンパクト
2. **デバッグ後にコンパクト** - 続行前にエラー解決コンテキストをクリア
3. **実装中はコンパクトしない** - 関連する変更のためにコンテキストを保持
4. **提案を読む** - フックは*いつ*を教えてくれる、*するかどうか*は自分で決める

## 関連

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - トークン最適化セクション
- Memory persistence hooks - コンパクション後も残る状態用
