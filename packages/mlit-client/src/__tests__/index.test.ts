import {describe, it, expect} from 'vitest';
import {
  PREFECTURE_CODES,
  TARGET_PREFECTURES,
  getQuarterString,
  getYearQuarter,
  getQuarterRange,
} from '../index.js';

describe('PREFECTURE_CODES', () => {
  it('has correct codes for target prefectures', () => {
    expect(PREFECTURE_CODES.TOKYO).toBe('13');
    expect(PREFECTURE_CODES.KANAGAWA).toBe('14');
    expect(PREFECTURE_CODES.SAITAMA).toBe('11');
  });
});

describe('TARGET_PREFECTURES', () => {
  it('contains all three prefectures', () => {
    expect(TARGET_PREFECTURES).toHaveLength(3);
    expect(TARGET_PREFECTURES).toContain('13');
    expect(TARGET_PREFECTURES).toContain('14');
    expect(TARGET_PREFECTURES).toContain('11');
  });
});

describe('getQuarterString', () => {
  it('returns correct format for Q1', () => {
    const date = new Date('2024-01-15');
    expect(getQuarterString(date)).toBe('20241');
  });

  it('returns correct format for Q2', () => {
    const date = new Date('2024-04-15');
    expect(getQuarterString(date)).toBe('20242');
  });

  it('returns correct format for Q3', () => {
    const date = new Date('2024-07-15');
    expect(getQuarterString(date)).toBe('20243');
  });

  it('returns correct format for Q4', () => {
    const date = new Date('2024-10-15');
    expect(getQuarterString(date)).toBe('20244');
  });

  it('handles edge case at quarter boundary (March)', () => {
    const date = new Date('2024-03-31');
    expect(getQuarterString(date)).toBe('20241');
  });

  it('handles edge case at quarter boundary (April)', () => {
    const date = new Date('2024-04-01');
    expect(getQuarterString(date)).toBe('20242');
  });
});

describe('getYearQuarter', () => {
  it('returns year and quarter object', () => {
    const date = new Date('2024-05-15');
    const result = getYearQuarter(date);
    expect(result).toEqual({year: 2024, quarter: 2});
  });

  it('handles December correctly', () => {
    const date = new Date('2024-12-31');
    const result = getYearQuarter(date);
    expect(result).toEqual({year: 2024, quarter: 4});
  });
});

describe('getQuarterRange', () => {
  it('returns array of year/quarter objects', () => {
    const result = getQuarterRange(4);
    expect(result).toHaveLength(4);
    expect(result[0]).toHaveProperty('year');
    expect(result[0]).toHaveProperty('quarter');
  });

  it('returns quarters in reverse chronological order', () => {
    const result = getQuarterRange(2);
    const [first, second] = result;
    // First should be more recent
    if (first.year === second.year) {
      expect(first.quarter).toBeGreaterThanOrEqual(second.quarter);
    } else {
      expect(first.year).toBeGreaterThan(second.year);
    }
  });

  it('defaults to 4 quarters', () => {
    const result = getQuarterRange();
    expect(result).toHaveLength(4);
  });
});
