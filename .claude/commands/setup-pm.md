---
description: Configure your preferred package manager (npm/pnpm/yarn/bun)
disable-model-invocation: true
---

# Package Manager Setup

このプロジェクトまたはグローバルで好みのパッケージマネージャーを設定します。

## 使用方法

```bash
# 現在のパッケージマネージャーを検出
node scripts/setup-package-manager.js --detect

# グローバル設定を設定
node scripts/setup-package-manager.js --global pnpm

# プロジェクト設定を設定
node scripts/setup-package-manager.js --project bun

# 利用可能なパッケージマネージャーを一覧
node scripts/setup-package-manager.js --list
```

## 検出優先順位

どのパッケージマネージャーを使用するかを決定する際、以下の順序でチェック:

1. **環境変数**: `CLAUDE_PACKAGE_MANAGER`
2. **プロジェクト設定**: `.claude/package-manager.json`
3. **package.json**: `packageManager`フィールド
4. **ロックファイル**: package-lock.json、yarn.lock、pnpm-lock.yaml、またはbun.lockbの存在
5. **グローバル設定**: `~/.claude/package-manager.json`
6. **フォールバック**: 最初に利用可能なパッケージマネージャー（pnpm > bun > yarn > npm）

## 設定ファイル

### グローバル設定
```json
// ~/.claude/package-manager.json
{
  "packageManager": "pnpm"
}
```

### プロジェクト設定
```json
// .claude/package-manager.json
{
  "packageManager": "bun"
}
```

### package.json
```json
{
  "packageManager": "pnpm@8.6.0"
}
```

## 環境変数

他のすべての検出方法をオーバーライドするには`CLAUDE_PACKAGE_MANAGER`を設定:

```bash
# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"

# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm
```

## 検出を実行

現在のパッケージマネージャー検出結果を確認するには:

```bash
node scripts/setup-package-manager.js --detect
```
