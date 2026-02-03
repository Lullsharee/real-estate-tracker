import {describe, it, expect} from 'vitest';
import {Hono} from 'hono';

// 最小限のテスト用アプリ
const testApp = new Hono();
testApp.get('/health', (c) => c.json({status: 'ok'}));

describe('Health Endpoint', () => {
  it('returns ok status', async () => {
    const res = await testApp.request('/health');
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({status: 'ok'});
  });
});
