import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role to Path mapping based on folder structure
const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  SUB_ADMIN: "/sub-admin",
  COUNTRY_HEAD: "/country-head",
  STATE_HEAD: "/state-head",
  STATE_PARTNER: "/state-partner",
  DISTRICT_PARTNER: "/district-partner",
  AGENT: "/agent",
  USER: "/user",
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is NOT authenticated
  if (!token) {
    // Redirect to login if trying to access a protected route
    // (Everything except public routes and static assets)
    if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && pathname !== "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Root path (/) always redirects to login for unauthenticated users
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 2. If user IS authenticated
  const dashboardPath = role ? ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] : null;

  // If role is invalid or not mapped, clear session and redirect to login
  if (!dashboardPath) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("role");
    return response;
  }

  // Redirect from root (/) or public routes (/login, /register) to their dashboard
  if (pathname === "/" || PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // 3. Role-based Protection
  // Ensure user can't access other roles' dashboards
  const allDashboardPaths = Object.values(ROLE_ROUTES);
  const isAccessingOtherDashboard = allDashboardPaths.some(
    (path) => pathname.startsWith(path) && !pathname.startsWith(dashboardPath)
  );

  if (isAccessingOtherDashboard) {
    // Redirect back to their own dashboard if they try to peek elsewhere
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
