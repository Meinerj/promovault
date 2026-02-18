import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      contactName,
      email,
      phone,
      website,
      category,
      description,
      address,
      city,
      state,
      zip,
    } = body;

    if (!businessName || !contactName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existing = await db.application.findFirst({
      where: { email, status: { in: ["PENDING", "REVIEWING"] } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email is already under review" },
        { status: 409 }
      );
    }

    const application = await db.application.create({
      data: {
        businessName,
        contactName,
        email,
        phone,
        website: website || null,
        category: category || null,
        description: description || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
      },
    });

    // TODO: Send confirmation email to applicant
    // TODO: Notify admins of new application

    return NextResponse.json(
      { success: true, applicationId: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
