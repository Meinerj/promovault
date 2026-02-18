import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_TIERS, formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
  description: "PromoVault pricing plans. Choose the promotion package that fits your business.",
};

export default function PricingPage() {
  const tiers = Object.entries(SUBSCRIPTION_TIERS);

  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-14">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">
            Invest in Your Business Growth
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Every plan includes active promotion, not just a listing. Choose the level of
            visibility that matches your growth goals.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {tiers.map(([key, tier], i) => {
            const isPopular = key === "PREMIUM";
            return (
              <Card
                key={key}
                className={`relative flex flex-col ${isPopular ? "border-brand-400 border-2 shadow-elevated" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="shadow-sm">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-navy-900">
                      {formatCurrency(tier.priceCents)}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-brand-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href="/for-businesses" className="w-full">
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      size="lg"
                    >
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>All plans include a 30-day money-back guarantee. Cancel anytime.</p>
          <p className="mt-1">Need a custom package? <Link href="/contact" className="text-brand-500 underline">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
}
