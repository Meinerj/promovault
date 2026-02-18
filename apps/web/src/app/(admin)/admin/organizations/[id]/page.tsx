export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Mail, Phone, MapPin } from "lucide-react";

export default async function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await db.organization.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      subscription: true,
      users: { select: { id: true, email: true, name: true } },
      _count: { select: { leads: true, pageViews: true } },
    },
  });

  if (!org) notFound();

  const statusColor: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800",
    ACTIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PENDING_PAYMENT: "bg-orange-100 text-orange-800",
    REJECTED: "bg-red-100 text-red-800",
    SUSPENDED: "bg-red-100 text-red-800",
    CHURNED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/organizations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-900">{org.name}</h1>
          <p className="text-sm text-gray-500">ID: {org.id}</p>
        </div>
        <Badge className={statusColor[org.status] || "bg-gray-100 text-gray-800"}>
          {org.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-brand-500">{org._count.leads}</p>
          <p className="text-sm text-gray-500 mt-1">Total Leads</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-brand-500">{org._count.pageViews}</p>
          <p className="text-sm text-gray-500 mt-1">Page Views</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-brand-500">{org.subscriptionTier || "None"}</p>
          <p className="text-sm text-gray-500 mt-1">Subscription Tier</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Details */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brand-900">Business Details</h2>
          {org.description && <p className="text-sm text-gray-600">{org.description}</p>}
          <div className="space-y-2 text-sm">
            {org.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" /> {org.phone}
              </div>
            )}
            {org.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" /> {org.email}
              </div>
            )}
            {org.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                  {org.website}
                </a>
              </div>
            )}
            {org.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" /> {org.address}, {org.city}, {org.state} {org.zip}
              </div>
            )}
          </div>
          <div className="pt-2">
            <p className="text-xs text-gray-400">
              Created: {new Date(org.createdAt).toLocaleDateString()} · 
              Slug: {org.slug}
            </p>
          </div>
        </Card>

        {/* Subscription & Categories */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-brand-900">Subscription</h2>
          {org.subscription ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Tier:</span> {org.subscription.tier}</p>
              <p><span className="font-medium">Status:</span> {org.subscription.status}</p>
              <p><span className="font-medium">Price:</span> ${(org.subscription.priceCents / 100).toFixed(2)}/mo</p>
              <p><span className="font-medium">Period:</span> {org.subscription.currentPeriodStart ? new Date(org.subscription.currentPeriodStart).toLocaleDateString() : "N/A"} – {org.subscription.currentPeriodEnd ? new Date(org.subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No active subscription</p>
          )}

          <h2 className="text-lg font-semibold text-brand-900 pt-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {org.categories.map((oc) => (
              <Badge key={oc.categoryId} className="bg-brand-50 text-brand-700">
                {oc.category.name}
              </Badge>
            ))}
            {org.categories.length === 0 && <p className="text-sm text-gray-500">No categories assigned</p>}
          </div>

          <h2 className="text-lg font-semibold text-brand-900 pt-4">Team Members</h2>
          {org.users.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {org.users.map((u) => (
                <li key={u.id} className="text-gray-600">{u.name || u.email}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No team members</p>
          )}
        </Card>
      </div>
    </div>
  );
}
