import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || (token.role !== "SUPER_ADMIN" && token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect client routes
  if (pathname.startsWith("/client")) {
    if (!token || token.role !== "BUSINESS_CLIENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect /dashboard to the correct portal
  if (pathname === "/dashboard") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role === "SUPER_ADMIN" || token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (token.role === "BUSINESS_CLIENT") {
      return NextResponse.redirect(new URL("/client", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && token) {
    if (token.role === "SUPER_ADMIN" || token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/client", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/dashboard", "/login"],
};
