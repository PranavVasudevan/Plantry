import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// .env files can't hold real newlines in a single-line value, so the private
// key is stored with literal "\n" sequences and unescaped here.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, " +
      "and FIREBASE_PRIVATE_KEY in backend/.env — see backend/.env.example. " +
      "You can copy these three values out of your existing serviceAccountKey.json " +
      "(project_id, client_email, private_key)."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
}

export const db = admin.firestore();
export const auth = admin.auth();