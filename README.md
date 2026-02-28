# NextMsg AI

最適化されたコミュニケーションを、一瞬で。

チャットメッセージを相手との関係性に合わせて最適化するAIアプリケーションです。

## 機能

- **New Message**: 新規メッセージを作成
- **Reply**: 受信したメッセージに返信
- **3つのトーン**: Soft(丁寧)、Standard(自然)、Short(簡潔)の3パターンで提案

## 技術スタック

- **フロントエンド**: React 19 + Vite + Tailwind CSS
- **バックエンド**: Vercel Serverless Functions
- **AI**: Google Gemini 1.5 Pro

## ローカル開発

### 前提条件

- Node.js 18以上
- Google AI Studio APIキー

### セットアップ

1. リポジトリをクローン

```bash
git clone <repository-url>
cd email-think
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数を設定

`.env`ファイルを作成し、APIキーを設定:

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Google AI Studio APIキーは[こちら](https://aistudio.google.com/app/apikey)から取得できます。

4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

**注意**: ローカル開発では、Vercel Serverless Functionsは動作しません。ローカルでAPIをテストするには、Vercel CLIを使用してください:

```bash
npm install -g vercel
vercel dev
```

## Vercelへのデプロイ

### 1. Vercel CLIでデプロイ

```bash
npm install -g vercel
vercel
```

### 2. Vercelダッシュボードで環境変数を設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. Settings > Environment Variables
4. 以下の環境変数を追加:
   - `GEMINI_API_KEY`: Google AI Studio APIキー

### 3. デプロイ完了

環境変数を設定後、再デプロイすると本番環境で動作します。

## プロジェクト構成

```
email-think/
├── api/                    # Vercel Serverless Functions
│   └── rewrite.ts         # メッセージリライトAPI
├── src/
│   ├── components/        # Reactコンポーネント
│   ├── services/          # APIクライアント
│   ├── types.ts           # TypeScript型定義
│   └── App.tsx            # メインアプリ
├── .env.example           # 環境変数のサンプル
├── vercel.json            # Vercel設定
└── package.json
```

## セキュリティ

- APIキーはサーバーサイド(Vercel Serverless Functions)でのみ使用されます
- クライアントサイドにAPIキーは露出しません
- `.env`ファイルは`.gitignore`に含まれており、Gitにコミットされません

## トラブルシューティング

### APIエラーが発生する

- Vercelダッシュボードで`GEMINI_API_KEY`が正しく設定されているか確認
- APIキーが有効か確認([Google AI Studio](https://aistudio.google.com/app/apikey)で確認)

### ローカルでAPIが動作しない

- `vercel dev`を使用してローカルでServerless Functionsをテスト
- `.env`ファイルが正しく設定されているか確認

## ライセンス

MIT
