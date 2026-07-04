import { db } from "./firebaseAdmin.js";
import { fetchTrainingData } from "./fetchData.js";
import { trainFPGrowth } from "./models/fpGrowth.js";
import { trainBayesianForget } from "./models/bayesianForget.js";
import { trainTemporalPatterns } from "./models/temporalPatterns.js";

// Household = Firebase UID (single-owner household model). Find yours in
// the Firebase console under Authentication -> Users.
const HOUSEHOLD_ID = process.argv[2];

if (!HOUSEHOLD_ID) {
  console.error("Usage: node trainAll.js <householdId>");
  console.error("  <householdId> is the Firebase UID of the household's owner.");
  process.exit(1);
}

async function trainAll() {
  const { shoppingEvents, forgottenEvents } = await fetchTrainingData(HOUSEHOLD_ID);

  console.log("Shopping events:", shoppingEvents.length);
  console.log("Forgotten events:", forgottenEvents.length);

  const associations = trainFPGrowth(shoppingEvents);
  const forgetScores = trainBayesianForget(shoppingEvents, forgottenEvents);
  const temporal = trainTemporalPatterns(shoppingEvents);

  await db
    .collection("model_outputs_associations")
    .doc(HOUSEHOLD_ID)
    .set({ generatedAt: new Date(), rules: associations });

  await db
    .collection("model_outputs_forgetfulness")
    .doc(HOUSEHOLD_ID)
    .set({ generatedAt: new Date(), scores: forgetScores });

  await db
    .collection("model_outputs_temporal")
    .doc(HOUSEHOLD_ID)
    .set({ generatedAt: new Date(), items: temporal });

  console.log("Training completed successfully");
}

trainAll();