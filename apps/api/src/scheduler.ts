import cron from 'node-cron';
import {collectData} from './services/collector.js';
import {calculateStats} from './services/stats.js';

/** 四半期ごとにデータ収集（毎月1日 3:00） */
export function startScheduler(): void {
  cron.schedule('0 3 1 1,4,7,10 *', async () => {
    console.log('[Scheduler] Starting data collection...');
    try {
      const result = await collectData();
      console.log(`[Scheduler] Collected ${result.count} properties`);
      await calculateStats();
      console.log('[Scheduler] Stats calculation completed');
    } catch (err) {
      console.error('[Scheduler] Error:', err);
    }
  });
  console.log('[Scheduler] Quarterly data collection scheduled');
}
