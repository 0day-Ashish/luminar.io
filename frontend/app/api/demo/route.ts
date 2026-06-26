import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin successfully initialized from local file.");
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const val = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        let serviceAccount;
        if (val.startsWith("{")) {
          serviceAccount = JSON.parse(val);
        } else {
          serviceAccount = JSON.parse(Buffer.from(val, "base64").toString("utf8"));
        }
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log("Firebase Admin successfully initialized from environment variable.");
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env:", err);
      }
    } else {
      console.error(`Firebase service account file not found, and FIREBASE_SERVICE_ACCOUNT env is missing.`);
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

// Get database instance targeting custom 'support' database ID
const db = getFirestore("support");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate request body
    if (!email) {
      return NextResponse.json(
        { error: "Email is a required field." },
        { status: 400 }
      );
    }

    // Save submission to Firestore
    const docRef = await db.collection("demo_requests").add({
      email,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Demo request saved to database successfully.",
    });
  } catch (error: any) {
    console.error("Error saving demo request to Firestore:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
