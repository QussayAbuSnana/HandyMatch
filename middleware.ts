import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("hm_role")?.value; // "customer" | "professional" | undefined

  // ── Block /dev in production ──────────────────────────────────────────────
  if (pathname.startsWith("/dev") && process.env.NODE_ENV === "production") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Redirect logged-in users away from auth pages ────────────────────────
  if (pathname === "/login" || pathname === "/register") {
    if (role === "customer") return NextResponse.redirect(new URL("/dashboard", request.url));
    if (role === "professional") return NextResponse.redirect(new URL("/pro/dashboard", request.url));
    return NextResponse.next();
  }

  // ── Protect customer routes ───────────────────────────────────────────────
  const isCustomerRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/professionals") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/estimate");

  if (isCustomerRoute) {
    if (!role) return NextResponse.redirect(new URL("/login", request.url));
    if (role === "professional") return NextResponse.redirect(new URL("/pro/dashboard", request.url));
  }

  // ── Protect pro routes ────────────────────────────────────────────────────
  if (pathname.startsWith("/pro/")) {
    if (!role) return NextResponse.redirect(new URL("/login", request.url));
    if (role === "customer") return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/search/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/professionals/:path*",
    "/notifications/:path*",
    "/categories",
    "/categories/:path*",
    "/estimate/:path*",
    "/estimate",
    "/pro/:path*",
    "/login",
    "/register",
    "/dev",
    "/dev/:path*",
  ],
};
