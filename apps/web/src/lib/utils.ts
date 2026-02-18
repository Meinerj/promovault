import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export const SUBSCRIPTION_TIERS = {
  BASIC: {
    name: "Basic",
    description: "Essential listing visibility",
    priceCents: 49700,
    stripePriceId: process.env.STRIPE_PRICE_BASIC || "price_basic",
    features: [
      "Business profile page",
      "Category listing",
      "Contact form",
      "Basic analytics",
    ],
  },
  FEATURED: {
    name: "Featured",
    description: "Enhanced visibility & promotion",
    priceCents: 99700,
    stripePriceId: process.env.STRIPE_PRICE_FEATURED || "price_featured",
    features: [
      "Everything in Basic",
      "Featured badge",
      "Priority search placement",
      "Monthly blog spotlight",
      "Social media mention",
      "Advanced analytics",
    ],
  },
  PREMIUM: {
    name: "Premium",
    description: "Maximum exposure & leads",
    priceCents: 199700,
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || "price_premium",
    features: [
      "Everything in Featured",
      "Homepage featured carousel",
      "Weekly blog content",
      "Social media campaign",
      "Lead notifications (email + SMS)",
      "Dedicated account manager",
      "Custom offers & coupons",
    ],
  },
  ELITE: {
    name: "Elite",
    description: "Full-service promotion package",
    priceCents: 499700,
    stripePriceId: process.env.STRIPE_PRICE_ELITE || "price_elite",
    features: [
      "Everything in Premium",
      "Custom landing page",
      "Video spotlight production",
      "Email campaign features",
      "Priority support (24/7)",
      "Quarterly strategy review",
      "API access & CRM integration",
      "Competitor benchmarking",
    ],
  },
};
