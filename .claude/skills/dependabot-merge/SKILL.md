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
- `--dry-run`: ステップ5(マージ)と6(デプロイ見届け)をスキップする。マージ可否の判定と最終レポートは行う

## 大原則

- **検証がすべて通った PR だけをマージする**。1つでも失敗したらその PR はマージせず、理由を PR コメントに記録して次へ進む
- **デプロイが失敗したら全処理を停止**し、原因調査と修正を最優先する。修正がマージされ deploy が緑に戻るまで次の PR に進まない
- lockfile(package-lock.json)を手で編集しない。変更は必ず npm コマンド経由で行う(Edit/Write は deny 設定済み)
- **手順3の検証の後にコミット内容を変えたら、手順3を最初からやり直す**(rebase、peer 対応の追加バンプ、lockfile 再生成など。検証したものと違うツリーをマージしない)
- 判断に迷う差分(意図不明の大規模変更など)を見つけたら、マージせずレポートで人間に委ねる

## 手順

### 0. 対象の列挙

```bash
gh pr list --author app/dependabot --state open --json number,title,mergeable,mergeStateStatus
```

対象がなければ「処理対象の Dependabot PR はありません」と報告して終了。
引数で PR 番号が指定された場合はその PR のみ対象とする(author が Dependabot でなければ確認を求める)。

`mergeable` が `UNKNOWN` の PR は GitHub が計算中(recreate 直後など)。30秒ほど待って再取得する。

後の手順3で比較するため、main 時点の脆弱性ベースラインをここで記録しておく。**現在のブランチではなく origin/main の lockfile に対して**実行すること(作業ツリーを汚さないよう一時ディレクトリで):

```bash
tmp=$(mktemp -d) && git show origin/main:package.json > "$tmp/package.json" && git show origin/main:package-lock.json > "$tmp/package-lock.json" && (cd "$tmp" && npm audit --json | jq -c .metadata.vulnerabilities)
```

### 1. 影響調査(PR ごと)

1. `gh pr view <N>` と `gh pr diff <N>` で変更内容を取得
2. 更新パッケージごとに semver 種別(patch / minor / major)を判定。グループ PR は本文の一覧から内訳を展開する
3. major 更新、または依存ツリーの構造が変わる更新(例: vite 8 で rollup→rolldown に入替)は、PR 本文のリリースノートを読み breaking changes を控える。必要なら WebFetch で公式 changelog を確認
4. セキュリティ更新の場合は対応アラートを特定:
   ```bash
   gh api --paginate 'repos/{owner}/{repo}/dependabot/alerts?state=open&per_page=100' --jq '.[] | {num: .number, pkg: .dependency.package.name, sev: .security_advisory.severity}'
   ```
5. ある PR のマージで別のオープン PR が不要になる関係(同一パッケージの更新を包含するなど)があれば控えておき、マージ後に不要 PR を理由コメント付きでクローズする

### 2. コンフリクト解消(必要な PR のみ)

mergeable が `CONFLICTING` の場合:

1. `git fetch origin` で main を最新化(直前のマージを取り込む)してから `gh pr checkout <N>`、`git rebase origin/main`
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
5. rebase 結果を PR ブランチへ push する:
   ```bash
   git push --force-with-lease origin HEAD:<PRブランチ名>
   ```
6. 上記の push が権限で拒否されたら、新ブランチ名で通常 push し、`Closes #<N>` を本文に含む新 PR を作成して以降の処理をそちらで続行する:
   ```bash
   git push origin HEAD:deps/<内容がわかる名前>
   gh pr create --base main --head deps/<名前> --title "<元PRと同等のタイトル>" --body "Dependabot PR #<N> のコンフリクト解消版。検証内容: ...

   Closes #<N>"
   ```

### 3. 検証(PR ごと・フル)

対象 PR のブランチへ `gh pr checkout <N>` で移動してから(手順2を実施した場合はそのブランチのまま)順に実行。**すべて成功が必須**。途中で失敗してもマージ判定は不合格のまま、残りのチェックを情報収集として実行してよい(レポートが充実する):

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
   欠落していたら lockfile を `npx -y npm@latest install --package-lock-only` で再生成する。それでも欠落する場合のみ、「lockfile を手で編集しない」原則の例外として次でスケルトン化してからゼロから再生成する: `printf '{"name":"najilaboule","version":"0.0.0","lockfileVersion":3,"requires":true,"packages":{}}' > package-lock.json && npx -y npm@latest install --package-lock-only`
