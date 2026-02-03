# セットアップ手順

## 前提条件

- Node.js 20以上
- pnpm 10以上
- Docker（本番環境用）
- **不動産情報ライブラリAPIキー**（必須）

## APIキーの取得

1. https://www.reinfolib.mlit.go.jp/api/request/ にアクセス
2. 利用申請フォームに必要事項を入力
3. 審査後、メールでAPIキーが届く

## ローカル開発

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp apps/api/.env.example apps/api/.env
```

`apps/api/.env` を編集してAPIキーを設定:
```
MLIT_API_KEY=your_api_key_here
```

### 3. データベースのセットアップ

```bash
cd packages/database
pnpm exec prisma generate
pnpm exec prisma db push
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

### 5. 初回データ収集

ブラウザで http://localhost:3000 を開き、「データ収集」ボタンをクリック。
または:

```bash
curl -X POST http://localhost:3001/api/collect
```

## Docker環境

### 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集してAPIキーを設定:
```
MLIT_API_KEY=your_api_key_here
```

### ビルドと起動

```bash
docker-compose up --build
```

### 停止

```bash
docker-compose down
```

## 環境変数

### API (apps/api)

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| MLIT_API_KEY | - | 不動産情報ライブラリAPIキー（必須） |
| PORT | 3001 | APIサーバーのポート |
| DATABASE_URL | file:./dev.db | SQLiteファイルパス |
| ENABLE_SCHEDULER | true | 定期収集の有効化 |

### Web (apps/web)

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| NEXT_PUBLIC_API_URL | http://localhost:3001 | APIのURL |

## データ収集スケジュール

四半期ごと（1月、4月、7月、10月の1日 3:00）に自動実行。
国土交通省APIの更新頻度に合わせた設定。

## トラブルシューティング

### 401 Unauthorized エラー
- APIキーが正しく設定されているか確認
- APIキーの有効期限を確認

### MLIT_API_KEY is not set エラー
- `.env` ファイルが存在するか確認
- 環境変数が正しく読み込まれているか確認
