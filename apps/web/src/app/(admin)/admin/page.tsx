export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FileText, TrendingUp, DollarSign, Eye } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function AdminDashboard() {
  // Parallel data fetching
  const [
    orgCount,
    activeOrgCount,
    userCount,
    pendingApps,
    totalLeads,
    monthlyLeads,
    recentApplications,
    recentLeads,
    totalPageViews,
  ] = await Promise.all([
    db.organization.count(),
    db.organization.count({ where: { status: "ACTIVE" } }),
    db.user.count(),
    db.application.count({ where: { status: "PENDING" } }),
    db.lead.count(),
    db.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    }),
    db.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { organization: { select: { name: true } } },
    }),
    db.pageView.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    }),
  ]);

  const stats = [
    {
      label: "Active Businesses",
      value: activeOrgCount,
      total: orgCount,
      icon: Building2,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Total Users",
      value: userCount,
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Pending Applications",
      value: pendingApps,
      icon: FileText,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Monthly Leads",
      value: monthlyLeads,
      total: totalLeads,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Monthly Page Views",
      value: totalPageViews,
      icon: Eye,
      color: "text-indigo-600 bg-indigo-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(stat.value)}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{app.businessName}</p>
                      <p className="text-xs text-gray-500">{app.contactName} • {app.email}</p>
                    </div>
                    <Badge
                      variant={
                        app.status === "PENDING"
                          ? "default"
                          : app.status === "APPROVED"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-gray-500 text-sm">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-500">
                        {lead.organization.name} • {lead.type.replace("_", " ")}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
