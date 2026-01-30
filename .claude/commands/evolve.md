---
name: evolve
description: Cluster related instincts into skills, commands, or agents
command: true
---

# Evolve Command

## 実装

プラグインルートパスを使用してinstinct CLIを実行:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" evolve [--generate]
```

または`CLAUDE_PLUGIN_ROOT`が設定されていない場合（手動インストール）:

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py evolve [--generate]
```

instinctを分析し、関連するものをより高レベルの構造にクラスタリング:
- **Commands**: instinctがユーザーが呼び出すアクションを記述している場合
- **Skills**: instinctが自動トリガーされる動作を記述している場合
- **Agents**: instinctが複雑なマルチステップのプロセスを記述している場合

## 使用方法

```
/evolve                    # すべてのinstinctを分析し、進化を提案
/evolve --domain testing   # testingドメインのinstinctのみを進化
/evolve --dry-run          # 作成せずに何が作成されるかを表示
/evolve --threshold 5      # クラスタリングに5つ以上の関連instinctを必要とする
```

## 進化ルール

### → Command（ユーザー呼び出し型）
instinctがユーザーが明示的に要求するアクションを記述している場合:
- 「ユーザーが...を要求したとき」という複数のinstinct
- 「新しいXを作成するとき」のようなトリガーを持つinstinct
- 繰り返し可能なシーケンスに従うinstinct

例:
- `new-table-step1`: 「データベーステーブルを追加するとき、migrationを作成」
- `new-table-step2`: 「データベーステーブルを追加するとき、schemaを更新」
- `new-table-step3`: 「データベーステーブルを追加するとき、typesを再生成」

→ 作成: `/new-table` command

### → Skill（自動トリガー型）
instinctが自動的に発生すべき動作を記述している場合:
- パターンマッチングトリガー
- エラーハンドリングレスポンス
- コードスタイルの強制

例:
- `prefer-functional`: 「関数を書くとき、関数型スタイルを好む」
- `use-immutable`: 「状態を変更するとき、不変パターンを使用」
- `avoid-classes`: 「モジュールを設計するとき、クラスベース設計を避ける」

→ 作成: `functional-patterns` skill

### → Agent（深度/分離が必要）
instinctが分離による利点がある複雑なマルチステップのプロセスを記述している場合:
- デバッグワークフロー
- リファクタリングシーケンス
- リサーチタスク

例:
- `debug-step1`: 「デバッグ時、まずログを確認」
- `debug-step2`: 「デバッグ時、失敗するコンポーネントを分離」
- `debug-step3`: 「デバッグ時、最小限の再現を作成」
- `debug-step4`: 「デバッグ時、テストで修正を確認」

→ 作成: `debugger` agent

## 実行内容

1. `~/.claude/homunculus/instincts/`からすべてのinstinctを読み取り
2. instinctをグループ化:
   - ドメインの類似性
   - トリガーパターンの重複
   - アクションシーケンスの関係
3. 3つ以上の関連instinctの各クラスターについて:
   - 進化タイプを決定（command/skill/agent）
   - 適切なファイルを生成
   - `~/.claude/homunculus/evolved/{commands,skills,agents}/`に保存
4. 進化した構造をソースinstinctにリンク

## 出力フォーマット

```
🧬 Evolve Analysis
==================

進化の準備ができた3つのクラスターが見つかりました:

## Cluster 1: Database Migration Workflow
Instincts: new-table-migration, update-schema, regenerate-types
Type: Command
Confidence: 85% (12件の観察に基づく)

作成予定: /new-table command
Files:
  - ~/.claude/homunculus/evolved/commands/new-table.md

## Cluster 2: Functional Code Style
Instincts: prefer-functional, use-immutable, avoid-classes, pure-functions
Type: Skill
Confidence: 78% (8件の観察に基づく)

作成予定: functional-patterns skill
Files:
  - ~/.claude/homunculus/evolved/skills/functional-patterns.md

## Cluster 3: Debugging Process
Instincts: debug-check-logs, debug-isolate, debug-reproduce, debug-verify
Type: Agent
Confidence: 72% (6件の観察に基づく)

作成予定: debugger agent
Files:
  - ~/.claude/homunculus/evolved/agents/debugger.md

---
これらのファイルを作成するには`/evolve --execute`を実行してください。
```

## フラグ

- `--execute`: 実際に進化した構造を作成（デフォルトはプレビュー）
- `--dry-run`: 作成せずにプレビュー
- `--domain <name>`: 指定したドメインのinstinctのみを進化
- `--threshold <n>`: クラスターを形成するために必要な最小instinct数（デフォルト: 3）
- `--type <command|skill|agent>`: 指定したタイプのみを作成

## 生成されるファイルフォーマット

### Command
```markdown
---
name: new-table
description: Create a new database table with migration, schema update, and type generation
command: /new-table
evolved_from:
  - new-table-migration
  - update-schema
  - regenerate-types
---

# New Table Command

[クラスター化されたinstinctに基づいて生成されたコンテンツ]

## Steps
1. ...
2. ...
```

### Skill
```markdown
---
name: functional-patterns
description: Enforce functional programming patterns
evolved_from:
  - prefer-functional
  - use-immutable
  - avoid-classes
---

# Functional Patterns Skill

[クラスター化されたinstinctに基づいて生成されたコンテンツ]
```

### Agent
```markdown
---
name: debugger
description: Systematic debugging agent
model: sonnet
evolved_from:
  - debug-check-logs
  - debug-isolate
  - debug-reproduce
---

# Debugger Agent

[クラスター化されたinstinctに基づいて生成されたコンテンツ]
```
