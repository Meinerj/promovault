export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Eye, Users, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  const orgId = session!.user.organizationId!;

  const [org, subscription, leadsThisMonth, totalLeads, pageViewsThisMonth, recentLeads] =
    await Promise.all([
      db.organization.findUnique({
        where: { id: orgId },
        include: { categories: { include: { category: true } } },
      }),
      db.subscription.findUnique({ where: { organizationId: orgId } }),
      db.lead.count({
        where: {
          organizationId: orgId,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        },
      }),
      db.lead.count({ where: { organizationId: orgId } }),
      db.pageView.count({
        where: {
          organizationId: orgId,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        },
      }),
      db.lead.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Page Views (30d)", value: pageViewsThisMonth, icon: Eye, color: "text-blue-600 bg-blue-100" },
    { label: "Leads (30d)", value: leadsThisMonth, icon: Users, color: "text-green-600 bg-green-100" },
    { label: "Total Leads", value: totalLeads, icon: TrendingUp, color: "text-purple-600 bg-purple-100" },
    { label: "Subscription", value: subscription?.tier || "None", icon: Star, color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Welcome back!</h2>
        <p className="text-gray-500 mt-1">{org?.name} — Business Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {typeof stat.value === "number" ? formatNumber(stat.value) : stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Leads</CardTitle>
          <Link href="/client/leads" className="text-sm text-brand-500 hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-sm">No leads yet. Your profile is being promoted!</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email} {lead.phone ? `• ${lead.phone}` : ""}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{lead.type.replace("_", " ")}</Badge>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
