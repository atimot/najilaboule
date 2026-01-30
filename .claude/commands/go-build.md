---
description: Fix Go build errors, go vet warnings, and linter issues incrementally. Invokes the go-build-resolver agent for minimal, surgical fixes.
---

# Go Build and Fix

このコマンドは**go-build-resolver**エージェントを呼び出し、最小限の変更でGoビルドエラーを段階的に修正します。

## このコマンドの機能

1. **診断を実行**: `go build`、`go vet`、`staticcheck`を実行
2. **エラーを解析**: ファイル別にグループ化し、重要度順にソート
3. **段階的に修正**: 一度に1つのエラーを修正
4. **各修正を確認**: 各変更後にビルドを再実行
5. **サマリーをレポート**: 修正された内容と残りを表示

## 使用するタイミング

`/go-build`を使用する場面:
- `go build ./...`がエラーで失敗する
- `go vet ./...`が問題を報告
- `golangci-lint run`が警告を表示
- モジュール依存関係が壊れている
- ビルドを壊す変更をプル後

## 実行される診断コマンド

```bash
# 主要なビルドチェック
go build ./...

# 静的解析
go vet ./...

# 拡張リンティング（利用可能な場合）
staticcheck ./...
golangci-lint run

# モジュール問題
go mod verify
go mod tidy -v
```

## セッション例

```text
User: /go-build

Agent:
# Go Build Resolution

## 初期診断

```bash
$ go build ./...
internal/service/user.go:25:15: undefined: UserRepository
internal/handler/api.go:42:9: cannot use x (type string) as type int
internal/handler/api.go:58:2: missing return at end of function
```

エラー発見: 3件

## 修正1: 未定義の識別子

File: internal/service/user.go:25
Error: undefined: UserRepository
Cause: インポート欠落

```go
// インポートを追加
import "project/internal/repository"

// 変更前
var repo UserRepository
// 変更後
var repo repository.UserRepository
```

```bash
$ go build ./...
# 残り2件のエラー
```

## 修正2: 型の不一致

File: internal/handler/api.go:42
Error: cannot use x (type string) as type int

```go
// 変更前
count := params.Get("count")
// 変更後
countStr := params.Get("count")
count, _ := strconv.Atoi(countStr)
```

```bash
$ go build ./...
# 残り1件のエラー
```

## 修正3: 戻り値の欠落

File: internal/handler/api.go:58
Error: missing return at end of function

```go
func GetUser(id string) (*User, error) {
    if id == "" {
        return nil, ErrInvalidID
    }
    user := findUser(id)
    // 欠落していた戻り値を追加
    return user, nil
}
```

```bash
$ go build ./...
# ビルド成功！
```

## 最終確認

```bash
$ go vet ./...
# 問題なし

$ go test ./...
ok      project/internal/service   0.015s
ok      project/internal/handler   0.023s
```

## サマリー

| 項目 | 数 |
|--------|-------|
| 修正したビルドエラー | 3 |
| 修正したVet警告 | 0 |
| 変更したファイル | 2 |
| 残りの問題 | 0 |

Build Status: ✅ SUCCESS
```

## よくあるエラーと修正

| エラー | 典型的な修正 |
|-------|-------------|
| `undefined: X` | インポートを追加またはタイポを修正 |
| `cannot use X as Y` | 型変換または代入を修正 |
| `missing return` | return文を追加 |
| `X does not implement Y` | 欠落メソッドを追加 |
| `import cycle` | パッケージを再構築 |
| `declared but not used` | 変数を削除または使用 |
| `cannot find package` | `go get`または`go mod tidy` |

## 修正戦略

1. **ビルドエラーを最初に** - コードはコンパイルできる必要がある
2. **Vet警告を次に** - 疑わしい構文を修正
3. **Lint警告を最後に** - スタイルとベストプラクティス
4. **一度に1つの修正** - 各変更を確認
5. **最小限の変更** - リファクタリングせず、修正のみ

## 停止条件

エージェントは以下の場合に停止してレポート:
- 3回試行しても同じエラーが続く
- 修正がより多くのエラーを導入
- アーキテクチャ変更が必要
- 外部依存関係が欠落

## 関連コマンド

- `/go-test` - ビルド成功後にテストを実行
- `/go-review` - コード品質をレビュー
- `/verify` - 完全な検証ループ

## 関連

- Agent: `agents/go-build-resolver.md`
- Skill: `skills/golang-patterns/`
