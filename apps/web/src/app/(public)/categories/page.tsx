export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

const CATEGORY_ICONS: Record<string, string> = {
  utensils: "🍽️", home: "🏠", heart: "❤️", car: "🚗", briefcase: "💼",
  sparkles: "✨", dumbbell: "💪", "shopping-bag": "🛍️", building: "🏢", "graduation-cap": "🎓",
};

export const metadata = {
  title: "Browse Categories",
  description: "Browse all business categories on PromoVault. Find exactly what you need.",
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { organizations: { where: { organization: { status: "APPROVED" } } } },
      },
      children: {
        include: {
          _count: {
            select: { organizations: { where: { organization: { status: "APPROVED" } } } },
          },
        },
      },
    },
  });

  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900">Browse All Categories</h1>
          <p className="mt-3 text-lg text-gray-500">
            Find trusted businesses in every category
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <Card className="group h-full cursor-pointer transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-400/10 text-3xl">
                      {CATEGORY_ICONS[cat.icon ?? ""] || "📁"}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-navy-900 group-hover:text-brand-500 transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {cat._count.organizations} business{cat._count.organizations !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                  {cat.description && (
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                  )}
                  {cat.children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cat.children.map((child) => (
                        <span key={child.id} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                          {child.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
