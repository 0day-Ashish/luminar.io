import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../lib/firebase-admin";

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
  } catch (error: unknown) {
    console.error("Error saving demo request to Firestore:", error);
    return NextResponse.json(
      { error: "Failed to submit demo request. Please try again later." },
      { status: 500 }
    );
  }
}
