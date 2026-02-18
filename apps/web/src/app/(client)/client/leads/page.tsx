export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ClientLeadsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session!.user.organizationId!;

  const leads = await db.lead.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Leads</h2>
        <p className="text-gray-500 mt-1">
          All contact form submissions and inquiries from your listing
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left p-4 font-medium text-gray-600">Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Message</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4">
                      <a href={`mailto:${lead.email}`} className="text-brand-500 hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="p-4 text-gray-500">{lead.phone || "—"}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{lead.type.replace("_", " ")}</Badge>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {lead.message || "—"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No leads yet. Share your listing to start getting inquiries!
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
