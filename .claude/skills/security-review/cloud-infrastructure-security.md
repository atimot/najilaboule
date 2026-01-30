| name | description |
|------|-------------|
| cloud-infrastructure-security | Use this skill when deploying to cloud platforms, configuring infrastructure, managing IAM policies, setting up logging/monitoring, or implementing CI/CD pipelines. Provides cloud security checklist aligned with best practices. |

# クラウド＆インフラセキュリティスキル

このスキルは、クラウドインフラ、CI/CDパイプライン、デプロイ設定がセキュリティベストプラクティスに従い、業界標準に準拠していることを確認する。

## 有効化するタイミング

- クラウドプラットフォーム（AWS、Vercel、Railway、Cloudflare）へのアプリケーションデプロイ時
- IAMロールと権限の設定時
- CI/CDパイプラインのセットアップ時
- Infrastructure as Code（Terraform、CloudFormation）の実装時
- ロギングとモニタリングの設定時
- クラウド環境でのシークレット管理時
- CDNとエッジセキュリティのセットアップ時
- 災害復旧とバックアップ戦略の実装時

## クラウドセキュリティチェックリスト

### 1. IAMとアクセス制御

#### 最小権限の原則

```yaml
# ✅ CORRECT: Minimal permissions
iam_role:
  permissions:
    - s3:GetObject  # Only read access
    - s3:ListBucket
  resources:
    - arn:aws:s3:::my-bucket/*  # Specific bucket only

# ❌ WRONG: Overly broad permissions
iam_role:
  permissions:
    - s3:*  # All S3 actions
  resources:
    - "*"  # All resources
```

#### 多要素認証（MFA）

```bash
# ALWAYS enable MFA for root/admin accounts
aws iam enable-mfa-device \
  --user-name admin \
  --serial-number arn:aws:iam::123456789:mfa/admin \
  --authentication-code1 123456 \
  --authentication-code2 789012
```

#### 検証ステップ

- [ ] 本番でrootアカウントを使用していない
- [ ] すべての特権アカウントでMFAが有効
- [ ] サービスアカウントはロールを使用（長期クレデンシャルではない）
- [ ] IAMポリシーが最小権限に従っている
- [ ] 定期的なアクセスレビューを実施
- [ ] 未使用のクレデンシャルをローテーションまたは削除

### 2. シークレット管理

#### クラウドシークレットマネージャー

```typescript
// ✅ CORRECT: Use cloud secrets manager
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'prod/api-key' });
const apiKey = JSON.parse(secret.SecretString).key;

// ❌ WRONG: Hardcoded or in environment variables only
const apiKey = process.env.API_KEY; // Not rotated, not audited
```

#### シークレットローテーション

```bash
# Set up automatic rotation for database credentials
aws secretsmanager rotate-secret \
  --secret-id prod/db-password \
  --rotation-lambda-arn arn:aws:lambda:region:account:function:rotate \
  --rotation-rules AutomaticallyAfterDays=30
```

#### 検証ステップ

- [ ] すべてのシークレットがクラウドシークレットマネージャー（AWS Secrets Manager、Vercel Secrets）に保存
- [ ] データベースクレデンシャルの自動ローテーションが有効
- [ ] APIキーが少なくとも四半期ごとにローテーション
- [ ] コード、ログ、エラーメッセージにシークレットがない
- [ ] シークレットアクセスの監査ログが有効

### 3. ネットワークセキュリティ

#### VPCとファイアウォール設定

```terraform
# ✅ CORRECT: Restricted security group
resource "aws_security_group" "app" {
  name = "app-sg"
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # Internal VPC only
  }
  
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Only HTTPS outbound
  }
}

# ❌ WRONG: Open to the internet
resource "aws_security_group" "bad" {
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # All ports, all IPs!
  }
}
```

#### 検証ステップ

- [ ] データベースが公開アクセス可能でない
- [ ] SSH/RDPポートがVPN/bastionのみに制限
- [ ] セキュリティグループが最小権限に従っている
- [ ] ネットワークACLが設定されている
- [ ] VPCフローログが有効

### 4. ロギングとモニタリング

#### CloudWatch/ロギング設定

```typescript
// ✅ CORRECT: Comprehensive logging
import { CloudWatchLogsClient, CreateLogStreamCommand } from '@aws-sdk/client-cloudwatch-logs';

const logSecurityEvent = async (event: SecurityEvent) => {
  await cloudwatch.putLogEvents({
    logGroupName: '/aws/security/events',
    logStreamName: 'authentication',
    logEvents: [{
      timestamp: Date.now(),
      message: JSON.stringify({
        type: event.type,
        userId: event.userId,
        ip: event.ip,
        result: event.result,
        // Never log sensitive data
      })
    }]
  });
};
```

#### 検証ステップ

- [ ] すべてのサービスでCloudWatch/ロギングが有効
- [ ] 認証失敗がログに記録
- [ ] 管理者アクションが監査されている
- [ ] ログ保持が設定されている（コンプライアンスのため90日以上）
- [ ] 不審なアクティビティのアラートが設定されている
- [ ] ログが集中管理され、改ざん防止されている

