import {prisma} from '@real-estate-tracker/database';
import {
  getTradeData,
  getQuarterRange,
  TARGET_PREFECTURES,
  type MlitPropertyData,
} from '@real-estate-tracker/mlit-client';

/** MLIT APIデータをDBに保存 */
export async function collectData(): Promise<{count: number}> {
  const quarters = getQuarterRange(4);
  let totalCount = 0;

  for (const prefCode of TARGET_PREFECTURES) {
    for (const {year, quarter} of quarters) {
      try {
        const data = await getTradeData({
          prefectureCode: prefCode,
          year,
          quarter,
        });
        const properties = data
          .filter((d) => d.TradePrice && d.Area)
          .map((d) => toPropertyInput(d));

        for (const prop of properties) {
          try {
            await prisma.property.create({data: prop});
            totalCount++;
          } catch {
            // 重複エラーは無視
          }
        }
      } catch (err) {
        console.error(
          `[Collector] Error fetching data for ${prefCode} ${year}Q${quarter}:`,
          err
        );
      }
    }
  }

  return {count: totalCount};
}

function toPropertyInput(d: MlitPropertyData) {
  const tradePrice = parseInt(d.TradePrice, 10) || 0;
  const area = parseFloat(d.Area ?? '0') || 0;
  const tsubo = area / 3.30579;
  return {
    type: d.Type,
    region: d.Region,
    municipalityCode: d.MunicipalityCode,
    prefecture: d.Prefecture,
    municipality: d.Municipality,
    districtName: d.DistrictName ?? '',
    nearestStation: d.NearestStation,
    timeToNearestStation: d.TimeToNearestStation,
    tradePrice,
    pricePerUnit: d.PricePerUnit ? parseInt(d.PricePerUnit, 10) : null,
    floorPlan: d.FloorPlan,
    area,
    unitPrice: d.UnitPrice ? parseInt(d.UnitPrice, 10) : null,
    buildingYear: d.BuildingYear,
    structure: d.Structure,
    period: d.Period,
    tradePricePerTsubo: tsubo > 0 ? Math.round(tradePrice / tsubo) : null,
  };
}
