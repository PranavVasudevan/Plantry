import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Toggle Gemini usage. Off by default — flip to true once GEMINI_API_KEY is set.
const USE_GEMINI = true;

function fallbackParse(rawInput) {
  return rawInput
    .split(",")
    .map(i => i.trim().toLowerCase())
    .filter(Boolean);
}

router.post("/parse", async (req, res) => {
  try {
    const { rawInput } = req.body;

    if (!rawInput || typeof rawInput !== "string") {
      return res.status(400).json({ items: [] });
    }

    if (!USE_GEMINI) {
      return res.json({ items: fallbackParse(rawInput) });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing — using fallback parser");
      return res.json({ items: fallbackParse(rawInput) });
    }

    const prompt = `
You are a grocery list parser.

Rules:
- Extract only grocery item names
- Remove quantities, brands, numbers
- Normalize to lowercase
- Use generic names
- Output ONLY a JSON array

Input:
"${rawInput}"

Output:
["item1", "item2"]
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await geminiRes.json();

    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    rawText = rawText.replace(/```json\s*|\s*```/g, "");

    let items;
    try {
      items = JSON.parse(rawText);
      if (!Array.isArray(items)) throw new Error("Not an array");
    } catch (err) {
      console.warn("Gemini JSON parse failed — using fallback:", err.message);
      items = fallbackParse(rawInput);
    }

    res.json({ items });
  } catch (err) {
    console.error("Gemini parse error — using fallback:", err);
    res.json({ items: fallbackParse(req.body.rawInput || "") });
  }
});

export default router;