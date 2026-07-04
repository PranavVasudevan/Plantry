import express from "express";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebaseAdmin.js";
import { generateSuggestions } from "../services/suggestionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/infer",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;
    const { currentList } = req.body;

    if (!Array.isArray(currentList)) {
      return res.status(400).json({ suggestions: [] });
    }

    const [assocSnap, forgetSnap, temporalSnap] = await Promise.all([
      db.collection("model_outputs_associations").doc(householdId).get(),
      db.collection("model_outputs_forgetfulness").doc(householdId).get(),
      db.collection("model_outputs_temporal").doc(householdId).get()
    ]);

    if (!assocSnap.exists && !forgetSnap.exists && !temporalSnap.exists) {
      return res.json({ suggestions: [] });
    }

    const associationsRaw = assocSnap.exists ? assocSnap.data().rules : {};
    const forgetScores = forgetSnap.exists ? forgetSnap.data().scores : {};
    const temporal = temporalSnap.exists ? temporalSnap.data().items : {};

    // Normalize association keys to lowercase
    const associations = {};
    Object.entries(associationsRaw).forEach(([k, v]) => {
      associations[k.toLowerCase()] = v.map(r => ({
        ...r,
        item: r.item.toLowerCase()
      }));
    });

    const suggestions = await generateSuggestions({
      householdId,
      currentList,
      associations,
      forgetScores,
      temporal
    });

    res.json({ suggestions });
  })
);

router.post(
  "/feedback",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;
    const { item, action } = req.body;

    if (!item || typeof item !== "string" || !action) {
      return res.status(400).json({ ok: false, error: "item and action are required." });
    }

    const normItem = normalizeItem(item);

    if (action === "reject") {
      await db.collection("suggestion_feedback").add({
        householdId,
        item: normItem,
        action: "reject",
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        createdAt: new Date()
      });
      return res.json({ ok: true });
    }

    if (action === "block") {
      await db.collection("suggestion_feedback").add({
        householdId,
        item: normItem,
        action: "block",
        createdAt: new Date()
      });
      return res.json({ ok: true });
    }

    if (action === "penalize") {
      const snap = await db
        .collection("suggestion_feedback")
        .where("householdId", "==", householdId)
        .where("item", "==", normItem)
        .where("action", "==", "penalize")
        .limit(1)
        .get();

      const BASE_PENALTY = 0.85;
      const MIN_PENALTY = 0.3;

      if (snap.empty) {
        await db.collection("suggestion_feedback").add({
          householdId,
          item: normItem,
          action: "penalize",
          penalty: BASE_PENALTY,
          createdAt: new Date()
        });
      } else {
        const doc = snap.docs[0];
        const currentPenalty = doc.data().penalty ?? 1.0;
        await doc.ref.update({
          penalty: Math.max(currentPenalty * BASE_PENALTY, MIN_PENALTY),
          updatedAt: new Date()
        });
      }
      return res.json({ ok: true });
    }

    res.status(400).json({ ok: false, error: `Unknown action "${action}".` });
  })
);

function normalizeItem(item) {
  return item.trim().toLowerCase();
}

export default router;