---
name: instinct-status
description: Show all learned instincts with their confidence levels
command: true
---

# Instinct Status Command

学習されたすべてのinstinctを信頼度スコア付きで、ドメイン別にグループ化して表示します。

## 実装

プラグインルートパスを使用してinstinct CLIを実行:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

または`CLAUDE_PLUGIN_ROOT`が設定されていない場合（手動インストール）:

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 使用方法

```
/instinct-status
/instinct-status --domain code-style
/instinct-status --low-confidence
```

## 実行内容

1. `~/.claude/homunculus/instincts/personal/`からすべてのinstinctファイルを読み取り
2. `~/.claude/homunculus/instincts/inherited/`から継承されたinstinctを読み取り
3. 信頼度バー付きでドメイン別にグループ化して表示

## 出力フォーマット

```
📊 Instinct Status
==================

## Code Style (4 instincts)

### prefer-functional-style
Trigger: when writing new functions
Action: Use functional patterns over classes
Confidence: ████████░░ 80%
Source: session-observation | Last updated: 2025-01-22

### use-path-aliases
Trigger: when importing modules
Action: Use @/ path aliases instead of relative imports
Confidence: ██████░░░░ 60%
Source: repo-analysis (github.com/acme/webapp)

## Testing (2 instincts)

### test-first-workflow
Trigger: when adding new functionality
Action: Write test first, then implementation
Confidence: █████████░ 90%
Source: session-observation

## Workflow (3 instincts)

### grep-before-edit
Trigger: when modifying code
Action: Search with Grep, confirm with Read, then Edit
Confidence: ███████░░░ 70%
Source: session-observation

---
Total: 9 instincts (4 personal, 5 inherited)
Observer: Running (last analysis: 5 min ago)
```

## フラグ

- `--domain <name>`: ドメインでフィルタ（code-style, testing, git, etc.）
- `--low-confidence`: 信頼度 < 0.5のinstinctのみを表示
- `--high-confidence`: 信頼度 >= 0.7のinstinctのみを表示
- `--source <type>`: ソースでフィルタ（session-observation, repo-analysis, inherited）
- `--json`: プログラム使用のためJSON形式で出力
