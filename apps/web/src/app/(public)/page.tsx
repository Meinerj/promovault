export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Search, Star, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedBusinesses() {
  return db.organization.findMany({
    where: { status: "APPROVED", featured: true },
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { featuredOrder: "asc" },
    take: 6,
  });
}

async function getCategories() {
  return db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          organizations: {
            where: { organization: { status: "APPROVED" } },
          },
        },
      },
    },
    take: 8,
  });
}

async function getStats() {
  const [orgCount, categoryCount, leadCount] = await Promise.all([
    db.organization.count({ where: { status: "APPROVED" } }),
    db.category.count(),
    db.lead.count(),
  ]);
  return { orgCount, categoryCount, leadCount };
}

const CATEGORY_ICONS: Record<string, string> = {
  utensils: "🍽️",
  home: "🏠",
  heart: "❤️",
  car: "🚗",
  briefcase: "💼",
  sparkles: "✨",
  dumbbell: "💪",
  "shopping-bag": "🛍️",
  building: "🏢",
  "graduation-cap": "🎓",
};

export default async function HomePage() {
  const [featured, categories, stats] = await Promise.all([
    getFeaturedBusinesses(),
    getCategories(),
    getStats(),
  ]);

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden gradient-navy">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-400/10 via-transparent to-transparent" />
        <div className="container-wide relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 bg-brand-400/20 text-brand-400 border-brand-400/30">
              Trusted by {stats.orgCount}+ Premium Businesses
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover{" "}
              <span className="text-gradient">Premium Local</span>{" "}
              Businesses You Can Trust
            </h1>
            <p className="mt-6 text-lg text-gray-300 sm:text-xl">
              MindSpark.ai curates and promotes the best businesses in your area.
              Every listing is vetted, every business is exceptional.
            </p>

            {/* Search Bar */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <form action="/search" method="GET">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search businesses, categories, or services..."
                    className="h-14 w-full rounded-xl border-0 bg-white pl-12 pr-4 text-gray-900 shadow-elevated placeholder:text-gray-400 focus:ring-2 focus:ring-brand-400"
                  />
                </form>
              </div>
              <Link href="/categories">
                <Button size="xl" className="w-full sm:w-auto shadow-elevated">
                  Browse All
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Grid ─── */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Find exactly what you need from our curated business categories
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-400/10 text-2xl">
                      {CATEGORY_ICONS[cat.icon ?? ""] || "📁"}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 group-hover:text-brand-500 transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {cat._count.organizations} businesses
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Businesses ─── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center">
            <Badge className="mb-4">Featured</Badge>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
              Premium Businesses
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Hand-picked and promoted businesses delivering exceptional service
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((org) => (
              <Link key={org.id} href={`/businesses/${org.slug}`}>
                <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-1">
                  {/* Cover Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-900 relative">
                    {org.coverImageUrl ? (
                      <img
                        src={org.coverImageUrl}
                        alt={org.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl font-bold text-brand-400/30">
                          {org.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {org.featured && (
                      <Badge className="absolute top-3 right-3">
                        <Star className="mr-1 h-3 w-3" /> Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900 group-hover:text-brand-500 transition-colors">
                          {org.name}
                        </h3>
                        {org.categories[0] && (
                          <p className="text-sm text-gray-400">
                            {org.categories[0].category.name}
                          </p>
                        )}
                      </div>
                      {org.subscriptionTier && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {org.subscriptionTier.toLowerCase()}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {org.shortDescription || org.description}
                    </p>

                    {org.city && org.state && (
                      <p className="mt-3 text-xs text-gray-400">
                        📍 {org.city}, {org.state}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value Props / How It Works ─── */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
              Why Businesses Choose MindSpark.ai
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              More than a directory — we actively promote your business
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <TrendingUp className="h-8 w-8 text-brand-400" />,
                title: "Active Promotion",
                description:
                  "We don't just list you — we write blog posts, create social media content, and actively drive customers to your business.",
              },
              {
                icon: <Shield className="h-8 w-8 text-brand-400" />,
                title: "Vetted & Trusted",
                description:
                  "Every business on MindSpark.ai is vetted for quality. Consumers trust our directory because we maintain high standards.",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-brand-400" />,
                title: "Measurable ROI",
                description:
                  "Track every page view, click, and lead from your real-time analytics dashboard. Know exactly what you're getting.",
              },
            ].map((item, i) => (
              <Card key={i} className="text-center p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-400/10">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-500">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="section-padding gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-400/10 via-transparent to-transparent" />
        <div className="container-narrow relative text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join {stats.orgCount}+ premium businesses already reaching new customers through
            MindSpark.ai. Apply today and start getting promoted.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/for-businesses">
              <Button size="xl" className="shadow-elevated">
                Apply to Get Listed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="xl" variant="outline" className="border-gray-600 text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
