import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { SUBSCRIPTION_TIERS } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const session = await getServerSession(authOptions);

    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = body;

    const tierConfig = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];
    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Check existing subscription
    const existingSub = await db.subscription.findUnique({
      where: { organizationId: session.user.organizationId },
    });

    if (existingSub?.stripeCustomerId) {
      // Create billing portal session for upgrades
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: existingSub.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}/client/subscription`,
      });
      return NextResponse.json({ url: portalSession.url });
    }

    // Create new checkout session
    const org = await db.organization.findUnique({
      where: { id: session.user.organizationId },
      include: { owner: true },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: org?.owner?.email || session.user.email!,
      line_items: [
        {
          price: tierConfig.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        organizationId: session.user.organizationId,
        tier,
      },
      success_url: `${process.env.NEXTAUTH_URL}/client/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/client/subscription?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
