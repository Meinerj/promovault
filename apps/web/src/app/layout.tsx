import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "MindSpark.ai — Discover Premium Local Businesses",
    template: "%s | MindSpark.ai",
  },
  description:
    "MindSpark.ai is the premier directory of vetted, high-quality local businesses. Find trusted professionals, restaurants, and services in your area.",
  keywords: [
    "local businesses",
    "business directory",
    "find businesses",
    "premium directory",
    "local services",
    "business promotion",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MindSpark.ai",
    title: "MindSpark.ai — Discover Premium Local Businesses",
    description:
      "The premier directory of vetted, high-quality local businesses. Find trusted professionals, restaurants, and services in your area.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindSpark.ai — Discover Premium Local Businesses",
    description:
      "The premier directory of vetted, high-quality local businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white font-sans">{children}</body>
    </html>
  );
}
