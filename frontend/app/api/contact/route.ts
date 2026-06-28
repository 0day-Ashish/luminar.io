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
  } catch (error: unknown) {
    console.error("Error saving contact submission to Firestore:", error);
    return NextResponse.json(
      { error: "Failed to save your message. Please try again later." },
      { status: 500 }
    );
  }
}
