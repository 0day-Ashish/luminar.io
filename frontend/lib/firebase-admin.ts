import { initializeApp, getApps, cert } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin SDK (singleton — safe to import from multiple routes)
if (!getApps().length) {
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      initializeApp({ credential: cert(serviceAccount) });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const val = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      const serviceAccount = val.startsWith("{")
        ? JSON.parse(val)
        : JSON.parse(Buffer.from(val, "base64").toString("utf8"));
      initializeApp({ credential: cert(serviceAccount) });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

/** Firestore instance targeting the 'support' database. */
export const db = getFirestore("support");
