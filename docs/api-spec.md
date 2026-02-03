# API仕様書

## Base URL

- 開発: `http://localhost:3001`
- 本番: 環境変数 `API_URL` で設定

## エンドポイント

### ヘルスチェック

```
GET /health
```

**レスポンス**
```json
{"status": "ok"}
```

---

### データ収集実行

```
POST /api/collect
```

国土交通省APIからデータを収集し、統計を計算する。

**レスポンス**
```json
{"success": true, "collected": 1234}
```

---

### 統計データ取得

```
GET /api/stats
```

**クエリパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| prefecture | string | 都道府県名でフィルタ |
| municipality | string | 市区町村名でフィルタ |

**レスポンス**
```json
[
  {
    "id": "xxx",
    "period": "20241",
    "prefecture": "東京都",
    "municipality": "渋谷区",
    "districtName": "",
    "averagePrice": 50000000,
    "medianPrice": 45000000,
    "averagePricePerTsubo": 1500000,
    "medianPricePerTsubo": 1400000,
    "count": 150
  }
]
```

---

### 時系列データ取得

```
GET /api/stats/history
```

**クエリパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| prefecture | string | 都道府県名でフィルタ |
| municipality | string | 市区町村名でフィルタ |

**レスポンス**: 統計データ取得と同形式（期間順にソート）

---

### 物件一覧取得

```
GET /api/properties
```

**クエリパラメータ**
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| prefecture | string | - | 都道府県名でフィルタ |
| municipality | string | - | 市区町村名でフィルタ |
| limit | number | 100 | 取得件数 |
| offset | number | 0 | オフセット |

**レスポンス**
```json
{
  "data": [...],
  "total": 5000,
  "limit": 100,
  "offset": 0
}
```

---

### 都道府県一覧

```
GET /api/prefectures
```

**レスポンス**
```json
["東京都", "神奈川県", "埼玉県"]
```

---

### 市区町村一覧

```
GET /api/municipalities
```

**クエリパラメータ**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| prefecture | string | 都道府県名でフィルタ |

**レスポンス**
```json
[
  {"municipality": "渋谷区", "prefecture": "東京都"},
  {"municipality": "新宿区", "prefecture": "東京都"}
]
```
