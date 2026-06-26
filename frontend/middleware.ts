import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/history", "/profile", "/interviews", "/support", "/settings"];
const authRoutes = ["/login", "/signup"];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const hasValidToken = token && token !== "none";
  const { pathname } = request.nextUrl;

  if (matchesRoute(pathname, protectedRoutes) && !hasValidToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (matchesRoute(pathname, authRoutes) && hasValidToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/profile/:path*", "/interviews/:path*", "/support", "/settings", "/login", "/signup"],
};
