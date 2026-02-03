import {describe, it, expect} from 'vitest';
import {median, average, calculateStatsFromProperties} from '../services/statsUtils.js';

describe('median', () => {
  it('returns 0 for empty array', () => {
    expect(median([])).toBe(0);
  });

  it('returns single value for array with one element', () => {
    expect(median([5])).toBe(5);
  });

  it('returns middle value for odd-length array', () => {
    expect(median([1, 3, 5])).toBe(3);
  });

  it('returns average of two middle values for even-length array', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('handles unsorted input', () => {
    expect(median([5, 1, 3])).toBe(3);
  });

  it('does not mutate original array', () => {
    const arr = [3, 1, 2];
    median(arr);
    expect(arr).toEqual([3, 1, 2]);
  });
});

describe('average', () => {
  it('returns 0 for empty array', () => {
    expect(average([])).toBe(0);
  });

  it('returns single value for array with one element', () => {
    expect(average([10])).toBe(10);
  });

  it('calculates correct average', () => {
    expect(average([10, 20, 30])).toBe(20);
  });

  it('handles decimal results', () => {
    expect(average([1, 2])).toBe(1.5);
  });
});

describe('calculateStatsFromProperties', () => {
  it('returns empty array for empty input', () => {
    expect(calculateStatsFromProperties([])).toEqual([]);
  });

  it('groups by period, prefecture, municipality', () => {
    const properties = [
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 100, tradePricePerTsubo: 10},
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 200, tradePricePerTsubo: 20},
      {period: '20241', prefecture: '東京都', municipality: '新宿区', tradePrice: 300, tradePricePerTsubo: 30},
    ];

    const result = calculateStatsFromProperties(properties);
    expect(result).toHaveLength(2);
  });

  it('calculates correct statistics for a group', () => {
    const properties = [
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 100, tradePricePerTsubo: 10},
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 200, tradePricePerTsubo: 20},
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 300, tradePricePerTsubo: 30},
    ];

    const result = calculateStatsFromProperties(properties);
    const shibuya = result.find((r) => r.municipality === '渋谷区')!;

    expect(shibuya.averagePrice).toBe(200);
    expect(shibuya.medianPrice).toBe(200);
    expect(shibuya.averagePricePerTsubo).toBe(20);
    expect(shibuya.medianPricePerTsubo).toBe(20);
    expect(shibuya.count).toBe(3);
  });

  it('handles null tradePricePerTsubo', () => {
    const properties = [
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 100, tradePricePerTsubo: null},
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 200, tradePricePerTsubo: 20},
    ];

    const result = calculateStatsFromProperties(properties);
    const shibuya = result[0];

    expect(shibuya.averagePrice).toBe(150);
    expect(shibuya.averagePricePerTsubo).toBe(20); // Only one valid value
    expect(shibuya.count).toBe(2);
  });

  it('separates different periods', () => {
    const properties = [
      {period: '20241', prefecture: '東京都', municipality: '渋谷区', tradePrice: 100, tradePricePerTsubo: 10},
      {period: '20242', prefecture: '東京都', municipality: '渋谷区', tradePrice: 200, tradePricePerTsubo: 20},
    ];

    const result = calculateStatsFromProperties(properties);
    expect(result).toHaveLength(2);

    const q1 = result.find((r) => r.period === '20241')!;
    const q2 = result.find((r) => r.period === '20242')!;

    expect(q1.averagePrice).toBe(100);
    expect(q2.averagePrice).toBe(200);
  });
});
