import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, " +
      "and FIREBASE_PRIVATE_KEY in ml-training/.env — see ml-training/.env.example."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
}

export const db = admin.firestore();