# 不動産価格トラッカー

東京・神奈川・埼玉の不動産取引価格を可視化するWebアプリケーション。

## 機能

- 📊 **テーブル表示**: エリア別の価格統計（平均・中央値）
- 📈 **グラフ表示**: 価格推移・市区町村別比較
- 🗺️ **地図表示**: エリア別価格のヒートマップ
- 🔄 **定期収集**: 四半期ごとに自動データ更新

## データソース

[国土交通省 不動産取引価格情報API](https://www.land.mlit.go.jp/webland/api.html)

出典: 国土交通省ウェブサイト

## クイックスタート

```bash
# 依存関係インストール
pnpm install

# DB初期化
cd packages/database && pnpm exec prisma db push && cd ../..

# 開発サーバー起動
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

## Docker

```bash
docker-compose up --build
```

## ドキュメント

- [アーキテクチャ](docs/architecture.md)
- [API仕様](docs/api-spec.md)
- [セットアップ](docs/setup.md)

## 技術スタック

- **Backend**: Hono, Node.js, Prisma, SQLite
- **Frontend**: Next.js, React, Tailwind CSS, Recharts, Leaflet

## ライセンス

MIT
