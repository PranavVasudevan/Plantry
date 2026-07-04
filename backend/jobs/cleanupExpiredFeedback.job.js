import cron from "node-cron";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebaseAdmin.js";

// NOTE: the original version of this job (backend/firebaseClean.js, now
// removed) was a Firebase Cloud Function that queried a "userActions"
// collection. Nothing in this codebase ever wrote to that collection —
// reject feedback is written to "suggestion_feedback" by
// routes/suggestions.js — so the original job would have silently never
// deleted anything. Fixed here to target the real collection.
export async function cleanupExpiredRejects() {
  const now = Timestamp.now();

  const snapshot = await db
    .collection("suggestion_feedback")
    .where("action", "==", "reject")
    .where("expiresAt", "<", now)
    .get();

  if (snapshot.empty) {
    console.log("[cleanup] No expired reject feedback to remove.");
    return 0;
  }

  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  console.log(`[cleanup] Deleted ${snapshot.size} expired reject feedback entries.`);
  return snapshot.size;
}

// Runs once a day. Lives inside the Express process itself, so it runs
// automatically as long as the backend is up on Render — no separate
// Firebase Functions deploy or Blaze plan required.
export function scheduleCleanupJob() {
  cron.schedule("0 3 * * *", () => {
    cleanupExpiredRejects().catch(err => console.error("[cleanup] Job failed:", err));
  });
  console.log("[cleanup] Scheduled expired-feedback cleanup job (daily at 03:00 UTC).");
}