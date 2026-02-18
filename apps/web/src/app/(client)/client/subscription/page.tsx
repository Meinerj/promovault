export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS, formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";

export default async function ClientSubscriptionPage() {
  const session = await getServerSession(authOptions);
  const orgId = session!.user.organizationId!;

  const subscription = await db.subscription.findUnique({
    where: { organizationId: orgId },
  });

  const currentTier = subscription?.tier || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Subscription</h2>
        <p className="text-gray-500 mt-1">Manage your subscription plan</p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-navy-900">{subscription.tier}</p>
              <p className="text-sm text-gray-500">
                Status: <Badge variant={subscription.status === "ACTIVE" ? "success" : "destructive"}>{subscription.status}</Badge>
              </p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-gray-400 mt-1">
                  Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <form action="/api/v1/checkout" method="POST">
              <input type="hidden" name="tier" value={subscription.tier} />
              <Button variant="outline">Manage Billing</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
          <Card
            key={key}
            className={`relative ${currentTier === key ? "ring-2 ring-brand-500" : ""}`}
          >
            {currentTier === key && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-brand-500">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <p className="text-sm text-gray-500">{tier.description}</p>
              <p className="text-3xl font-bold text-navy-900 mt-2">
                {formatCurrency(tier.priceCents)}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {currentTier !== key && (
                <form action="/api/v1/checkout" method="POST" className="mt-6">
                  <input type="hidden" name="tier" value={key} />
                  <Button className="w-full" variant={key === "PREMIUM" ? "default" : "outline"}>
                    {currentTier ? "Switch Plan" : "Get Started"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
