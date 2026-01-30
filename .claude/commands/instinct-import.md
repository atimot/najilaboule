---
name: instinct-import
description: Import instincts from teammates, Skill Creator, or other sources
command: true
---

# Instinct Import Command

## 実装

プラグインルートパスを使用してinstinct CLIを実行:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" import <file-or-url> [--dry-run] [--force] [--min-confidence 0.7]
```

または`CLAUDE_PLUGIN_ROOT`が設定されていない場合（手動インストール）:

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py import <file-or-url>
```

以下からinstinctをインポート:
- チームメイトのエクスポート
- Skill Creator（リポジトリ分析）
- コミュニティコレクション
- 以前のマシンのバックアップ

## 使用方法

```
/instinct-import team-instincts.yaml
/instinct-import https://github.com/org/repo/instincts.yaml
/instinct-import --from-skill-creator acme/webapp
```

## 実行内容

1. instinctファイルを取得（ローカルパスまたはURL）
2. フォーマットを解析して検証
3. 既存のinstinctとの重複をチェック
4. 新しいinstinctをマージまたは追加
5. `~/.claude/homunculus/instincts/inherited/`に保存

## インポートプロセス

```
📥 Importing instincts from: team-instincts.yaml
================================================

インポートする12件のinstinctが見つかりました。

競合を分析中...

## 新規Instincts (8)
以下が追加されます:
  ✓ use-zod-validation (confidence: 0.7)
  ✓ prefer-named-exports (confidence: 0.65)
  ✓ test-async-functions (confidence: 0.8)
  ...

## 重複Instincts (3)
類似のinstinctが既に存在:
  ⚠️ prefer-functional-style
     Local: 0.8 confidence, 12 observations
     Import: 0.7 confidence
     → ローカルを保持（より高い信頼度）

  ⚠️ test-first-workflow
     Local: 0.75 confidence
     Import: 0.9 confidence
     → インポートに更新（より高い信頼度）

## 競合Instincts (1)
ローカルinstinctと矛盾:
  ❌ use-classes-for-services
     Conflicts with: avoid-classes
     → スキップ（手動解決が必要）

---
8件を新規追加、1件を更新、3件をスキップしますか？
```

## マージ戦略

### 重複の場合
既存のinstinctと一致するinstinctをインポートする場合:
- **高い信頼度が優先**: より高い信頼度を持つ方を保持
- **エビデンスをマージ**: 観察回数を統合
- **タイムスタンプを更新**: 最近検証されたとしてマーク

### 競合の場合
既存のinstinctと矛盾するinstinctをインポートする場合:
- **デフォルトでスキップ**: 競合するinstinctをインポートしない
- **レビュー用にフラグ**: 両方に注意が必要とマーク
- **手動解決**: ユーザーがどちらを保持するか決定

## ソース追跡

インポートされたinstinctは以下でマーク:
```yaml
source: "inherited"
imported_from: "team-instincts.yaml"
imported_at: "2025-01-22T10:30:00Z"
original_source: "session-observation"  # または "repo-analysis"
```

## Skill Creator統合

Skill Creatorからインポートする場合:

```
/instinct-import --from-skill-creator acme/webapp
```

リポジトリ分析から生成されたinstinctを取得:
- Source: `repo-analysis`
- より高い初期信頼度（0.7+）
- ソースリポジトリにリンク

## フラグ

- `--dry-run`: インポートせずにプレビュー
- `--force`: 競合があってもインポート
- `--merge-strategy <higher|local|import>`: 重複の処理方法
- `--from-skill-creator <owner/repo>`: Skill Creator分析からインポート
- `--min-confidence <n>`: しきい値以上のinstinctのみをインポート

## 出力

インポート後:
```
✅ Import complete!

Added: 8 instincts
Updated: 1 instinct
Skipped: 3 instincts (2 duplicates, 1 conflict)

新しいinstinctは以下に保存: ~/.claude/homunculus/instincts/inherited/

/instinct-statusを実行してすべてのinstinctを確認。
```
