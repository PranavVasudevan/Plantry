import { auth } from "../firebaseAdmin.js";

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <token>`.
 *
 * Plantry uses a single-owner household model: each Firebase user IS a
 * household, and their UID doubles as the householdId used throughout
 * Firestore. This means the client never gets to say which household's
 * data it wants — it's always derived from the verified token, so one
 * signed-in user can never read or write another household's data.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.uid = decoded.uid;
    req.householdId = decoded.uid;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired session. Please sign in again." });
  }
}