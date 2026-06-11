# `/dependabot-merge` スキル設計

日付: 2026-06-11
ステータス: 承認済み

## 目的

Dependabot が作成した PR を、影響調査 → 検証 → レビュー → マージ → デプロイ見届けまで一貫して処理する project skill を作る。起動は手動のみ(ユーザーが PR の存在に気づいたら `/dependabot-merge` を実行する)。検証がすべて通れば major 更新も含めて自動マージする。

2026-06-11 のセッションで PR #8〜#15 を手動処理した際の実証済み手順と教訓(下記)をスキルに焼き込む。

## スコープ外

- 定期実行(スケジュールルーチン・cron)は作らない。必要になったら後からこのスキルを呼ぶ形で追加できる。
- GitHub Actions 側の自動化(auto-merge 等)は変更しない。
- Dependabot 以外の PR の処理。

## 成果物

1. `.claude/skills/dependabot-merge/SKILL.md` — スキル本体(処理手順書)
2. `.claude/settings.json` の permissions.allow への追記(任意・少数)

## 起動インターフェース

- `/dependabot-merge` — オープン中の Dependabot PR(author が `app/dependabot`)を全件処理
- `/dependabot-merge <PR番号>` — 指定 PR のみ処理
- `/dependabot-merge --dry-run` — マージとそれ以降(デプロイ見届け)を行わず、調査・検証・レビュー・レポートまで実行。引数は PR 番号と併用可

## 処理フロー(PR 1件ごと、番号順に直列処理)

### 1. 影響調査

- `gh pr list --author app/dependabot` で対象列挙。`gh pr view` / `gh pr diff` で変更内容を取得。
- 更新対象パッケージと semver 種別(patch / minor / major)を判定。グループ PR は内訳を展開して個別に判定。
- major 更新、または lockfile 上で依存ツリーの構造が大きく変わる更新(例: vite 8 での rollup→rolldown 入替)はリリースノート・チェンジログを確認し、breaking changes をレポートに記録する。
- セキュリティ更新の場合は対応する Dependabot アラートを `gh api repos/{owner}/{repo}/dependabot/alerts` で特定する。

### 2. コンフリクト解消

- mergeable 状態を確認。CONFLICTING の場合:
  1. PR ブランチを checkout し `git rebase origin/main`
  2. package.json のコンフリクトは**手で正しくマージする**(PR 側を丸ごと採用しない — 後述の教訓)
  3. package-lock.json は main 側を採用し `npx -y npm@latest install --package-lock-only` で再生成
  4. Dependabot ブランチへの push(force)が拒否された場合は、新ブランチ名で通常 push し `Closes #N` 付きの新 PR を作成して以降の処理をそちらで続行
- rebase 後、`git diff origin/main -- package.json` で「意図した更新だけが差分になっているか」を必ず確認する(vite 巻き戻し事故の再発防止)。

### 3. 検証(フル)

すべて PR ブランチ(または差替 PR ブランチ)上でクリーン環境から実行:

1. `npm ci` — 通常の npm と `npx -y npm@latest ci` の**両方**で成功すること
2. `npm run build` — 成功すること
3. `npm run lint` — 成功すること
4. lockfile 専用チェック — `package-lock.json` に `@emnapi/core` / `@emnapi/runtime` のエントリが存在すること(macOS の npm が wasm 系 optional 依存を脱落させ CI だけが落ちる既知問題の検出)
5. `npm audit` — 新たな脆弱性が増えていないこと
6. `vite preview` を起動し、Chrome DevTools MCP で:
   - スクリーンショットを取得し、レイアウト崩れがないか目視確認
   - コンソールにエラーが出ていないか確認
   - 確認後 preview プロセスを停止

ブラウザツールが使えない環境では、preview への HTTP リクエスト(200 + HTML 内容のスモークチェック)に degrade し、レポートに「目視確認は未実施」と明記する。

### 4. レビュー

- package.json 差分が更新対象パッケージのみであること
- peer dependency の整合(`npm ci` の ERESOLVE で検出される。解消に追加バンプが必要な場合は最小の追加変更で対応し、PR 本文に追加理由を明記する — 例: eslint 10 に対する eslint-plugin-react-hooks 7.1.1)
- lockfile に無関係なパッケージの大規模変更が混入していないこと

### 5. マージ

- 検証・レビューがすべて通った PR のみ `gh pr merge --merge`(マージコミット方式 — リポジトリの慣習)
- 1件でも検証に失敗した PR はマージせず、失敗内容を PR コメントに記録して次の PR へ進む
- dry-run モードではここで停止し、「マージ可能」と判定した旨をレポートする

### 6. デプロイ見届け(マージごと)

- `gh run watch` で "Deploy to GitHub Pages" workflow の完走を確認
- 本番 URL(`gh api repos/{owner}/{repo}/pages` で取得)が HTTP 200 を返し、スクリーンショットで表示が正常なことを確認
- **デプロイが失敗したら以降の PR 処理を停止**し、原因調査と修正を優先する(修正がマージされ deploy が緑に戻るまで次へ進まない)

### 7. レポート(全件処理後)

- PR ごとの結果一覧: マージ済み / スキップ(理由) / 要対応
- Dependabot アラートの残数(`gh api .../dependabot/alerts` で open 件数)
- 検証で degrade した項目があれば明記

## エラー時の振る舞い

| 状況 | 対応 |
|---|---|
| 検証失敗 | その PR をスキップし、PR コメントに失敗内容を記録。他 PR の処理は続行 |
| peer dependency 矛盾 | 最小の追加バンプで解消を試み、不可なら検証失敗扱い |
| デプロイ失敗 | 全処理を停止し、原因調査・修正を最優先 |
| Dependabot ブランチへ push 不可 | 新ブランチ + 新 PR(`Closes #N`)で代替 |
| ある PR のマージで別 PR が不要化 | 不要になった PR を理由コメント付きでクローズ |

## `.claude/settings.json` への追記(任意)

permissions.allow に以下を追加(許可プロンプト削減のため。なくても動作する):

- `Bash(npm ci)`
- `Bash(npx npm@latest *)` (`npx -y npm@latest *` を含む形で調整)
- `Bash(gh run *)`

`package-lock.json` への Edit/Write deny は維持する(lockfile は常に npm 経由で再生成するため、スキルの動作と矛盾しない)。

## テスト計画

1. 実装後、オープン中の Dependabot グループ PR(#18、recreate 待ち)に対して `/dependabot-merge 18 --dry-run` を実行し、調査・検証・レビュー・レポートの内容を確認する
2. レポート内容が妥当なら `/dependabot-merge 18` で本実行し、マージ〜デプロイ見届けまで通す
3. Dependabot PR がない状態での実行(「処理対象なし」と即終了すること)も確認する

## 設計判断の記録

- **起動は手動のみ**: ユーザーの希望。PR 検知はユーザー自身が行う。定期実行は将来の拡張として残す(このスキルを呼ぶだけで足りる)。
- **major も自動マージ**: ユーザーの明示的な選択。そのリスクはフル検証(preview 目視 + デプロイ見届け)で受け止める。
- **lockfile 再生成は常に `npx npm@latest`**: ローカル npm のバージョン差で wasm 系 optional 依存が脱落し、ローカル検証が通るのに CI が落ちる事故(2026-06-11 に main のデプロイが2回停止)の再発防止。
- **マージコミット方式**: リポジトリの既存履歴の慣習に合わせる。
