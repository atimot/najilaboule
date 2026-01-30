---
description: Enforce TDD workflow for Go. Write table-driven tests first, then implement. Verify 80%+ coverage with go test -cover.
---

# Go TDD Command

このコマンドはイディオマティックなGoテストパターンを使用して、Goコードにテスト駆動開発方法論を適用します。

## このコマンドの機能

1. **型/インターフェースを定義**: まず関数シグネチャをスキャフォールド
2. **テーブル駆動テストを作成**: 包括的なテストケースを作成（RED）
3. **テストを実行**: テストが正しい理由で失敗することを確認
4. **コードを実装**: パスするための最小限のコードを書く（GREEN）
5. **リファクタリング**: テストをグリーンに保ちながら改善
6. **カバレッジを確認**: 80%以上のカバレッジを確保

## 使用するタイミング

`/go-test`を使用する場面:
- 新しいGo関数を実装
- 既存コードにテストカバレッジを追加
- バグ修正（まず失敗するテストを書く）
- 重要なビジネスロジックを構築
- GoでのTDDワークフローを学習

## TDDサイクル

```
RED     → 失敗するテーブル駆動テストを書く
GREEN   → パスするための最小限のコードを実装
REFACTOR → コードを改善、テストはグリーンを維持
REPEAT  → 次のテストケース
```

## セッション例

```text
User: /go-test メールアドレスを検証する関数が必要

Agent:
# TDD Session: Email Validator

## Step 1: インターフェースを定義

```go
// validator/email.go
package validator

// ValidateEmail checks if the given string is a valid email address.
// Returns nil if valid, error describing the issue otherwise.
func ValidateEmail(email string) error {
    panic("not implemented")
}
```

## Step 2: テーブル駆動テストを作成（RED）

```go
// validator/email_test.go
package validator

import (
    "testing"
)

func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        // 有効なメール
        {"simple email", "user@example.com", false},
        {"with subdomain", "user@mail.example.com", false},
        {"with plus", "user+tag@example.com", false},
        {"with dots", "first.last@example.com", false},

        // 無効なメール
        {"empty string", "", true},
        {"no at sign", "userexample.com", true},
        {"no domain", "user@", true},
        {"no local part", "@example.com", true},
        {"double at", "user@@example.com", true},
        {"spaces", "user @example.com", true},
        {"no tld", "user@example", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if tt.wantErr && err == nil {
                t.Errorf("ValidateEmail(%q) = nil; want error", tt.email)
            }
            if !tt.wantErr && err != nil {
                t.Errorf("ValidateEmail(%q) = %v; want nil", tt.email, err)
            }
        })
    }
}
```

## Step 3: テストを実行 - 失敗を確認

```bash
$ go test ./validator/...

--- FAIL: TestValidateEmail (0.00s)
    --- FAIL: TestValidateEmail/simple_email (0.00s)
        panic: not implemented

FAIL
```

✓ 予想通りテストが失敗（panic）

## Step 4: 最小限のコードを実装（GREEN）

```go
// validator/email.go
package validator

import (
    "errors"
    "regexp"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

var (
    ErrEmailEmpty   = errors.New("email cannot be empty")
    ErrEmailInvalid = errors.New("email format is invalid")
)

func ValidateEmail(email string) error {
    if email == "" {
        return ErrEmailEmpty
    }
    if !emailRegex.MatchString(email) {
        return ErrEmailInvalid
    }
    return nil
}
```

## Step 5: テストを実行 - パスを確認

```bash
$ go test ./validator/...

PASS
ok      project/validator    0.003s
```

✓ すべてのテストがパス！

## Step 6: カバレッジを確認

```bash
$ go test -cover ./validator/...

PASS
coverage: 100.0% of statements
ok      project/validator    0.003s
```

✓ Coverage: 100%

## TDD完了！
```

## テストパターン

### テーブル駆動テスト
```go
tests := []struct {
    name     string
    input    InputType
    want     OutputType
    wantErr  bool
}{
    {"case 1", input1, want1, false},
    {"case 2", input2, want2, true},
}

for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        got, err := Function(tt.input)
        // assertions
    })
}
```

### 並列テスト
```go
for _, tt := range tests {
    tt := tt // キャプチャ
    t.Run(tt.name, func(t *testing.T) {
        t.Parallel()
        // test body
    })
}
```

### テストヘルパー
```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()
    db := createDB()
    t.Cleanup(func() { db.Close() })
    return db
}
```

## カバレッジコマンド

```bash
# 基本カバレッジ
go test -cover ./...

# カバレッジプロファイル
go test -coverprofile=coverage.out ./...

# ブラウザで表示
go tool cover -html=coverage.out

# 関数別カバレッジ
go tool cover -func=coverage.out

# 競合検出付き
go test -race -cover ./...
```

## カバレッジ目標

| コードタイプ | 目標 |
|-----------|--------|
| 重要なビジネスロジック | 100% |
| パブリックAPI | 90%+ |
| 一般的なコード | 80%+ |
| 生成されたコード | 除外 |

## TDDベストプラクティス

**DO:**
- 実装の前にテストを最初に書く
- 各変更後にテストを実行
- 包括的なカバレッジのためにテーブル駆動テストを使用
- 実装の詳細ではなく動作をテスト
- エッジケースを含める（空、nil、最大値）

**DON'T:**
- テスト前に実装を書く
- REDフェーズをスキップ
- プライベート関数を直接テスト
- テストで`time.Sleep`を使用
- 不安定なテストを無視

## 関連コマンド

- `/go-build` - ビルドエラーを修正
- `/go-review` - 実装後にコードをレビュー
- `/verify` - 完全な検証ループ

## 関連

- Skill: `skills/golang-testing/`
- Skill: `skills/tdd-workflow/`
