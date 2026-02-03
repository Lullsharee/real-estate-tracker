/** 都道府県コード */
export const PREFECTURE_CODES = {
  SAITAMA: '11',
  TOKYO: '13',
  KANAGAWA: '14',
} as const;

/** 対象都道府県一覧 */
export const TARGET_PREFECTURES = [
  PREFECTURE_CODES.TOKYO,
  PREFECTURE_CODES.KANAGAWA,
  PREFECTURE_CODES.SAITAMA,
] as const;

/** 国土交通省API レスポンス型 */
export interface MlitApiResponse {
  status: string;
  data: MlitPropertyData[];
}

/** 国土交通省API 物件データ型 */
export interface MlitPropertyData {
  Type: string;
  Region: string;
  MunicipalityCode: string;
  Prefecture: string;
  Municipality: string;
  DistrictName: string;
  NearestStation?: string;
  TimeToNearestStation?: string;
  TradePrice: string;
  PricePerUnit?: string;
  FloorPlan?: string;
  Area?: string;
  UnitPrice?: string;
  BuildingYear?: string;
  Structure?: string;
  Period: string;
}

/** 市区町村コードAPI レスポンス型 */
export interface MlitCityResponse {
  status: string;
  data: MlitCityData[];
}

/** 市区町村データ型 */
export interface MlitCityData {
  id: string;
  name: string;
}

// 新API（不動産情報ライブラリ）
const BASE_URL = 'https://www.reinfolib.mlit.go.jp/ex-api/external';
const RATE_LIMIT_MS = 1000;

let lastRequestTime = 0;
let apiKey: string | undefined;

/** APIキーを設定 */
export function setApiKey(key: string): void {
  apiKey = key;
}

/** APIキーを取得（環境変数からも読み込み） */
function getApiKey(): string {
  const key = apiKey ?? process.env.MLIT_API_KEY;
  if (!key) {
    throw new Error('MLIT_API_KEY is not set');
  }
  return key;
}

/** レート制限付きfetch（APIキー認証対応） */
async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();

  return fetch(url, {
    headers: {
      'Ocp-Apim-Subscription-Key': getApiKey(),
      'Accept-Encoding': 'gzip',
    },
  });
}

/** 市区町村コード一覧を取得 */
export async function getCities(
  prefectureCode: string
): Promise<MlitCityData[]> {
  const url = `${BASE_URL}/XIT002?area=${prefectureCode}`;
  const res = await rateLimitedFetch(url);
  const json = (await res.json()) as MlitCityResponse;
  return json.data ?? [];
}

/** 取引価格データを取得 */
export async function getTradeData(params: {
  prefectureCode: string;
  cityCode?: string;
  year: number;
  quarter?: number;
}): Promise<MlitPropertyData[]> {
  const searchParams = new URLSearchParams({
    year: params.year.toString(),
    area: params.prefectureCode,
  });
  if (params.quarter) {
    searchParams.set('quarter', params.quarter.toString());
  }
  if (params.cityCode) {
    searchParams.set('city', params.cityCode);
  }
  const url = `${BASE_URL}/XIT001?${searchParams}`;
  const res = await rateLimitedFetch(url);
  const json = (await res.json()) as MlitApiResponse;
  return json.data ?? [];
}

/** 四半期文字列を生成（例: 20241） */
export function getQuarterString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${year}${quarter}`;
}

/** 年と四半期を取得 */
export function getYearQuarter(date: Date = new Date()): {
  year: number;
  quarter: number;
} {
  return {
    year: date.getFullYear(),
    quarter: Math.floor(date.getMonth() / 3) + 1,
  };
}

/** 過去N四半期の範囲を取得 */
export function getQuarterRange(quartersBack: number = 4): {
  year: number;
  quarter: number;
}[] {
  const result: {year: number; quarter: number}[] = [];
  const now = new Date();
  for (let i = 0; i < quartersBack; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i * 3);
    result.push(getYearQuarter(d));
  }
  return result;
}
