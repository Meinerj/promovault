import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
            <span className="text-lg font-bold text-brand-400">M</span>
          </div>
          <span className="text-xl font-bold text-navy-900">
            Mind<span className="text-brand-400">Spark.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <Link
            href="/categories"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
          >
            Browse Categories
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
          >
            Search
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
          >
            Blog
          </Link>
          <Link
            href="/for-businesses"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
          >
            For Businesses
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center space-x-3">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/for-businesses">
            <Button size="sm">List Your Business</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy-950 text-gray-300">
      <div className="container-wide py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-lg font-bold text-white">
                Mind<span className="text-brand-400">Spark.ai</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              The premier directory of vetted, high-quality local businesses. Find trusted
              professionals and services in your area.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories" className="hover:text-brand-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-brand-400 transition-colors">
                  Search Businesses
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-400 transition-colors">
                  Blog & Spotlights
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              For Businesses
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-businesses" className="hover:text-brand-400 transition-colors">
                  Get Listed
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-400 transition-colors">
                  Client Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MindSpark.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
