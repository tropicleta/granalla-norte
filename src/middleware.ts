import { NextResponse, type NextRequest } from "next/server";
import { configuredPassword, SESSION_COOKIE, verifySession } from "./lib/admin-session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login" || path === "/api/admin/login" || path === "/api/admin/logout") {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  const valid = await verifySession(request.cookies.get(SESSION_COOKIE)?.value, configuredPassword());
  if (!valid) {
    if (path.startsWith("/api/")) return NextResponse.json({ error: "Inicia sesión para continuar." }, { status: 401 });
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
