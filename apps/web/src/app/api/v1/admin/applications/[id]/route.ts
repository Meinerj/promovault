import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import bcrypt from "bcryptjs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    const application = await db.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update application status
    await db.application.update({
      where: { id },
      data: { status, adminNotes, reviewedAt: new Date(), reviewedBy: session.user.id },
    });

    // If approved, create organization + user account
    if (status === "APPROVED") {
      const slug = slugify(application.businessName);

      // Create user for the business owner
      const tempPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const user = await db.user.create({
        data: {
          email: application.email,
          name: application.contactName,
          password: hashedPassword,
          role: "BUSINESS_CLIENT",
        },
      });

      // Create organization
      const org = await db.organization.create({
        data: {
          name: application.businessName,
          slug,
          description: application.description,
          phone: application.phone,
          email: application.email,
          website: application.website,
          address: application.address,
          city: application.city,
          state: application.state,
          zip: application.zip,
          ownerId: user.id,
          status: "PENDING_PAYMENT",
        },
      });

      // Link user to organization
      await db.user.update({
        where: { id: user.id },
        data: { organizationId: org.id },
      });

      // Assign category if provided
      if (application.category) {
        const category = await db.category.findFirst({
          where: { name: { contains: application.category, mode: "insensitive" } },
        });
        if (category) {
          await db.organizationCategory.create({
            data: { organizationId: org.id, categoryId: category.id },
          });
        }
      }

      // Log the action
      await db.auditLog.create({
        data: {
          userId: session.user.id,
          action: "APPLICATION_APPROVED",
          entity: "Application",
          entityId: id,
          details: { organizationId: org.id, tempPassword },
        },
      });

      // TODO: Send welcome email with temp password to the business owner

      return NextResponse.json({
        success: true,
        organizationId: org.id,
        userId: user.id,
        message: "Application approved. Organization and user account created.",
      });
    }

    // Log rejection
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "APPLICATION_REJECTED",
        entity: "Application",
        entityId: id,
        details: { reason: adminNotes },
      },
    });

    return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()}` });
  } catch (error) {
    console.error("[ADMIN_APPLICATION_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
