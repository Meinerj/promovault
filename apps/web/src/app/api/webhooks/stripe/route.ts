import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organizationId;
        const tier = session.metadata?.tier as any;

        if (orgId && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await db.subscription.upsert({
            where: { organizationId: orgId },
            update: {
              stripeSubscriptionId: stripeSubscription.id,
              stripeCustomerId: session.customer as string,
              tier,
              status: "ACTIVE",
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            },
            create: {
              organizationId: orgId,
              stripeSubscriptionId: stripeSubscription.id,
              stripeCustomerId: session.customer as string,
              tier,
              status: "ACTIVE",
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            },
          });

          await db.organization.update({
            where: { id: orgId },
            data: { status: "ACTIVE" },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await db.subscription.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });
          if (sub) {
            await db.subscription.update({
              where: { id: sub.id },
              data: { status: "ACTIVE" },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await db.subscription.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });
          if (sub) {
            await db.subscription.update({
              where: { id: sub.id },
              data: { status: "PAST_DUE" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          await db.subscription.update({
            where: { id: sub.id },
            data: {
              status: "CANCELLED",
              cancelledAt: new Date(),
            },
          });
          await db.organization.update({
            where: { id: sub.organizationId },
            data: { status: "SUSPENDED" },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          await db.subscription.update({
            where: { id: sub.id },
            data: {
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: subscription.cancel_at_period_end ? "CANCELLED" : "ACTIVE",
            },
          });
        }
        break;
      }

      default:
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Error processing event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
