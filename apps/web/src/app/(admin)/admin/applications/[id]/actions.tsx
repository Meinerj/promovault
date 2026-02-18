"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  async function handleAction(status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="font-semibold text-navy-900">Admin Actions</h3>
      <Textarea
        placeholder="Admin notes (optional)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
      <div className="flex gap-3">
        <Button
          onClick={() => handleAction("APPROVED")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          Approve & Create Organization
        </Button>
        <Button
          onClick={() => handleAction("REJECTED")}
          disabled={loading}
          variant="destructive"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
