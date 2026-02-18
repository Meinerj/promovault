export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin, Phone, Globe, Mail, Clock, Star, ArrowLeft, ExternalLink, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { LeadContactForm } from "./lead-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getOrganization(slug: string) {
  return db.organization.findUnique({
    where: { slug, status: "APPROVED" },
    include: {
      categories: { include: { category: true } },
      images: { orderBy: { sortOrder: "asc" } },
      offers: { where: { isActive: true } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganization(slug);
  if (!org) return { title: "Business Not Found" };

  return {
    title: `${org.name} — ${org.city}, ${org.state}`,
    description: org.shortDescription || org.description?.slice(0, 160),
    openGraph: {
      title: org.name,
      description: org.shortDescription || undefined,
      images: org.coverImageUrl ? [org.coverImageUrl] : undefined,
    },
  };
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrganization(slug);
  if (!org) notFound();

  const hours = org.openHours as Record<string, { open?: string; close?: string; closed?: boolean }> | null;
  const socialLinks = org.socialLinks as Record<string, string> | null;

  // Track page view (fire-and-forget)
  db.pageView.create({
    data: {
      organizationId: org.id,
      path: `/businesses/${slug}`,
    },
  }).catch(() => {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Cover */}
      <div className="h-64 bg-gradient-to-br from-navy-800 to-navy-950 relative sm:h-80">
        {org.coverImageUrl && (
          <img src={org.coverImageUrl} alt={org.name} className="h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container-wide absolute bottom-0 left-0 right-0 pb-6">
          <Link href="/categories" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Directory
          </Link>
          <div className="flex items-end gap-4">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={`${org.name} logo`} className="h-20 w-20 rounded-xl border-4 border-white shadow-lg object-cover bg-white" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-brand-400 shadow-lg">
                <span className="text-3xl font-bold text-white">{org.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{org.name}</h1>
                {org.featured && (
                  <Badge className="ml-2"><Star className="mr-1 h-3 w-3" /> Featured</Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-gray-300">
                {org.categories[0] && <span>{org.categories[0].category.name}</span>}
                {org.city && <span>• {org.city}, {org.state}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {org.description}
                </p>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {org.images.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {org.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.altText || org.name}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Offers */}
            {org.offers.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Special Offers</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {org.offers.map((offer) => (
                    <div key={offer.id} className="rounded-lg border border-brand-200 bg-brand-50 p-4">
                      <h4 className="font-semibold text-navy-900">{offer.title}</h4>
                      {offer.description && <p className="mt-1 text-sm text-gray-600">{offer.description}</p>}
                      {offer.code && (
                        <p className="mt-2 text-sm">Code: <span className="font-mono font-bold text-brand-500">{offer.code}</span></p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact {org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadContactForm organizationId={org.id} organizationName={org.name} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Contact Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {org.phone && (
                  <a href={`tel:${org.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Phone className="h-4 w-4 text-brand-400" />
                    {org.phone}
                  </a>
                )}
                {org.email && (
                  <a href={`mailto:${org.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Mail className="h-4 w-4 text-brand-400" />
                    {org.email}
                  </a>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Globe className="h-4 w-4 text-brand-400" />
                    Visit Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {org.address && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-brand-400 mt-0.5" />
                    <div>
                      <p>{org.address}</p>
                      <p>{org.city}, {org.state} {org.zip}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  {org.phone && (
                    <a href={`tel:${org.phone}`} className="flex-1">
                      <Button className="w-full" size="sm"><Phone className="mr-2 h-4 w-4" /> Call Now</Button>
                    </a>
                  )}
                  {org.website && (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm"><Globe className="mr-2 h-4 w-4" /> Website</Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            {hours && (
              <Card>
                <CardHeader><CardTitle className="text-lg"><Clock className="inline mr-2 h-4 w-4" />Hours</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                      const dayHours = hours[day];
                      return (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize text-gray-500">{day}</span>
                          <span className="font-medium text-gray-700">
                            {dayHours?.closed ? "Closed" : dayHours?.open && dayHours?.close ? `${dayHours.open} – ${dayHours.close}` : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {socialLinks && Object.keys(socialLinks).length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Follow</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="capitalize cursor-pointer hover:bg-gray-50">
                        {platform}
                      </Badge>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
