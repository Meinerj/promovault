import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "./profile-form";

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions);
  const orgId = session!.user.organizationId!;

  const organization = await db.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    return <div className="text-center py-12 text-gray-500">Organization not found</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Edit Profile</h2>
        <p className="text-gray-500 mt-1">
          Update your business listing information
        </p>
      </div>

      <ProfileForm organization={organization} />
    </div>
  );
}
