import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app.js";
import { startScheduler } from "./scheduler.js";

const port = Number(process.env.PORT) || 3001;
console.log(`API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });

if (process.env.ENABLE_SCHEDULER !== "false") {
	startScheduler();
}

export default app;
