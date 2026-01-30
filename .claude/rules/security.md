# セキュリティガイドライン

## 必須セキュリティチェック

コミット前に必ず確認:
- [ ] ハードコードされたシークレットがない（API キー、パスワード、トークン）
- [ ] すべてのユーザー入力がバリデーションされている
- [ ] SQLインジェクション対策（パラメータ化クエリ）
- [ ] XSS対策（HTMLのサニタイズ）
- [ ] CSRF保護が有効
- [ ] 認証・認可が確認済み
- [ ] 全エンドポイントにレート制限
- [ ] エラーメッセージが機密データを漏洩しない

## シークレット管理

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

## セキュリティ対応プロトコル

セキュリティ問題が見つかった場合:
1. 即座に作業を停止
2. **security-reviewer** エージェントを使用
3. CRITICAL な問題を先に修正
4. 漏洩したシークレットをローテーション
5. コードベース全体で同様の問題をレビュー
