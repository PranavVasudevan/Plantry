import express from "express";
import { db } from "../firebaseAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/complete",
  asyncHandler(async (req, res) => {
    const householdId = req.householdId;
    const { items, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "items is required and must be non-empty." });
    }

    const normalizedItems = items.map(i => (typeof i === "string" ? i : i.name).toLowerCase());

    await db.collection("shopping_events").add({
      householdId,
      items: normalizedItems,
      totalAmount: totalAmount ?? null,
      shoppingDate: new Date(),
      shoppingSource: "manual",
      createdAt: new Date()
    });

    res.json({ ok: true });
  })
);

export default router;