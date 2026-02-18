"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForBusinessesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/v1/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.get("businessName"),
          contactName: formData.get("contactName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          website: formData.get("website"),
          category: formData.get("category"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setIsSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-6 text-3xl font-bold text-navy-900">Application Received!</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Thank you for your interest in PromoVault. Our team will review your application
            and contact you within 24-48 hours to discuss the best promotion package for your business.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Sales Copy */}
          <div>
            <h1 className="text-4xl font-bold text-navy-900 sm:text-5xl">
              Get More Customers with <span className="text-gradient">PromoVault</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              We don&apos;t just list your business — we actively promote it. Our premium platform
              drives qualified leads through SEO, content marketing, social media, and targeted campaigns.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "SEO-optimized profile page that ranks on Google",
                "Blog posts and spotlights featuring your business",
                "Social media promotion to our growing audience",
                "Lead tracking dashboard showing your ROI",
                "Dedicated account management",
                "30-day money-back guarantee",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-400 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Application Form */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Apply to Get Listed</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the form below and we&apos;ll be in touch within 24-48 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <Input id="businessName" name="businessName" required placeholder="Your Business Name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <Input id="contactName" name="contactName" required placeholder="John Smith" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input id="email" name="email" type="email" required placeholder="john@business.com" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input id="website" name="website" type="url" placeholder="https://yourbusiness.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category
                  </label>
                  <Input id="category" name="category" placeholder="e.g., Restaurant, Dental, Auto Repair" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Tell us about your business
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What does your business do? What are your goals for joining PromoVault?"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
