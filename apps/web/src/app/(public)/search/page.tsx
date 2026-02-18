export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export const metadata = {
  title: "Search Businesses",
  description: "Search and discover premium local businesses on MindSpark.ai.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category } = await searchParams;

  const organizations = await db.organization.findMany({
    where: {
      status: "APPROVED",
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
              { shortDescription: { contains: q, mode: "insensitive" as const } },
              { city: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(category
        ? { categories: { some: { category: { slug: category } } } }
        : {}),
    },
    include: {
      categories: { include: { category: true } },
    },
    orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { name: "asc" }],
    take: 50,
  });

  const categories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });

  type OrgItem = (typeof organizations)[number];
  type CatItem = (typeof categories)[number];

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Search Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-navy-900">Search Businesses</h1>
          <form action="/search" method="GET" className="mt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <label
                  htmlFor="search-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search
                </label>
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Search by name, category, or location..."
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                  aria-label="Search businesses by name, category, or location"
                />
              </div>
              <div>
                <label
                  htmlFor="category-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category-select"
                  name="category"
                  defaultValue={category || ""}
                  className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-gray-700 focus:ring-2 focus:ring-brand-400"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: CatItem) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button type="submit" size="lg">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {q && (
          <p className="mb-6 text-gray-500">
            {organizations.length} result{organizations.length !== 1 ? "s" : ""} for &ldquo;<span className="font-medium text-navy-900">{q}</span>&rdquo;
          </p>
        )}

        {organizations.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">No businesses found</h2>
            <p className="mt-2 text-gray-500">Try different search terms or browse our categories</p>
            <Link href="/categories">
              <Button variant="outline" className="mt-4">Browse Categories</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org: OrgItem) => (
              <Link key={org.id} href={`/businesses/${org.slug}`}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                  <div className="h-40 bg-gradient-to-br from-navy-800 to-navy-900 rounded-t-lg relative">
                    {org.coverImageUrl ? (
                      <Image src={org.coverImageUrl} alt={org.name} fill className="object-cover rounded-t-lg" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl font-bold text-brand-400/30">{org.name.charAt(0)}</span>
                      </div>
                    )}
                    {org.featured && (
                      <Badge className="absolute top-2 right-2 text-xs">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-navy-900 group-hover:text-brand-500 transition-colors">
                      {org.name}
                    </h3>
                    {org.categories[0] && (
                      <p className="text-xs text-gray-400 mt-1">{org.categories[0].category.name}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {org.shortDescription || org.description}
                    </p>
                    {org.city && (
                      <p className="mt-2 text-xs text-gray-400">📍 {org.city}, {org.state}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
