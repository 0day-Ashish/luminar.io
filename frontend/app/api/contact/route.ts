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
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin successfully initialized from environment variable.");
    } else {
      console.error(`Firebase service account file not found, and FIREBASE_SERVICE_ACCOUNT env is missing.`);
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

// Get database instance
const db = getFirestore("support");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate request body
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Save submission to Firestore
    const docRef = await db.collection("contact_submissions").add({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Submission saved to database successfully.",
    });
  } catch (error: any) {
    console.error("Error saving contact submission to Firestore:", error);
    let errorMessage = error.message || "Internal Server Error";
    if (error.code === 5 || (error.message && error.message.includes("NOT_FOUND"))) {
      errorMessage = "Firestore Database '(default)' is not initialized in the Firebase project 'luminar-support'. Please go to the Firebase Console (https://console.firebase.google.com/), select the 'luminar-support' project, and click 'Create Database' under the Firestore Database section.";
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
