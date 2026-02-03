# 不動産価格トラッカー 作業記録

最終更新: 2026-02-03 15:50

## プロジェクト概要
東京・神奈川・埼玉の不動産取引価格データを国土交通省APIから定期収集し、エリア別の価格統計（平均・中央値）を地図・グラフ・テーブルで可視化するWebアプリ

## 技術スタック
- Backend: Hono (ポート3001)
- Frontend: Next.js (ポート3000)
- DB: SQLite (Prisma)
- 可視化: Leaflet, Recharts
- テスト: Vitest（古典派スタイル）

## 完了済み
1. プロジェクト基盤セットアップ (apps/api, apps/web, packages/*)
2. 国土交通省APIクライアント実装 (packages/mlit-client) - **新API対応済み**
3. データ収集・保存機能 (apps/api/src/services/collector.ts)
4. 統計計算機能 (apps/api/src/services/stats.ts)
5. REST APIエンドポイント実装 - **型付け追加**
6. フロントエンドコンポーネント (テーブル、グラフ、地図、フィルタ)
7. 定期実行スケジューラ (node-cron、四半期ごと)
8. Docker化
9. 仕様書作成 (docs/)
10. テストデータ投入・API動作確認済み
11. **テストコード追加（古典派）** - 29テスト

## テスト実行
```bash
pnpm test
```

## 国土交通省API（不動産情報ライブラリ）

### ⚠️ 重要: APIが変更されました
旧API（www.land.mlit.go.jp）は廃止され、新API（www.reinfolib.mlit.go.jp）に移行

### 新APIエンドポイント
- ベースURL: `https://www.reinfolib.mlit.go.jp/ex-api/external`
- 取引価格: `/XIT001`
- 市区町村一覧: `/XIT002`

### 認証
- **APIキー必須**: https://www.reinfolib.mlit.go.jp/api/request/ から申請
- ヘッダー: `Ocp-Apim-Subscription-Key: {APIキー}`

### パラメータ（取引価格 XIT001）
| パラメータ | 内容 | 必須 |
|-----------|------|------|
| year | 取引時期（年）YYYY | ○ |
| quarter | 取引時期（四半期）1-4 | |
| area | 都道府県コード | |
| city | 市区町村コード（5桁） | |

### 都道府県コード
- 東京都: 13
- 神奈川県: 14
- 埼玉県: 11

### レスポンス形式
```json
{
  "status": "OK",
  "data": [
    {
      "Type": "宅地(土地と建物)",
      "Prefecture": "東京都",
      "Municipality": "渋谷区",
      "TradePrice": "50000000",
      "Area": "100",
      "Period": "2023年第4四半期"
    }
  ]
}
```

### 公式ドキュメント
- API操作説明: https://www.reinfolib.mlit.go.jp/help/apiManual/
- API利用申請: https://www.reinfolib.mlit.go.jp/api/request/

## 環境変数設定

### .envファイル作成
```bash
cp .env.example .env
# MLIT_API_KEYを設定
```

### 必要な環境変数
| 変数名 | 説明 | 必須 |
|--------|------|------|
| MLIT_API_KEY | 不動産情報ライブラリAPIキー | ○ |
| DATABASE_URL | DB接続URL | |
| PORT | APIサーバーポート | |

## 起動コマンド
```bash
cd /Users/amu-nsato-mbp24/personal/real-estate-tracker

# 依存関係インストール
pnpm install

# .env設定
cp apps/api/.env.example apps/api/.env
# MLIT_API_KEYを編集

# 開発サーバー起動
pnpm dev
```

## Docker起動
```bash
# .envファイルにMLIT_API_KEYを設定
cp .env.example .env

docker-compose up
```

## 次のステップ
1. APIキー申請: https://www.reinfolib.mlit.go.jp/api/request/
2. .envファイルにAPIキー設定
3. `pnpm dev` で動作確認
4. `POST /api/collect` で実データ収集テスト