5. **audit**: `npm audit --json | jq -c .metadata.vulnerabilities` を実行し、手順0で記録した main のベースラインと比較して、どの severity も件数が増えていないこと(0 のままが理想)
6. **preview での目視確認**:
   ```bash
   npm run preview &
   ```
   (build は検証2で実行済み。preview はベースパス付き URL で配信される — 起動ログに表示される URL(このリポジトリでは http://localhost:4173/najilaboule/)を使うこと。ルートの http://localhost:4173 はページではない)
   preview の URL に対して Chrome DevTools MCP(または利用可能なブラウザツール)で:
   - スクリーンショットを取得しレイアウト崩れがないか確認
   - コンソールにエラーが出ていないか確認
   - 確認後 preview プロセスを停止する。`kill %1` や npm ラッパー PID の kill では vite の子プロセスが生き残るため、ポートで特定して止める: `lsof -ti tcp:4173 | xargs kill`
   ブラウザツールが使えない場合は `curl` で HTTP 200 と HTML 内容のスモークチェックに切り替え、レポートに「目視確認は未実施」と明記する

### 4. レビュー(PR ごと)

- `git diff origin/main -- package.json` の差分が更新対象パッケージのみであること
- peer dependency の矛盾(検証1の ERESOLVE)があれば、peer 対応版への**最小の追加バンプ**で解消を試みる(例: eslint 10 化には eslint-plugin-react-hooks 7.1.1 が必要だった)。追加バンプした場合は PR 本文にパッケージ名と理由を明記する。解消できなければ検証失敗扱い
- lockfile に無関係なパッケージの大規模変更が混入していないこと(多少の in-range 更新は lockfile 再生成の正常な副作用なので可)
- major 更新でリポジトリ側のソース/設定の修正が必要になった場合(例: TypeScript 6 で `baseUrl` が廃止され tsconfig の修正が必要)、その修正を依存 PR に混ぜない。修正が自明なら**別 PR として main に先行マージ**し、Dependabot PR を rebase(`@dependabot rebase` コメントか手順2)してから手順3をやり直す。自明でなければこの PR はスキップしてレポートで人間に委ねる

### 5. マージ

**`--dry-run` 指定時はここで停止**し、「マージ可能」と判定した旨と判定根拠をレポートに記録して次の PR へ。

```bash
gh pr merge <N> --merge
```

(マージコミット方式 — このリポジトリの慣習。squash しない)

### 6. デプロイ見届け(マージごと)

1. デプロイ workflow の完走を待つ。**直前の(成功済みの)run を誤って掴まないよう**、必ずマージコミットの SHA で run を特定する:
   ```bash
   sha=$(gh pr view <N> --json mergeCommit --jq .mergeCommit.oid)
   until run_id=$(gh run list --commit "$sha" --workflow "Deploy to GitHub Pages" --limit 1 --json databaseId --jq '.[0].databaseId') && [ -n "$run_id" ]; do sleep 5; done
   gh run watch "$run_id" --exit-status
   ```
2. 本番 URL の確認:
   ```bash
   url=$(gh api repos/{owner}/{repo}/pages --jq '.html_url')
   curl -s -o /dev/null -w "HTTP %{http_code}\n" "$url"
   ```
   HTTP 200 であること。可能ならスクリーンショットでも表示を確認
3. **デプロイ失敗時**: 以降の PR 処理をすべて停止。失敗ログを `gh run view <id> --log-failed` で調査し、原因修正を最優先する(例: lockfile の wasm 依存欠落なら手順3の4の再生成で修正 PR を作る)

### 7. レポート(全件処理後)

以下を含むサマリを提示する:

- PR ごとの結果: マージ済み / スキップ(理由と PR コメントへのリンク)/ 要対応
- 追加バンプ・差替 PR・クローズした PR があればその内訳
- Dependabot アラートの残数:
  ```bash
  gh api --paginate 'repos/{owner}/{repo}/dependabot/alerts?state=open&per_page=100' --jq 'length'
  ```
- 検証で degrade した項目(目視未実施など)

## エラー時の振る舞い

| 状況 | 対応 |
|---|---|
| 検証失敗 | マージせずスキップし、`gh pr comment` で失敗内容を記録。他 PR は続行 |
| peer dependency 矛盾 | 手順4の追加バンプで解消を試みる。解消後は手順3を再実行。不可なら検証失敗扱い |
| major 更新がソース/設定の修正を要求 | 修正を別 PR で main に先行マージ → PR を rebase → 手順3再実行(手順4参照) |
| デプロイ失敗 | 全処理を停止(手順6の3参照) |
| Dependabot ブランチへ push 不可 | 新ブランチ + 新 PR で代替(手順2の6参照) |
| ある PR のマージで別 PR が不要化 | 不要 PR を理由コメント付きでクローズ(手順1の5参照) |
| 判断に迷う差分 | マージせず、レポートで人間の判断を仰ぐ |

## このリポジトリ固有の落とし穴

- **lockfile の再生成は必ず `npx -y npm@latest`**。ローカル npm(古い場合)は `@emnapi/core` / `@emnapi/runtime` など wasm 系 optional 依存を脱落させ、ローカル検証は通るのに CI の npm ci だけが落ちる(2026-06-11 に main のデプロイが2回停止した実績)
- **rebase で package.json を `--theirs` で丸採用しない**。main 側で進んだ更新が巻き戻る(vite 8→7 巻き戻り事故)
- worktree で作業する場合、親リポジトリの `node_modules` を Node が解決してしまうことがある。パッケージの存在確認は `ls node_modules/<pkg>` や `require.resolve` のパスで行う
