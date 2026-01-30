---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

このコマンドは**planner**エージェントを呼び出し、コードを書く前に包括的な実装計画を作成します。

## このコマンドの機能

1. **要件を再述** - 何を構築する必要があるかを明確化
2. **リスクを特定** - 潜在的な問題とブロッカーを浮き彫りに
3. **ステップ計画を作成** - 実装をフェーズに分解
4. **確認を待つ** - 進行前にユーザー承認を受ける必要がある

## 使用するタイミング

`/plan`を使用する場面:
- 新機能を開始
- 重要なアーキテクチャ変更を行う
- 複雑なリファクタリングに取り組む
- 複数のファイル/コンポーネントが影響を受ける
- 要件が不明確または曖昧

## 動作方法

plannerエージェントは以下を行います:

1. **リクエストを分析**し、要件を明確な言葉で再述
2. **フェーズに分解**し、具体的で実行可能なステップを作成
3. **依存関係を特定** - コンポーネント間の関係
4. **リスクを評価** - 潜在的なブロッカー
5. **複雑さを見積もり**（High/Medium/Low）
6. **計画を提示**し、明示的な確認を待つ

## 使用例

```
User: /plan マーケットが解決されたときにリアルタイム通知を追加したい

Agent (planner):
# Implementation Plan: Real-Time Market Resolution Notifications

## 要件の再述
- ユーザーがウォッチしているマーケットが解決されたときに通知を送信
- 複数の通知チャネルをサポート（アプリ内、メール、webhook）
- 通知が確実に配信されることを保証
- マーケットの結果とユーザーのポジション結果を含める

## 実装フェーズ

### Phase 1: データベーススキーマ
- notificationsテーブルを追加（カラム: id, user_id, market_id, type, status, created_at）
- user_notification_preferencesテーブルを追加（チャネル設定用）
- パフォーマンスのためにuser_idとmarket_idにインデックスを作成

### Phase 2: 通知サービス
- lib/notifications.tsに通知サービスを作成
- BullMQ/Redisを使用した通知キューを実装
- 配信失敗時のリトライロジックを追加
- 通知テンプレートを作成

### Phase 3: 統合ポイント
- マーケット解決ロジックにフック（ステータスが"resolved"に変更されたとき）
- マーケットにポジションを持つすべてのユーザーをクエリ
- 各ユーザーに通知をエンキュー

### Phase 4: フロントエンドコンポーネント
- ヘッダーにNotificationBellコンポーネントを作成
- NotificationListモーダルを追加
- Supabaseサブスクリプション経由のリアルタイム更新を実装
- 通知設定ページを追加

## 依存関係
- Redis（キュー用）
- メールサービス（SendGrid/Resend）
- Supabaseリアルタイムサブスクリプション

## リスク
- HIGH: メール到達率（SPF/DKIM必須）
- MEDIUM: 1000人以上のユーザー/マーケットでのパフォーマンス
- MEDIUM: マーケットが頻繁に解決される場合の通知スパム
- LOW: リアルタイムサブスクリプションのオーバーヘッド

## 見積もり複雑さ: MEDIUM
- バックエンド: 4-6時間
- フロントエンド: 3-4時間
- テスト: 2-3時間
- 合計: 9-13時間

**確認待ち**: この計画で進めますか？（yes/no/modify）
```

## 重要な注意事項

**CRITICAL**: plannerエージェントは、"yes"や"proceed"などの肯定的な応答で計画を明示的に確認するまで、**コードを書きません**。

変更が必要な場合は以下のように回答:
- "modify: [変更内容]"
- "different approach: [代替案]"
- "phase 2をスキップしてphase 3を先に"

## 他のコマンドとの統合

計画後:
- `/tdd`を使用してテスト駆動開発で実装
- ビルドエラーが発生した場合は`/build-and-fix`を使用
- 完成した実装をレビューするには`/code-review`を使用

## 関連エージェント

このコマンドは以下の`planner`エージェントを呼び出します:
`~/.claude/agents/planner.md`
