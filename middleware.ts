import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

const protectedRoutes = ["/account"];

const authRoutes = ["/auth/login", "/auth/forgot-password", "/auth/reset-password"];

const adminRoutes = ["/admin"];

function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route.endsWith("*")) {
      return path.startsWith(route.slice(0, -1));
    }
    return path === route || path.startsWith(`${route}/`);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get session token from cookie
  const token = request.cookies.get("session")?.value;
  let user = null;

  // Verify session if token exists
  if (token) {
    user = await verifySession(token);
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  // Check if current path is protected, auth, or admin route
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);
  const isAdminRoute = matchesRoute(pathname, adminRoutes);

  /**
   * 1. Redirect authenticated users away from auth pages
   */
  if (isAuthenticated && isAuthRoute) {
    // Check for returnUrl in query params
    const returnUrl = searchParams.get("returnUrl");

    if (returnUrl && returnUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    // Default redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  /**
   * 2. Protect admin routes - require ADMIN role
   */
  if (isAdminRoute) {
    if (!isAuthenticated) {
      // Not authenticated - redirect to login with returnUrl
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      // Authenticated but not admin - redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /**
   * 3. Protect user routes - require authentication
   */
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * 4. Allow access to public routes
   */
  return NextResponse.next();
}
