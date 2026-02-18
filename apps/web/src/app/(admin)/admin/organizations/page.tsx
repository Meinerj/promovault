export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrganizationsPage() {
  const organizations = await db.organization.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      subscription: true,
      categories: { include: { category: true } },
      _count: { select: { leads: true, pageViews: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Organizations</h2>
          <p className="text-gray-500 mt-1">Manage listed businesses</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Business</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Tier</th>
                  <th className="text-left p-4 font-medium text-gray-600">Leads</th>
                  <th className="text-left p-4 font-medium text-gray-600">Views</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{org.name}</p>
                      <p className="text-xs text-gray-400">
                        {org.categories.map((c) => c.category.name).join(", ") || "No category"}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          org.status === "ACTIVE"
                            ? "success"
                            : org.status === "SUSPENDED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {org.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">
                      {org.subscription?.tier || "None"}
                    </td>
                    <td className="p-4 text-gray-500">{org._count.leads}</td>
                    <td className="p-4 text-gray-500">{org._count.pageViews}</td>
                    <td className="p-4">
                      <Link href={`/admin/organizations/${org.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
