import {prisma} from '@real-estate-tracker/database';
import {median, average, calculateStatsFromProperties} from './statsUtils.js';

export {median, average};

/** エリア別統計を計算してDBに保存 */
export async function calculateStats(): Promise<{count: number}> {
  const properties = await prisma.property.findMany({
    select: {
      period: true,
      prefecture: true,
      municipality: true,
      districtName: true,
      tradePrice: true,
      tradePricePerTsubo: true,
    },
  });

  const statsGroups = calculateStatsFromProperties(properties);

  let count = 0;
  for (const g of statsGroups) {
    await prisma.propertyStats.upsert({
      where: {
        period_prefecture_municipality_districtName: {
          period: g.period,
          prefecture: g.prefecture,
          municipality: g.municipality,
          districtName: '',
        },
      },
      create: {
        period: g.period,
        prefecture: g.prefecture,
        municipality: g.municipality,
        districtName: '',
        averagePrice: g.averagePrice,
        medianPrice: g.medianPrice,
        averagePricePerTsubo: g.averagePricePerTsubo,
        medianPricePerTsubo: g.medianPricePerTsubo,
        count: g.count,
      },
      update: {
        averagePrice: g.averagePrice,
        medianPrice: g.medianPrice,
        averagePricePerTsubo: g.averagePricePerTsubo,
        medianPricePerTsubo: g.medianPricePerTsubo,
        count: g.count,
      },
    });
    count++;
  }

  return {count};
}
