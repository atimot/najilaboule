---
name: ship
description: 実装した変更を「フル検証 → PR → auto-merge 予約 → デプロイ見届け」の順で本番まで一貫して届ける。"これを出して" "PR にしてマージまで" "デプロイして" のような依頼で使う。依存更新は dependabot-merge を使う。
metadata:
  author: atimot
  version: "1.0.0"
  argument-hint: "[--dry-run] [--no-merge]"
---

# 変更を本番まで届ける (ship)

ローカルで実装済みの変更を、検証 → PR → マージ → デプロイ見届けの順で本番へ届け、最後にサマリを報告する。GitHub 側の CI が required check なので、マージは `--auto` 予約で行い、実際の merge は CI が緑になってから GitHub が実行する。

## 引数

- 引数なし: 現在のブランチの変更を本番まで届ける
- `--dry-run`: 検証と PR 作成までで停止し、マージはしない (マージ可否の判定とレポートは行う)
- `--no-merge`: PR は作るが auto-merge 予約をしない (人間確認必須の変更向け)

## 大原則

- **検証が全て通った変更だけをマージ対象にする**。1つでも失敗したらマージせず、原因を報告する
- **デプロイが失敗したら全処理を停止**し、原因調査と修正を最優先する
- `package-lock.json` を手で編集しない。lockfile 変更は必ず `npx -y npm@latest` 経由 (Edit/Write は deny 済み)
- **検証後にツリーを変えたら検証を最初からやり直す** (rebase・追加コミットなど。検証したものと違う木をマージしない)
- **マージ判断の線引きは CLAUDE.md「CI/CD と自律マージ」に従う**。デザイン変更 (`DESIGN.md`/`@theme`)・情報構造の変更・コピー語感の変更は CI が緑でも auto-merge せず、`--no-merge` 相当で人間に委ねる
- 判断に迷う差分はマージせず人間に委ねる

## 手順

### 0. 前提確認

```bash
git rev-parse --abbrev-ref HEAD   # main では作業しない。main ならブランチを切る
git status --short                 # 変更内容を把握
```

main 直上にいるなら作業ブランチを切る (`git switch -c <topic>`)。変更が「自律マージ可」か「人間確認必須」かを CLAUDE.md の線引きで判定し、後者なら `--no-merge` を既定にする。

### 1. フル検証 (すべて成功が必須)

順に実行。途中で失敗したらマージ判定は不合格のまま、残りは情報収集として実行してよい。

1. **クリーンインストール (2系統)** — lockfile 整合性。片方でも EUSAGE/ERESOLVE が出たら失敗:
   ```bash
   npm ci
   npx -y npm@latest ci
   ```
2. **lint**: `npm run lint`
3. **build**: `npm run build` (tsc -b 込み)
4. **起動スモーク**: `npm run test:smoke` (build 済み dist を vite preview 経由で検証。CI と同じゲート)
5. **lockfile を変更した場合のみ** wasm optional 依存の脱落チェック:
   ```bash
   npm run check:lockfile
   ```
   欠落していたら `npx -y npm@latest install --package-lock-only` で再生成し、検証を最初からやり直す

### 2. コミットと push

検証が全通したらコミットし、PR ブランチへ push する。コミットメッセージはリポジトリの語感 (日本語・簡潔) に合わせる。

```bash
git add -A
git commit -m "<変更内容を端的に>"
git push -u origin HEAD
```

### 3. PR 作成

```bash
gh pr create --base main --title "<タイトル>" --body "<変更概要 / 検証結果 / 影響範囲>"
```

本文には実施した検証 (lint/build/smoke の結果) と、デザイン/情報構造への影響有無を明記する。

### 4. マージ (auto-merge 予約)

**`--dry-run` または `--no-merge` 指定時、あるいは「人間確認必須」の変更ではここで停止**し、「マージ可能」と判定した旨と根拠をレポートに記録して終了 (人間がレビューしてマージ)。

それ以外は auto-merge を予約する。CI (required check) が緑になり次第 GitHub が自動マージする:

```bash
gh pr merge --merge --auto
```

(マージコミット方式 — このリポジトリの慣習。squash しない)

予約後、CI の結果を見届ける:

```bash
gh pr checks --watch
```

CI が落ちたら auto-merge は実行されない。失敗ログ (`gh run view <id> --log-failed`) を調べて修正し、検証 (手順1) からやり直す。

### 5. デプロイ見届け

マージされたら、デプロイ workflow の完走をマージコミット SHA で特定して待つ (直前の成功 run を誤認しないため):

```bash
sha=$(gh pr view <N> --json mergeCommit --jq .mergeCommit.oid)
until run_id=$(gh run list --commit "$sha" --workflow "Deploy to GitHub Pages" --limit 1 --json databaseId --jq '.[0].databaseId') && [ -n "$run_id" ]; do sleep 5; done
gh run watch "$run_id" --exit-status
```

本番 URL の確認:

```bash
url=$(gh api repos/{owner}/{repo}/pages --jq '.html_url')
curl -s -o /dev/null -w "HTTP %{http_code}\n" "$url"
```

HTTP 200 であること。**デプロイ失敗時は以降の処理を全停止**し、原因修正を最優先する (revert PR → 再デプロイで戻せる)。

### 6. レポート

- 結果: マージ済み / 予約済み (CI 待ち) / 人間確認待ち / 要対応
- 実施した検証と結果
- デプロイ結果 (本番 URL の HTTP ステータス)
- 人間確認に委ねた場合はその理由

## エラー時の振る舞い

| 状況 | 対応 |
|---|---|
| ローカル検証失敗 | マージせず原因を報告。修正して手順1から |
| CI 失敗 (auto-merge 予約後) | auto-merge は実行されない。ログ調査 → 修正 → 検証やり直し |
| 人間確認必須の変更 | `--no-merge` 相当。PR まで作り、マージは人間に委ねる |
| デプロイ失敗 | 全処理を停止 (手順5) |
| 判断に迷う差分 | マージせず人間に委ねる |

## このリポジトリ固有の落とし穴

- **lockfile の再生成は必ず `npx -y npm@latest`**。ローカル npm は `@emnapi/*` など wasm 系 optional 依存を脱落させ、ローカルは通るのに CI の `npm ci` だけが落ちる
- **自分の PR は自分で approve できない**。required gate は CI のみで、レビュー必須にはしない
- worktree で作業する場合、親リポジトリの `node_modules` を Node が解決することがある。パッケージ確認は `ls node_modules/<pkg>` で
