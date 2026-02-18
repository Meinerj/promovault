import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, path, referrer, userAgent, deviceType } = body;

    if (!organizationId || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.pageView.create({
      data: {
        organizationId,
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        deviceType: deviceType || "DESKTOP",
        ipHash: null, // Hash IP server-side for privacy
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[ANALYTICS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
