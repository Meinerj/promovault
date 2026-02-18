"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LeadContactFormProps {
  organizationId: string;
  organizationName: string;
}

export function LeadContactForm({ organizationId, organizationName }: LeadContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          type: "CONTACT_FORM",
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          sourcePage: window.location.pathname,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact the business directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-800">Message Sent!</p>
        <p className="mt-2 text-sm text-emerald-600">
          Your message has been forwarded to {organizationName}. They will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <Input id="name" name="name" required placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <Input id="email" name="email" type="email" required placeholder="john@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={`Tell ${organizationName} what you're looking for...`}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
      <p className="text-xs text-gray-400 text-center">
        Your information will be sent directly to {organizationName}.
      </p>
    </form>
  );
}
