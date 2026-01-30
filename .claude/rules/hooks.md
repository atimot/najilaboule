# Hooks システム

## Hook の種類

- **PreToolUse**: ツール実行前（バリデーション、パラメータ変更）
- **PostToolUse**: ツール実行後（自動フォーマット、チェック）
- **Stop**: セッション終了時（最終検証）

## 現在の Hooks（~/.claude/settings.json 内）

### PreToolUse
- **tmux reminder**: 長時間コマンド（npm, pnpm, yarn, cargo など）に tmux を提案
- **git push review**: プッシュ前に Zed でレビューを開く
- **doc blocker**: 不要な .md/.txt ファイルの作成をブロック

### PostToolUse
- **PR creation**: PR URL と GitHub Actions ステータスをログ
- **Prettier**: 編集後に JS/TS ファイルを自動フォーマット
- **TypeScript check**: .ts/.tsx 編集後に tsc を実行
- **console.log warning**: 編集ファイル内の console.log を警告

### Stop
- **console.log audit**: セッション終了前に全変更ファイルの console.log をチェック

## 自動承認権限

慎重に使用:
- 信頼できる、明確に定義された計画の場合に有効化
- 探索的な作業では無効化
- dangerously-skip-permissions フラグは絶対に使用しない
- 代わりに `~/.claude.json` で `allowedTools` を設定

## TodoWrite のベストプラクティス

TodoWrite ツールの活用:
- 複数ステップタスクの進捗追跡
- 指示の理解を確認
- リアルタイムでの方向修正を可能に
- 詳細な実装ステップを表示

Todo リストで判明すること:
- 順序が間違っているステップ
- 欠落している項目
- 不要な追加項目
- 粒度の問題
- 要件の誤解
