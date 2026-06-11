# `/dependabot-merge` スキル実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dependabot PR を影響調査→検証→レビュー→マージ→デプロイ見届けまで一貫処理する project skill `/dependabot-merge` を作る。

**Architecture:** `.claude/skills/dependabot-merge/SKILL.md` に手順書(スキル)を1ファイルで実装し、`.claude/settings.json` に最小限の permission を追記する。コードは書かない — 成果物は Claude が実行する手順書と設定のみ。検証は実 PR への dry-run 実行で行う。

**Tech Stack:** Claude Code project skills(SKILL.md + YAML frontmatter)、gh CLI、npm / npx

**Spec:** [docs/superpowers/specs/2026-06-11-dependabot-merge-skill-design.md](../specs/2026-06-11-dependabot-merge-skill-design.md)

**前提知識(ゼロコンテキストの実装者向け):**
- このリポジトリは React 19 + Vite + Tailwind v4 の LP。main へのマージで GitHub Actions("Deploy to GitHub Pages" workflow)が自動デプロイする
- project skill は `.claude/skills/<name>/SKILL.md` に置くと `/dependabot-merge` で起動できる。frontmatter 規約は既存の `.claude/skills/web-design-guidelines/SKILL.md` を踏襲する
- **新しい skill はセッション再起動後に認識される**(実行中セッションの skill 一覧には現れない)
- このプロジェクトの権限設定では `git push --force*` / `rm` / `git reset --hard` が拒否されることがある。また `package-lock.json` への Edit/Write は deny されている(npm コマンド経由の変更は可)

---

### Task 1: SKILL.md の作成

**Files:**
- Create: `.claude/skills/dependabot-merge/SKILL.md`

- [ ] **Step 1: ディレクトリを作成して SKILL.md を書く**

以下の内容で `.claude/skills/dependabot-merge/SKILL.md` を作成する(全文):

````markdown
---
name: dependabot-merge
description: Dependabot が作成した PR を影響調査→検証→レビュー→マージ→デプロイ見届けまで一貫処理する。引数に PR 番号(省略時は全件)、--dry-run(マージ直前まで)を指定可。"dependabot の PR を処理して" "依存更新をマージして" のような依頼でも使う。
metadata:
  author: atimot
  version: "1.0.0"
  argument-hint: "[PR番号] [--dry-run]"
---

# Dependabot PR の検証とマージ

Dependabot PR を 1 件ずつ「影響調査 → コンフリクト解消 → 検証 → レビュー → マージ → デプロイ見届け」の順で処理し、最後にサマリを報告する。

## 引数

- 数値(例: `18`): その PR のみ処理。省略時はオープン中の Dependabot PR 全件を番号順に処理
- `--dry-run`: ステップ5(マージ)以降を実行しない。マージ可否の判定とレポートまで行う

## 大原則

- **検証がすべて通った PR だけをマージする**。1つでも失敗したらその PR はマージせず、理由を PR コメントに記録して次へ進む
- **デプロイが失敗したら全処理を停止**し、原因調査と修正を最優先する。修正がマージされ deploy が緑に戻るまで次の PR に進まない
- lockfile(package-lock.json)を手で編集しない。変更は必ず npm コマンド経由で行う(Edit/Write は deny 設定済み)
- 判断に迷う差分(意図不明の大規模変更など)を見つけたら、マージせずレポートで人間に委ねる

## 手順

### 0. 対象の列挙

```bash
gh pr list --author app/dependabot --state open --json number,title,mergeable,mergeStateStatus
```

対象がなければ「処理対象の Dependabot PR はありません」と報告して終了。
引数で PR 番号が指定された場合はその PR のみ対象とする(author が Dependabot でなければ確認を求める)。

### 1. 影響調査(PR ごと)

1. `gh pr view <N>` と `gh pr diff <N>` で変更内容を取得
2. 更新パッケージごとに semver 種別(patch / minor / major)を判定。グループ PR は本文の一覧から内訳を展開する
3. major 更新、または依存ツリーの構造が変わる更新(例: vite 8 で rollup→rolldown に入替)は、PR 本文のリリースノートを読み breaking changes を控える。必要なら WebFetch で公式 changelog を確認
4. セキュリティ更新の場合は対応アラートを特定:
   ```bash
   gh api repos/{owner}/{repo}/dependabot/alerts --jq '.[] | select(.state == "open") | {num: .number, pkg: .dependency.package.name, sev: .security_advisory.severity}'
   ```
