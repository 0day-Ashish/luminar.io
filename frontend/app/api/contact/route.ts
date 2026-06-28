import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../lib/firebase-admin";

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
