# アーキテクチャ設計書

## 概要

東京・神奈川・埼玉の不動産取引価格データを国土交通省API（不動産情報ライブラリ）から収集し、エリア別の価格統計を可視化するWebアプリケーション。

## システム構成

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 不動産情報       │────▶│   apps/api      │────▶│    SQLite       │
│ ライブラリAPI    │     │   (Hono)        │     │   (Prisma)      │
│ (reinfolib)     │     └────────┬────────┘     └─────────────────┘
└─────────────────┘              │
                                 ▼
                        ┌─────────────────┐
                        │   apps/web      │
                        │   (Next.js)     │
                        └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
               ┌────────┐  ┌────────┐  ┌────────┐
               │  地図   │  │ グラフ  │  │テーブル│
               │Leaflet │  │Recharts│  │        │
               └────────┘  └────────┘  └────────┘
```

## パッケージ構成

| パッケージ | 役割 |
|-----------|------|
| `apps/api` | Hono製REST APIサーバー |
| `apps/web` | Next.js製フロントエンド |
| `packages/database` | Prisma ORM + SQLite |
| `packages/types` | 共通型定義 |
| `packages/mlit-client` | 不動産情報ライブラリAPIクライアント |

## 外部API

### 不動産情報ライブラリ（国土交通省）
- URL: https://www.reinfolib.mlit.go.jp/ex-api/external
- 認証: APIキー必須（Ocp-Apim-Subscription-Key ヘッダー）
- 申請: https://www.reinfolib.mlit.go.jp/api/request/

## データフロー

1. **データ収集**: 四半期ごとに不動産情報ライブラリAPIからデータ取得
2. **データ保存**: Propertyテーブルに物件データを保存
3. **統計計算**: PropertyStatsテーブルにエリア別統計を保存
4. **API提供**: REST APIでフロントエンドにデータ提供
5. **可視化**: テーブル・グラフ・地図で表示

## 技術スタック

- **バックエンド**: Hono, Node.js, TypeScript
- **フロントエンド**: Next.js 14 (App Router), React, Tailwind CSS
- **データベース**: SQLite (Prisma ORM)
- **可視化**: Recharts, Leaflet + react-leaflet
- **定期実行**: node-cron
- **コンテナ**: Docker, docker-compose