5. ある PR のマージで別のオープン PR が不要になる関係(同一パッケージの更新を包含するなど)があれば控えておき、マージ後に不要 PR を理由コメント付きでクローズする

### 2. コンフリクト解消(必要な PR のみ)

mergeable が `CONFLICTING` の場合:

1. `gh pr checkout <N>` してから `git rebase origin/main`
2. package.json がコンフリクトしたら**手でマージする**。PR 側を丸ごと採用(`git checkout --theirs`)してはならない — main 側で進んだ他パッケージのバージョンが巻き戻る(2026-06 に vite 8→7 巻き戻り事故が実際に発生)
3. package-lock.json のコンフリクトは main 側を採用して再生成:
   ```bash
   git checkout --ours package-lock.json
   npx -y npm@latest install --package-lock-only
   git add package.json package-lock.json
   GIT_EDITOR=true git rebase --continue
   ```
4. rebase 後に必ず差分を点検する。差分が「この PR の意図した更新」だけであること:
   ```bash
   git diff origin/main -- package.json
   ```
5. Dependabot ブランチへの push(force)が権限で拒否されたら、新ブランチ名で通常 push し、`Closes #<N>` を本文に含む新 PR を作成して以降の処理をそちらで続行する:
   ```bash
   git push origin HEAD:deps/<内容がわかる名前>
   gh pr create --base main --head deps/<名前> --title "<元PRと同等のタイトル>" --body "Dependabot PR #<N> のコンフリクト解消版。検証内容: ...

   Closes #<N>"
   ```

### 3. 検証(PR ごと・フル)

PR ブランチ(または差替 PR のブランチ)上で順に実行。**すべて成功が必須**:

1. **クリーンインストール(2系統)** — ローカル npm と最新 npm の両方で lockfile が整合すること:
   ```bash
   npm ci
   npx -y npm@latest ci
   ```
   ⚠️ 片方でも EUSAGE(lockfile 不整合)や ERESOLVE(peer 矛盾)が出たら失敗。ERESOLVE は手順4のレビューで原因を特定する
2. **ビルド**: `npm run build` が成功すること
3. **lint**: `npm run lint` が成功すること
4. **lockfile 専用チェック** — wasm 系 optional 依存の脱落検出(macOS の npm では脱落してもローカル npm ci が通ってしまい、CI だけが落ちる):
   ```bash
   node -e "
   const l = require('./package-lock.json');
   const need = ['@emnapi/core', '@emnapi/runtime'];
   const missing = need.filter(p => !Object.keys(l.packages).some(k => k.endsWith('node_modules/' + p)));
   if (missing.length) { console.error('lockfile に欠落:', missing.join(', ')); process.exit(1); }
   console.log('wasm optional deps OK');
   "
   ```
   欠落していたら lockfile を `npx -y npm@latest` で再生成する(それでも欠落するなら lockfile を `{"packages": {}}` スケルトンに初期化してゼロから再生成)
5. **audit**: `npm audit` で脆弱性が増えていないこと(`found 0 vulnerabilities` が理想。元から残存しているものは増加していなければ可)
6. **preview での目視確認**:
   ```bash
   npm run build && npm run preview &
   ```
   preview の URL に対して Chrome DevTools MCP(または利用可能なブラウザツール)で:
   - スクリーンショットを取得しレイアウト崩れがないか確認
   - コンソールにエラーが出ていないか確認
   - 確認後 preview プロセスを停止する
   ブラウザツールが使えない場合は `curl` で HTTP 200 と HTML 内容のスモークチェックに切り替え、レポートに「目視確認は未実施」と明記する

### 4. レビュー(PR ごと)

- `git diff origin/main -- package.json` の差分が更新対象パッケージのみであること
- peer dependency の矛盾(検証1の ERESOLVE)があれば、peer 対応版への**最小の追加バンプ**で解消を試みる(例: eslint 10 化には eslint-plugin-react-hooks 7.1.1 が必要だった)。追加バンプした場合は PR 本文にパッケージ名と理由を明記する。解消できなければ検証失敗扱い
- lockfile に無関係なパッケージの大規模変更が混入していないこと(多少の in-range 更新は lockfile 再生成の正常な副作用なので可)

