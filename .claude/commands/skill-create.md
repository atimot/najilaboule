---
name: skill-create
description: Analyze local git history to extract coding patterns and generate SKILL.md files. Local version of the Skill Creator GitHub App.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /skill-create - ローカルスキル生成

リポジトリのgit履歴を分析してコーディングパターンを抽出し、チームのプラクティスをClaudeに教えるSKILL.mdファイルを生成します。

## 使用方法

```bash
/skill-create                    # 現在のリポジトリを分析
/skill-create --commits 100      # 最後の100コミットを分析
/skill-create --output ./skills  # カスタム出力ディレクトリ
/skill-create --instincts        # continuous-learning-v2用のinstinctsも生成
```

## 実行内容

1. **Git履歴を解析** - コミット、ファイル変更、パターンを分析
2. **パターンを検出** - 繰り返しのワークフローと規約を特定
3. **SKILL.mdを生成** - 有効なClaude Codeスキルファイルを作成
4. **オプションでInstinctsを作成** - continuous-learning-v2システム用

## 分析ステップ

### Step 1: Gitデータを収集

```bash
# ファイル変更を含む最近のコミットを取得
git log --oneline -n ${COMMITS:-200} --name-only --pretty=format:"%H|%s|%ad" --date=short

# ファイル別のコミット頻度を取得
git log --oneline -n 200 --name-only | grep -v "^$" | grep -v "^[a-f0-9]" | sort | uniq -c | sort -rn | head -20

# コミットメッセージパターンを取得
git log --oneline -n 200 | cut -d' ' -f2- | head -50
```

### Step 2: パターンを検出

以下のパターンタイプを探す:

| パターン | 検出方法 |
|---------|-----------------|
| **コミット規約** | コミットメッセージの正規表現（feat:, fix:, chore:） |
| **ファイルの共変更** | 常に一緒に変更されるファイル |
| **ワークフローシーケンス** | 繰り返しのファイル変更パターン |
| **アーキテクチャ** | フォルダ構造と命名規約 |
| **テストパターン** | テストファイルの場所、命名、カバレッジ |

### Step 3: SKILL.mdを生成

出力フォーマット:

```markdown
---
name: {repo-name}-patterns
description: Coding patterns extracted from {repo-name}
version: 1.0.0
source: local-git-analysis
analyzed_commits: {count}
---

# {Repo Name} Patterns

## Commit Conventions
{検出されたコミットメッセージパターン}

## Code Architecture
{検出されたフォルダ構造と組織}

## Workflows
{検出された繰り返しのファイル変更パターン}

## Testing Patterns
{検出されたテスト規約}
```

### Step 4: Instinctsを生成（--instinctsの場合）

continuous-learning-v2統合用:

```yaml
---
id: {repo}-commit-convention
trigger: "when writing a commit message"
confidence: 0.8
domain: git
source: local-repo-analysis
---

# Use Conventional Commits

## Action
コミットにプレフィックス: feat:, fix:, chore:, docs:, test:, refactor:

## Evidence
- {n}件のコミットを分析
- {percentage}%がconventional commit形式に従っている
```

## 出力例

TypeScriptプロジェクトで`/skill-create`を実行すると以下が生成される可能性:

```markdown
---
name: my-app-patterns
description: Coding patterns from my-app repository
version: 1.0.0
source: local-git-analysis
analyzed_commits: 150
---

# My App Patterns

## Commit Conventions

このプロジェクトは**conventional commits**を使用:
- `feat:` - 新機能
- `fix:` - バグ修正
- `chore:` - メンテナンスタスク
- `docs:` - ドキュメント更新

## Code Architecture

```
src/
├── components/     # Reactコンポーネント（PascalCase.tsx）
├── hooks/          # カスタムフック（use*.ts）
├── utils/          # ユーティリティ関数
├── types/          # TypeScript型定義
└── services/       # APIと外部サービス
```

## Workflows

### 新しいコンポーネントを追加
1. `src/components/ComponentName.tsx`を作成
2. `src/components/__tests__/ComponentName.test.tsx`にテストを追加
3. `src/components/index.ts`からエクスポート

### データベースマイグレーション
1. `src/db/schema.ts`を変更
2. `pnpm db:generate`を実行
3. `pnpm db:migrate`を実行

## Testing Patterns

- テストファイル: `__tests__/`ディレクトリまたは`.test.ts`サフィックス
- カバレッジ目標: 80%+
- フレームワーク: Vitest
```

## GitHub App統合

高度な機能（10k+コミット、チーム共有、自動PR）には[Skill Creator GitHub App](https://github.com/apps/skill-creator)を使用:

- インストール: [github.com/apps/skill-creator](https://github.com/apps/skill-creator)
- 任意のissueで`/skill-creator analyze`をコメント
- 生成されたスキルを含むPRを受け取る

## 関連コマンド

- `/instinct-import` - 生成されたinstinctsをインポート
- `/instinct-status` - 学習したinstinctsを表示
- `/evolve` - instinctsをskills/agentsにクラスタリング

---

*[Everything Claude Code](https://github.com/affaan-m/everything-claude-code)の一部*
