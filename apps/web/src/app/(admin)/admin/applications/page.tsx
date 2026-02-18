export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminApplicationsPage() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  type ApplicationItem = (typeof applications)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Applications</h2>
          <p className="text-gray-500 mt-1">
            Review and manage business applications
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Business</th>
                  <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app: ApplicationItem) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{app.businessName}</p>
                      {app.website && (
                        <p className="text-xs text-gray-400">{app.website}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <p>{app.contactName}</p>
                      <p className="text-xs text-gray-400">{app.email}</p>
                    </td>
                    <td className="p-4 text-gray-500">{app.category || "—"}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          app.status === "PENDING"
                            ? "default"
                            : app.status === "APPROVED"
                            ? "success"
                            : app.status === "REVIEWING"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No applications yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
