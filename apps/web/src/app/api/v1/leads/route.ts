import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, name, email, phone, message, type } = body;

    if (!organizationId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: organizationId, name, email" },
        { status: 400 }
      );
    }

    // Verify organization exists and is active
    const org = await db.organization.findUnique({
      where: { id: organizationId, status: "ACTIVE" },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found or inactive" },
        { status: 404 }
      );
    }

    const lead = await db.lead.create({
      data: {
        organizationId,
        name,
        email,
        phone: phone || null,
        message: message || null,
        type: type || "CONTACT_FORM",
      },
    });

    // TODO: Send notification email to business owner
    // TODO: Send confirmation email to lead

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("[LEADS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
