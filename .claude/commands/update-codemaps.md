# Update Codemaps

コードベース構造を分析し、アーキテクチャドキュメントを更新:

1. すべてのソースファイルをスキャンし、imports、exports、依存関係を取得
2. 以下のフォーマットでトークン効率の良いcodemapを生成:
   - codemaps/architecture.md - 全体アーキテクチャ
   - codemaps/backend.md - バックエンド構造
   - codemaps/frontend.md - フロントエンド構造
   - codemaps/data.md - データモデルとスキーマ

3. 前のバージョンからの差分パーセンテージを計算
4. 変更が30%を超える場合、更新前にユーザー承認を要求
5. 各codemapに新鮮度タイムスタンプを追加
6. レポートを.reports/codemap-diff.txtに保存

分析にはTypeScript/Node.jsを使用。実装の詳細ではなく、高レベルの構造に焦点を当てる。
