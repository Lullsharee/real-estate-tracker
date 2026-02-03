/** 中央値を計算 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** 平均値を計算 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export interface PropertyForStats {
  period: string;
  prefecture: string;
  municipality: string;
  tradePrice: number;
  tradePricePerTsubo: number | null;
}

export interface StatsGroup {
  period: string;
  prefecture: string;
  municipality: string;
  averagePrice: number;
  medianPrice: number;
  averagePricePerTsubo: number;
  medianPricePerTsubo: number;
  count: number;
}

/** 物件データをグループ化して統計を計算 */
export function calculateStatsFromProperties(
  properties: PropertyForStats[]
): StatsGroup[] {
  const groups = new Map<
    string,
    {prices: number[]; tsuboPrices: number[]; period: string; pref: string; muni: string}
  >();

  for (const p of properties) {
    const key = `${p.period}|${p.prefecture}|${p.municipality}`;
    if (!groups.has(key)) {
      groups.set(key, {
        prices: [],
        tsuboPrices: [],
        period: p.period,
        pref: p.prefecture,
        muni: p.municipality,
      });
    }
    const g = groups.get(key)!;
    g.prices.push(p.tradePrice);
    if (p.tradePricePerTsubo) g.tsuboPrices.push(p.tradePricePerTsubo);
  }

  const result: StatsGroup[] = [];
  for (const g of groups.values()) {
    if (g.prices.length === 0) continue;
    result.push({
      period: g.period,
      prefecture: g.pref,
      municipality: g.muni,
      averagePrice: average(g.prices),
      medianPrice: median(g.prices),
      averagePricePerTsubo: average(g.tsuboPrices),
      medianPricePerTsubo: median(g.tsuboPrices),
      count: g.prices.length,
    });
  }
  return result;
}
