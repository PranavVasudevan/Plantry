import express from "express";
import { db } from "../firebaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Full history for the History page.
 */
router.get(
  "/history",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;

    const shoppingSnap = await db
      .collection("shopping_events")
      .where("householdId", "==", householdId)
      .orderBy("shoppingDate", "desc")
      .get();

    const shoppingEvents = shoppingSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      shoppingDate: doc.data().shoppingDate?.toDate
        ? doc.data().shoppingDate.toDate()
        : new Date(doc.data().shoppingDate)
    }));

    const forgottenSnap = await db
      .collection("forgotten_events")
      .where("householdId", "==", householdId)
      .get();

    const forgottenBySession = {};

    forgottenSnap.docs.forEach(doc => {
      const d = doc.data();
      const sessionId = d.shoppingEventId;
      if (!forgottenBySession[sessionId]) {
        forgottenBySession[sessionId] = [];
      }
      forgottenBySession[sessionId].push(d.item);
    });

    const events = shoppingEvents.map(e => ({
      id: e.id,
      date: e.shoppingDate,
      items: e.items ?? [],
      forgotten: forgottenBySession[e.id] ?? []
    }));

    res.json({ events });
  })
);

/**
 * Recent summary for the Dashboard card.
 */
router.get(
  "/recent",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;

    const snap = await db
      .collection("shopping_events")
      .where("householdId", "==", householdId)
      .orderBy("shoppingDate", "desc")
      .limit(3)
      .get();

    const events = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        date: d.shoppingDate?.toDate ? d.shoppingDate.toDate() : new Date(d.shoppingDate),
        itemCount: d.items?.length ?? 0
      };
    });

    res.json({ events });
  })
);

export default router;