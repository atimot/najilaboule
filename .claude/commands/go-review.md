---
description: Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security. Invokes the go-reviewer agent.
---

# Go Code Review

このコマンドは**go-reviewer**エージェントを呼び出し、Go固有の包括的なコードレビューを行います。

## このコマンドの機能

1. **Go変更の特定**: `git diff`で変更された`.go`ファイルを検出
2. **静的解析を実行**: `go vet`、`staticcheck`、`golangci-lint`を実行
3. **セキュリティスキャン**: SQLインジェクション、コマンドインジェクション、競合状態をチェック
4. **並行性レビュー**: goroutineの安全性、チャネルの使用、mutexパターンを分析
5. **イディオマティックGoチェック**: コードがGo規約とベストプラクティスに従っているか確認
6. **レポート生成**: 問題を重要度別にカテゴリ分け

## 使用するタイミング

`/go-review`を使用する場面:
- Goコードを書いたり変更した後
- Go変更をコミットする前
- Goコードを含むプルリクエストをレビュー
- 新しいGoコードベースにオンボーディング
- イディオマティックGoパターンを学習

## レビューカテゴリ

### CRITICAL（必ず修正）
- SQL/コマンドインジェクション脆弱性
- 同期なしの競合状態
- Goroutineリーク
- ハードコードされた認証情報
- Unsafeポインタの使用
- 重要なパスでの無視されたエラー

### HIGH（修正すべき）
- コンテキストなしのエラーラッピングの欠落
- エラー戻り値の代わりにPanic
- Contextが伝播されていない
- デッドロックを引き起こすバッファなしチャネル
- インターフェースが満たされていないエラー
- Mutex保護の欠落

### MEDIUM（検討）
- 非イディオマティックなコードパターン
- エクスポートにgodocコメントがない
- 非効率な文字列連結
- スライスのプリアロケーションがない
- テーブル駆動テストを使用していない

## 実行される自動チェック

```bash
# 静的解析
go vet ./...

# 高度なチェック（インストールされている場合）
staticcheck ./...
golangci-lint run

# 競合検出
go build -race ./...

# セキュリティ脆弱性
govulncheck ./...
```

## 使用例

```text
User: /go-review

Agent:
# Go Code Review Report

## レビュー対象ファイル
- internal/handler/user.go (変更)
- internal/service/auth.go (変更)

## 静的解析結果
✓ go vet: 問題なし
✓ staticcheck: 問題なし

## 発見された問題

[CRITICAL] Race Condition
File: internal/service/auth.go:45
Issue: 共有マップが同期なしでアクセスされている
```go
var cache = map[string]*Session{}  // 並行アクセス！

func GetSession(id string) *Session {
    return cache[id]  // 競合状態
}
```
Fix: sync.RWMutexまたはsync.Mapを使用
```go
var (
    cache   = map[string]*Session{}
    cacheMu sync.RWMutex
)

func GetSession(id string) *Session {
    cacheMu.RLock()
    defer cacheMu.RUnlock()
    return cache[id]
}
```

[HIGH] Missing Error Context
File: internal/handler/user.go:28
Issue: コンテキストなしでエラーが返されている
```go
return err  // コンテキストなし
```
Fix: コンテキストでラップ
```go
return fmt.Errorf("get user %s: %w", userID, err)
```

## サマリー
- CRITICAL: 1
- HIGH: 1
- MEDIUM: 0

Recommendation: ❌ CRITICAL問題が修正されるまでマージをブロック
```

## 承認基準

| ステータス | 条件 |
|--------|-----------|
| ✅ Approve | CRITICALまたはHIGH問題なし |
| ⚠️ Warning | MEDIUM問題のみ（注意してマージ可） |
| ❌ Block | CRITICALまたはHIGH問題が見つかった |

## 他のコマンドとの統合

- まず`/go-test`を使用してテストがパスすることを確認
- ビルドエラーが発生した場合は`/go-build`を使用
- コミット前に`/go-review`を使用
- Go固有でない懸念事項には`/code-review`を使用

## 関連

- Agent: `agents/go-reviewer.md`
- Skills: `skills/golang-patterns/`, `skills/golang-testing/`
