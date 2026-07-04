import { db } from "./firebaseAdmin.js";

const HOUSEHOLD_ID = process.argv[2];
const inputList = process.argv.slice(3);

if (!HOUSEHOLD_ID) {
  console.error("Usage: node testInference.js <householdId> [item1] [item2] ...");
  console.error("  Example: node testInference.js abc123uid vermicelli ragi");
  process.exit(1);
}

if (inputList.length === 0) {
  console.log("No items passed — defaulting to a sample list: vermicelli, ragi");
  inputList.push("vermicelli", "ragi");
}

async function testInference() {
  const assocSnap = await db.collection("model_outputs_associations").doc(HOUSEHOLD_ID).get();
  const forgetSnap = await db.collection("model_outputs_forgetfulness").doc(HOUSEHOLD_ID).get();

  if (!assocSnap.exists || !forgetSnap.exists) {
    throw new Error(`No model outputs found for household ${HOUSEHOLD_ID}. Run trainAll.js first.`);
  }

  const associations = assocSnap.data().rules;
  const forgetScores = forgetSnap.data().scores;

  const candidateScores = {};

  inputList.forEach(item => {
    const related = associations[item] || [];

    related.forEach(r => {
      const forgetBoost = forgetScores[r.item]?.forgetProbability || 0;

      candidateScores[r.item] = (candidateScores[r.item] || 0) + 0.6 * r.confidence + 0.4 * forgetBoost;
    });
  });

  inputList.forEach(i => delete candidateScores[i]);

  const suggestions = Object.entries(candidateScores)
    .map(([item, score]) => ({ item, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  console.log("Input list:", inputList);
  console.log("Suggestions:");
  suggestions.forEach(s => console.log(`- ${s.item} (score: ${s.score.toFixed(3)})`));
}

testInference();