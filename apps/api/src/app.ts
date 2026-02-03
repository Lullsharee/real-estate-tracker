import 'dotenv/config';
import {Hono} from 'hono';
import {cors} from 'hono/cors';
import {prisma} from '@real-estate-tracker/database';
import {collectData} from './services/collector.js';
import {calculateStats} from './services/stats.js';
import type {
  HealthResponse,
  CollectResponse,
  PropertyStats,
  PropertiesResponse,
  MunicipalityItem,
} from '@real-estate-tracker/types';

const app = new Hono();

app.use('/*', cors());

app.get('/health', (c) => c.json<HealthResponse>({status: 'ok'}));

app.post('/api/collect', async (c) => {
  const result = await collectData();
  await calculateStats();
  return c.json<CollectResponse>({success: true, collected: result.count});
});

app.get('/api/stats', async (c) => {
  const prefecture = c.req.query('prefecture');
  const municipality = c.req.query('municipality');

  const where: Record<string, string> = {};
  if (prefecture) where.prefecture = prefecture;
  if (municipality) where.municipality = municipality;

  const stats = await prisma.propertyStats.findMany({
    where,
    orderBy: [{prefecture: 'asc'}, {municipality: 'asc'}, {period: 'desc'}],
  });
  return c.json<PropertyStats[]>(stats);
});

app.get('/api/stats/history', async (c) => {
  const prefecture = c.req.query('prefecture');
  const municipality = c.req.query('municipality');

  const where: Record<string, string> = {districtName: ''};
  if (prefecture) where.prefecture = prefecture;
  if (municipality) where.municipality = municipality;

  const stats = await prisma.propertyStats.findMany({
    where,
    orderBy: {period: 'asc'},
    select: {
      period: true,
      prefecture: true,
      municipality: true,
      averagePrice: true,
      medianPrice: true,
      averagePricePerTsubo: true,
      medianPricePerTsubo: true,
      count: true,
    },
  });
  return c.json(stats);
});

app.get('/api/properties', async (c) => {
  const prefecture = c.req.query('prefecture');
  const municipality = c.req.query('municipality');
  const limit = parseInt(c.req.query('limit') ?? '100', 10);
  const offset = parseInt(c.req.query('offset') ?? '0', 10);

  const where: Record<string, string> = {};
  if (prefecture) where.prefecture = prefecture;
  if (municipality) where.municipality = municipality;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {createdAt: 'desc'},
    }),
    prisma.property.count({where}),
  ]);
  return c.json<PropertiesResponse>({data: properties, total, limit, offset});
});

app.get('/api/prefectures', async (c) => {
  const prefectures = await prisma.property.findMany({
    distinct: ['prefecture'],
    select: {prefecture: true},
  });
  return c.json<string[]>(prefectures.map((p) => p.prefecture));
});

app.get('/api/municipalities', async (c) => {
  const prefecture = c.req.query('prefecture');
  const where = prefecture ? {prefecture} : {};
  const municipalities = await prisma.property.findMany({
    where,
    distinct: ['municipality'],
    select: {municipality: true, prefecture: true},
  });
  return c.json<MunicipalityItem[]>(municipalities);
});

export default app;
