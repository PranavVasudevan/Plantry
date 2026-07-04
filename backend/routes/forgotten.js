import express from "express";
import { db } from "../firebaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/add",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;
    const { shoppingEventId, items } = req.body;

    if (!shoppingEventId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "shoppingEventId and items are required." });
    }

    const batch = db.batch();
    const now = new Date();

    items.forEach(rawItem => {
      const item = rawItem.toLowerCase().trim();
      if (!item) return;

      const docId = `${shoppingEventId}:${item}`;
      const ref = db.collection("forgotten_events").doc(docId);

      batch.set(
        ref,
        {
          householdId,
          shoppingEventId,
          item,
          eventDate: now,
          boughtLater: true,
          reason: "forgot_to_add",
          updatedAt: now,
          createdAt: now
        },
        { merge: true }
      );
    });

    await batch.commit();
    res.json({ success: true });
  })
);

export default router;