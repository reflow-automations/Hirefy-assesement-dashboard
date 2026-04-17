import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ACCESS_COOKIE = "hirefy-access";

/**
 * Minimal password gate. Reads an http-only cookie set by the /login server
 * action. Does not touch Supabase or anything server-stateful — just presence
 * of the cookie. Not cryptographically secure; this is a soft gate for a
 * client showcase, not auth for sensitive data.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow: login page, Next internals, static files
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ACCESS_COOKIE);
  if (!cookie || cookie.value !== "1") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") {
      url.searchParams.set("next", pathname + request.nextUrl.search);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets & Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
