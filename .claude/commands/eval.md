# Eval Command

Eval駆動開発ワークフローを管理します。

## 使用方法

`/eval [define|check|report|list] [feature-name]`

## Evalの定義

`/eval define feature-name`

新しいeval定義を作成:

1. 以下のテンプレートで`.claude/evals/feature-name.md`を作成:

```markdown
## EVAL: feature-name
Created: $(date)

### Capability Evals
- [ ] [機能1の説明]
- [ ] [機能2の説明]

### Regression Evals
- [ ] [既存の動作1がまだ動く]
- [ ] [既存の動作2がまだ動く]

### Success Criteria
- capability evalsでpass@3 > 90%
- regression evalsでpass^3 = 100%
```

2. 具体的な基準を入力するようユーザーに促す

## Evalのチェック

`/eval check feature-name`

機能のevalを実行:

1. `.claude/evals/feature-name.md`からeval定義を読み取り
2. 各capability evalについて:
   - 基準を検証
   - PASS/FAILを記録
   - `.claude/evals/feature-name.log`に試行を記録
3. 各regression evalについて:
   - 関連テストを実行
   - ベースラインと比較
   - PASS/FAILを記録
4. 現在のステータスをレポート:

```
EVAL CHECK: feature-name
========================
Capability: X/Y passing
Regression: X/Y passing
Status: IN PROGRESS / READY
```

## Evalレポート

`/eval report feature-name`

包括的なevalレポートを生成:

```
EVAL REPORT: feature-name
=========================
Generated: $(date)

CAPABILITY EVALS
----------------
[eval-1]: PASS (pass@1)
[eval-2]: PASS (pass@2) - リトライが必要だった
[eval-3]: FAIL - 注記参照

REGRESSION EVALS
----------------
[test-1]: PASS
[test-2]: PASS
[test-3]: PASS

METRICS
-------
Capability pass@1: 67%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
[問題、エッジケース、または観察事項]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## Evalの一覧

`/eval list`

すべてのeval定義を表示:

```
EVAL DEFINITIONS
================
feature-auth      [3/5 passing] IN PROGRESS
feature-search    [5/5 passing] READY
feature-export    [0/4 passing] NOT STARTED
```

## 引数

$ARGUMENTS:
- `define <name>` - 新しいeval定義を作成
- `check <name>` - evalを実行してチェック
- `report <name>` - 完全なレポートを生成
- `list` - すべてのevalを表示
- `clean` - 古いevalログを削除（最後の10回分を保持）
