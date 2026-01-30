---
name: continuous-learning
description: Automatically extract reusable patterns from Claude Code sessions and save them as learned skills for future use.
---

# 継続的学習スキル

Claude Codeセッションの終了時に自動評価し、学習済みスキルとして保存できる再利用可能なパターンを抽出する。

## 仕組み

このスキルは各セッション終了時に**Stopフック**として実行される：

1. **セッション評価**: セッションに十分なメッセージがあるか確認（デフォルト：10以上）
2. **パターン検出**: セッションから抽出可能なパターンを特定
3. **スキル抽出**: 有用なパターンを`~/.claude/skills/learned/`に保存

## 設定

`config.json`を編集してカスタマイズ：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

## パターンタイプ

| Pattern | Description |
|---------|-------------|
| `error_resolution` | How specific errors were resolved |
| `user_corrections` | Patterns from user corrections |
| `workarounds` | Solutions to framework/library quirks |
| `debugging_techniques` | Effective debugging approaches |
| `project_specific` | Project-specific conventions |

## フックセットアップ

`~/.claude/settings.json`に追加：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

## なぜStopフックか？

- **軽量**: セッション終了時に1回だけ実行
- **ノンブロッキング**: すべてのメッセージに遅延を追加しない
- **完全なコンテキスト**: 完全なセッショントランスクリプトにアクセス可能

## 関連

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Section on continuous learning
- `/learn` command - Manual pattern extraction mid-session

---

## 比較メモ（リサーチ：2025年1月）

### vs Homunculus (github.com/humanplane/homunculus)

Homunculus v2はより洗練されたアプローチを採用：

| Feature | Our Approach | Homunculus v2 |
|---------|--------------|---------------|
| Observation | Stop hook (end of session) | PreToolUse/PostToolUse hooks (100% reliable) |
| Analysis | Main context | Background agent (Haiku) |
| Granularity | Full skills | Atomic "instincts" |
| Confidence | None | 0.3-0.9 weighted |
| Evolution | Direct to skill | Instincts → cluster → skill/command/agent |
| Sharing | None | Export/import instincts |

**homunculusからの重要な洞察:**
> "v1はスキルに依存して観察していた。スキルは確率的で、約50-80%の確率で発火する。v2は観察にフック（100%信頼性）を使用し、学習された行動の原子単位としてインスティンクトを使用。"

### v2の潜在的な強化

1. **インスティンクトベースの学習** - 信頼度スコア付きの小さな原子的行動
2. **バックグラウンドオブザーバー** - 並列で分析するHaikuエージェント
3. **信頼度の減衰** - 矛盾した場合にインスティンクトの信頼度が低下
4. **ドメインタグ付け** - code-style、testing、git、debuggingなど
5. **進化パス** - 関連するインスティンクトをスキル/コマンドにクラスター化

詳細仕様は`/Users/affoon/Documents/tasks/12-continuous-learning-v2.md`を参照。