### 5. マージ

**`--dry-run` 指定時はここで停止**し、「マージ可能」と判定した旨と判定根拠をレポートに記録して次の PR へ。

```bash
gh pr merge <N> --merge
```

(マージコミット方式 — このリポジトリの慣習。squash しない)

### 6. デプロイ見届け(マージごと)

1. デプロイ workflow の完走を待つ:
   ```bash
   sleep 15
   run_id=$(gh run list --branch main --workflow "Deploy to GitHub Pages" --limit 1 --json databaseId --jq '.[0].databaseId')
   gh run watch $run_id --exit-status
   ```
2. 本番 URL の確認:
   ```bash
   url=$(gh api repos/{owner}/{repo}/pages --jq '.html_url')
   curl -s -o /dev/null -w "HTTP %{http_code}\n" "$url"
   ```
   HTTP 200 であること。可能ならスクリーンショットでも表示を確認
3. **デプロイ失敗時**: 以降の PR 処理をすべて停止。失敗ログを `gh run view <id> --log-failed` で調査し、原因修正を最優先する(例: lockfile の wasm 依存欠落なら手順3-4の再生成で修正 PR を作る)

### 7. レポート(全件処理後)

以下を含むサマリを提示する:

- PR ごとの結果: マージ済み / スキップ(理由と PR コメントへのリンク)/ 要対応
- 追加バンプ・差替 PR・クローズした PR があればその内訳
- Dependabot アラートの残数:
  ```bash
  gh api repos/{owner}/{repo}/dependabot/alerts --jq '[.[] | select(.state == "open")] | length'
  ```
- 検証で degrade した項目(目視未実施など)

## エラー時の振る舞い

| 状況 | 対応 |
|---|---|
| 検証失敗 | その PR をスキップし、`gh pr comment` で失敗内容を記録。他 PR の処理は続行 |
| peer dependency 矛盾 | 最小の追加バンプで解消を試み、不可なら検証失敗扱い |
| デプロイ失敗 | 全処理を停止し、原因調査・修正を最優先 |
| Dependabot ブランチへ push 不可 | 新ブランチ + 新 PR(`Closes #N`)で代替 |
| ある PR のマージで別 PR が不要化 | 不要になった PR を理由コメント付きでクローズ |
| 判断に迷う差分 | マージせず、レポートで人間の判断を仰ぐ |

## このリポジトリ固有の落とし穴

- **lockfile の再生成は必ず `npx -y npm@latest`**。ローカル npm(古い場合)は `@emnapi/core` / `@emnapi/runtime` など wasm 系 optional 依存を脱落させ、ローカル検証は通るのに CI の npm ci だけが落ちる(2026-06-11 に main のデプロイが2回停止した実績)
- **rebase で package.json を `--theirs` で丸採用しない**。main 側で進んだ更新が巻き戻る(vite 8→7 巻き戻り事故)
- worktree で作業する場合、親リポジトリの `node_modules` を Node が解決してしまうことがある。パッケージの存在確認は `ls node_modules/<pkg>` や `require.resolve` のパスで行う
````

- [ ] **Step 2: frontmatter とファイル構造を確認**

Run: `head -10 .claude/skills/dependabot-merge/SKILL.md`
Expected: `---` で始まり、`name: dependabot-merge`、`description:`、`metadata:` が既存スキル(web-design-guidelines)と同じ構造で出力される

- [ ] **Step 3: コミット**

```bash
git add .claude/skills/dependabot-merge/SKILL.md
git commit -m "feat: Dependabot PR を検証・マージする /dependabot-merge スキルを追加

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: settings.json への permission 追記

**Files:**
- Modify: `.claude/settings.json`(permissions.allow 配列)

- [ ] **Step 1: allow 配列に 3 エントリを追加**

`.claude/settings.json` の `permissions.allow` 配列の `"Bash(npm run *)"` の直後に以下の 3 行を追加する(Edit ツールで):

```json
      "Bash(npm ci)",
      "Bash(npx -y npm@latest *)",
      "Bash(gh run *)",
```

追加後の該当部分:

```json
      "Bash(npm run *)",
      "Bash(npm ci)",
      "Bash(npx -y npm@latest *)",
      "Bash(gh run *)",
      "Bash(npx tsc *)",
