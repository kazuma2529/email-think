# Vercelへのデプロイガイド

このガイドでは、NextMsg AIをVercelにデプロイする手順を説明します。

## 前提条件

- [Vercelアカウント](https://vercel.com/signup)
- [Google AI Studio APIキー](https://aistudio.google.com/app/apikey)
- Git リポジトリ(GitHub、GitLab、Bitbucket)

## デプロイ手順

### 方法1: Vercel Dashboard経由(推奨)

#### ステップ1: GitHubにプッシュ

```bash
git add .
git commit -m "Vercel deployment ready"
git push origin main
```

#### ステップ2: Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New..." > "Project"をクリック
3. GitHubリポジトリを選択
4. "Import"をクリック

#### ステップ3: プロジェクト設定

- **Framework Preset**: Vite(自動検出されます)
- **Build Command**: `npm run build`(デフォルト)
- **Output Directory**: `dist`(デフォルト)

#### ステップ4: 環境変数を設定

"Environment Variables"セクションで以下を追加:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | あなたのGoogle AI Studio APIキー |

**重要**: APIキーは[Google AI Studio](https://aistudio.google.com/app/apikey)から取得してください。

#### ステップ5: デプロイ

"Deploy"ボタンをクリックして、デプロイを開始します。

数分後、デプロイが完了し、本番URLが発行されます。

---

### 方法2: Vercel CLI経由

#### ステップ1: Vercel CLIをインストール

```bash
npm install -g vercel
```

#### ステップ2: ログイン

```bash
vercel login
```

#### ステップ3: デプロイ

```bash
vercel
```

プロンプトに従って設定を進めます。

#### ステップ4: 環境変数を設定

```bash
vercel env add GEMINI_API_KEY
```

プロンプトでAPIキーを入力し、"Production"を選択します。

#### ステップ5: 本番デプロイ

```bash
vercel --prod
```

---

## デプロイ後の確認

### 1. アプリケーションが正常に動作するか確認

デプロイされたURLにアクセスして、以下を確認:

- ✅ ページが正常に表示される
- ✅ New Message/Replyモードが切り替わる
- ✅ メッセージを入力してリライトが実行される
- ✅ 3つのトーン(Soft, Standard, Short)が表示される

### 2. APIが正常に動作するか確認

ブラウザの開発者ツール(F12)を開き、Network タブで以下を確認:

- ✅ `/api/rewrite`へのPOSTリクエストが成功(200 OK)
- ✅ レスポンスにリライト結果が含まれている

### 3. エラーが発生した場合

#### エラー: "GEMINI_API_KEY is not configured"

**原因**: 環境変数が設定されていない

**解決策**:
1. Vercel Dashboard > Settings > Environment Variables
2. `GEMINI_API_KEY`を追加
3. Deployments > ... > Redeploy

#### エラー: "Failed to rewrite message: 500"

**原因**: APIキーが無効、またはGemini APIのエラー

**解決策**:
1. [Google AI Studio](https://aistudio.google.com/app/apikey)でAPIキーを確認
2. APIキーが有効か確認
3. Vercelの環境変数を更新
4. 再デプロイ

#### エラー: "Failed to fetch"

**原因**: CORS エラー、またはネットワークエラー

**解決策**:
- ブラウザのコンソールでエラーメッセージを確認
- Vercelのログを確認(Dashboard > Deployments > Function Logs)

---

## ローカルでのテスト(Vercel Dev)

本番環境と同じ環境でローカルテストするには:

```bash
vercel dev
```

これにより、Vercel Serverless Functionsがローカルで動作します。

`.env`ファイルに環境変数を設定:

```bash
GEMINI_API_KEY=your_api_key_here
```

ブラウザで `http://localhost:3000` を開いてテストします。

---

## カスタムドメインの設定(オプション)

### ステップ1: ドメインを追加

1. Vercel Dashboard > Settings > Domains
2. "Add Domain"をクリック
3. ドメイン名を入力(例: `nextmsg.example.com`)

### ステップ2: DNSレコードを設定

Vercelが提供するDNSレコードを、ドメインレジストラで設定します。

### ステップ3: SSL証明書

Vercelが自動的にSSL証明書を発行します(Let's Encrypt)。

---

## トラブルシューティング

### ビルドエラー

```bash
npm run build
```

をローカルで実行して、ビルドエラーを確認します。

### Vercelログの確認

1. Vercel Dashboard > Deployments
2. 該当するデプロイメントをクリック
3. "Function Logs"タブでログを確認

### 環境変数の確認

```bash
vercel env ls
```

で環境変数が正しく設定されているか確認します。

---

## セキュリティのベストプラクティス

✅ **APIキーはサーバーサイドでのみ使用**
- `api/rewrite.ts`でのみAPIキーを使用
- クライアントサイドには露出しない

✅ **環境変数は`.env`に保存**
- `.gitignore`に`.env`を追加
- Gitにコミットしない

✅ **HTTPS通信**
- Vercelは自動的にHTTPSを有効化

✅ **CORS設定**
- `api/rewrite.ts`でCORSヘッダーを設定済み

---

## 更新とデプロイ

### 自動デプロイ

GitHubにプッシュすると、Vercelが自動的にデプロイします:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### 手動デプロイ

```bash
vercel --prod
```

---

## サポート

問題が発生した場合:

1. [Vercelドキュメント](https://vercel.com/docs)を確認
2. [Google AI Studioドキュメント](https://ai.google.dev/docs)を確認
3. Vercelのログを確認

---

## まとめ

✅ Vercel Serverless Functionsを使用してAPIキーを安全に管理
✅ Google AI Studio APIキーはVercelでも使用可能
✅ 環境変数を設定して本番デプロイ
✅ 自動デプロイでCI/CDを実現

これで、NextMsg AIが安全にVercelにデプロイされました!