### 5. CI/CDパイプラインセキュリティ

#### セキュアなパイプライン設定

```yaml
# ✅ CORRECT: Secure GitHub Actions workflow
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read  # Minimal permissions
      
    steps:
      - uses: actions/checkout@v4
      
      # Scan for secrets
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
        
      # Dependency audit
      - name: Audit dependencies
        run: npm audit --audit-level=high
        
      # Use OIDC, not long-lived tokens
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1
```

#### サプライチェーンセキュリティ

```json
// package.json - Use lock files and integrity checks
{
  "scripts": {
    "install": "npm ci",  // Use ci for reproducible builds
    "audit": "npm audit --audit-level=moderate",
    "check": "npm outdated"
  }
}
```

#### 検証ステップ

- [ ] 長期クレデンシャルの代わりにOIDCを使用
- [ ] パイプラインでシークレットスキャン
- [ ] 依存関係の脆弱性スキャン
- [ ] コンテナイメージスキャン（該当する場合）
- [ ] ブランチ保護ルールが強制されている
- [ ] マージ前にコードレビューが必要
- [ ] 署名付きコミットが強制されている

### 6. CloudflareとCDNセキュリティ

#### Cloudflareセキュリティ設定

```typescript
// ✅ CORRECT: Cloudflare Workers with security headers
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request);
    
    // Add security headers
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
```

#### WAFルール

```bash
# Enable Cloudflare WAF managed rules
# - OWASP Core Ruleset
# - Cloudflare Managed Ruleset
# - Rate limiting rules
# - Bot protection
```

#### 検証ステップ

- [ ] OWASPルールでWAFが有効
- [ ] レート制限が設定されている
- [ ] ボット保護がアクティブ
- [ ] DDoS保護が有効
- [ ] セキュリティヘッダーが設定されている
- [ ] SSL/TLSストリクトモードが有効

### 7. バックアップと災害復旧

#### 自動バックアップ

```terraform
# ✅ CORRECT: Automated RDS backups
resource "aws_db_instance" "main" {
  allocated_storage     = 20
  engine               = "postgres"
  
  backup_retention_period = 30  # 30 days retention
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  deletion_protection = true  # Prevent accidental deletion
}
```

#### 検証ステップ

- [ ] 自動日次バックアップが設定されている
- [ ] バックアップ保持がコンプライアンス要件を満たしている
- [ ] ポイントインタイムリカバリが有効
- [ ] バックアップテストが四半期ごとに実施されている
- [ ] 災害復旧計画が文書化されている
- [ ] RPOとRTOが定義・テストされている

## デプロイ前クラウドセキュリティチェックリスト

本番クラウドデプロイの前に必ず:

- [ ] **IAM**: rootアカウント不使用、MFA有効、最小権限ポリシー
- [ ] **シークレット**: すべてのシークレットがローテーション付きでクラウドシークレットマネージャーに
- [ ] **ネットワーク**: セキュリティグループが制限、公開データベースなし
- [ ] **ロギング**: 保持付きでCloudWatch/ロギングが有効
- [ ] **モニタリング**: 異常のアラートが設定されている
- [ ] **CI/CD**: OIDC認証、シークレットスキャン、依存関係監査
- [ ] **CDN/WAF**: OWASPルールでCloudflare WAFが有効
- [ ] **暗号化**: 保存時と転送時にデータが暗号化されている
- [ ] **バックアップ**: テスト済みリカバリ付きの自動バックアップ
- [ ] **コンプライアンス**: GDPR/HIPAA要件を満たしている（該当する場合）
- [ ] **ドキュメント**: インフラが文書化され、ランブックが作成されている
- [ ] **インシデント対応**: セキュリティインシデント計画が整備されている

## よくあるクラウドセキュリティ設定ミス

### S3バケットの露出

```bash
# ❌ WRONG: Public bucket
aws s3api put-bucket-acl --bucket my-bucket --acl public-read

# ✅ CORRECT: Private bucket with specific access
aws s3api put-bucket-acl --bucket my-bucket --acl private
aws s3api put-bucket-policy --bucket my-bucket --policy file://policy.json
```

### RDSパブリックアクセス

```terraform
# ❌ WRONG
resource "aws_db_instance" "bad" {
  publicly_accessible = true  # NEVER do this!
}

# ✅ CORRECT
resource "aws_db_instance" "good" {
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.db.id]
}
```

## リソース

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [CIS AWS Foundations Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)
- [Cloudflare Security Documentation](https://developers.cloudflare.com/security/)
- [OWASP Cloud Security](https://owasp.org/www-project-cloud-security/)
- [Terraform Security Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/)

**注意**: クラウドの設定ミスはデータ漏洩の主要な原因。1つの公開されたS3バケットや過度に許容的なIAMポリシーがインフラ全体を危険にさらす可能性がある。常に最小権限の原則と多層防御に従うこと。
