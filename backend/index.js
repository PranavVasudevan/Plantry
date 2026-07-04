import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { requireAuth } from "./middleware/auth.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { scheduleCleanupJob } from "./jobs/cleanupExpiredFeedback.job.js";

import suggestionsRouter from "./routes/suggestions.js";
import insightsRouter from "./routes/insights.js";
import parseItemsRouter from "./routes/parseItems.js";
import shoppingEventsRouter from "./routes/shoppingEvents.js";
import activityRouter from "./routes/activity.js";
import forgottenRouter from "./routes/forgotten.js";

dotenv.config();

const app = express();

// Comma-separated list of allowed frontend origins, e.g.
// "http://localhost:3000,https://plantry.vercel.app"
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json());

// Every /api route requires a valid Firebase ID token. requireAuth attaches
// req.uid and req.householdId, which every route below reads from — the
// client can no longer choose which household's data it's touching.
app.use("/api", requireAuth);

app.use("/api/suggestions", suggestionsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/items", parseItemsRouter);
app.use("/api/shopping", shoppingEventsRouter);
app.use("/api/activity", activityRouter);
app.use("/api/forgotten", forgottenRouter);

app.get("/", (_, res) => {
  res.send("Plantry backend running");
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  scheduleCleanupJob();
});