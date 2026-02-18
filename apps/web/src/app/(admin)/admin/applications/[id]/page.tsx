export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApplicationActions } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const application = await db.application.findUnique({ where: { id } });
  if (!application) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/applications" className="text-sm text-gray-500 hover:underline">
            ← Back to Applications
          </Link>
          <h2 className="text-2xl font-bold text-navy-900 mt-2">
            {application.businessName}
          </h2>
        </div>
        <Badge
          variant={
            application.status === "PENDING"
              ? "default"
              : application.status === "APPROVED"
              ? "success"
              : "destructive"
          }
        >
          {application.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Contact Name</p>
            <p className="font-medium">{application.contactName}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{application.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{application.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Website</p>
            <p className="font-medium">{application.website || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">{application.category || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Applied</p>
            <p className="font-medium">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
          {application.address && (
            <div className="md:col-span-2">
              <p className="text-gray-500">Address</p>
              <p className="font-medium">
                {[application.address, application.city, application.state, application.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
          {application.description && (
            <div className="md:col-span-2">
              <p className="text-gray-500">Description</p>
              <p className="font-medium">{application.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {application.status === "PENDING" && (
        <ApplicationActions applicationId={application.id} />
      )}
    </div>
  );
}
