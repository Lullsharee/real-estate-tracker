import "dotenv/config";
import { collectData } from "./services/collector.js";
import { calculateStats } from "./services/stats.js";

async function main() {
  console.log("[Collect] Starting data collection...");
  const result = await collectData();
  console.log(`[Collect] Collected ${result.count} properties`);

  console.log("[Collect] Calculating stats...");
  const stats = await calculateStats();
  console.log(`[Collect] Generated ${stats.count} stat groups`);

  console.log("[Collect] Done");
}

main().catch((err) => {
  console.error("[Collect] Fatal error:", err);
  process.exit(1);
});