```

`deny` 配列(`package-lock.json` の Edit/Write 拒否を含む)は変更しない。

- [ ] **Step 2: JSON の妥当性を検証**

Run: `jq '.permissions.allow | length' .claude/settings.json`
Expected: エラーなく数値(既存 21 + 3 = 24)が出力される

- [ ] **Step 3: コミット**

```bash
git add .claude/settings.json
git commit -m "chore: dependabot-merge スキル用に npm ci / npx npm@latest / gh run を許可

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: dry-run による統合テスト

**Files:** なし(実行テストのみ)

新規 skill は実行中セッションでは Skill ツールに現れないため、このタスクでは **SKILL.md を Read して手順を忠実に実行する**ことでテストする(ユーザーが次セッションで `/dependabot-merge` として使う内容と同一)。

- [ ] **Step 1: 対象 PR の存在確認**

Run: `gh pr list --author app/dependabot --state open --json number,title,mergeable`
Expected: PR #18(月次グループ更新、recreate 済みなら CLEAN)が表示される。**0 件の場合**: 「処理対象なし」と報告して終了するパスを確認し、Step 2 はユーザーが次回 PR 発生時に実施する

- [ ] **Step 2: SKILL.md の手順を `--dry-run 18` 相当で実行**

SKILL.md を Read し、手順 0〜4 + 7(マージ以降を除く)を PR #18 に対して実行する。

Expected:
- 影響調査で更新パッケージの一覧と semver 種別が列挙される
- (CONFLICTING の場合)rebase + lockfile 再生成が手順どおり行われ、`git diff origin/main -- package.json` が意図した更新のみになる
- `npm ci`(2系統)/ build / lint / lockfile チェック / audit / preview 確認がすべて実行される
- 「マージ可能」または「スキップ(理由)」の判定とレポートが出力される
- **マージは実行されない**(`gh pr merge` が呼ばれない)

- [ ] **Step 3: レポート内容をユーザーが確認**

dry-run のレポートをユーザーに提示し、判定が妥当か確認を得る。期待と違う挙動があれば SKILL.md を修正して再実行する。

- [ ] **Step 4: (ユーザー承認後)本実行**

`--dry-run` なしで手順 5〜7 を実行し、マージ → デプロイ完走 → 本番 HTTP 200 → アラート残数の報告まで通す。

Expected: PR がマージされ、"Deploy to GitHub Pages" が success、本番 URL が HTTP 200

---

### Task 4: PR の作成

**Files:** なし(git 操作のみ)

- [ ] **Step 1: ブランチを push して PR を作成**

```bash
git push origin HEAD:feat/dependabot-merge-skill
gh pr create --base main --head feat/dependabot-merge-skill \
  --title "feat: Dependabot PR を検証・マージする /dependabot-merge スキルを追加" \
  --body "Dependabot PR の影響調査→検証→レビュー→マージ→デプロイ見届けを一貫処理する project skill。

- .claude/skills/dependabot-merge/SKILL.md: 手順書本体(--dry-run 対応)
- .claude/settings.json: npm ci / npx npm@latest / gh run の許可を追加
- docs/superpowers/: 設計ドキュメントと実装計画

設計: docs/superpowers/specs/2026-06-11-dependabot-merge-skill-design.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

Expected: PR の URL が出力される

- [ ] **Step 2: ユーザーにレビューとマージを依頼**

スキルは自動マージの権限を持つ設定変更を含むため、この PR 自体は人間がレビューしてマージする。

---

## Self-Review 結果

- **Spec coverage**: 起動 IF(全件/番号/--dry-run)→ Task 1 手順0と引数節 / 影響調査・コンフリクト解消・フル検証・レビュー・マージ・見届け・レポート → SKILL.md 手順 1〜7 / エラー表 → SKILL.md 同表 / settings 追記 → Task 2 / テスト計画 3 項目 → Task 3(0件パスは Step 1 に吸収)。ギャップなし
- **Placeholder scan**: TBD/TODO なし。全ステップに実コマンド・実コードを記載
- **整合性**: スキル名 `dependabot-merge` / ブランチ名 / permission パターン(`npx -y npm@latest *` — スキル内のコマンドはすべて `npx -y npm@latest` 形式で統一)に不一致なし
