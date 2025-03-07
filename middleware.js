import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/", "/signup", "/forgotPassword", "/403"];
  const dynamicPublicRoutes = [/^\/resetPassword\/[a-f0-9\-]+$/i];

  const ROLE_DASHBOARDS = {
    admin: "/pages/admin/dashboard",
    equipment: "/pages/equipment/dashboard",
    employee: "/pages/employee/dashboard",
    user: "/pages/user/dashboard",
  };

  // Allow Public Routes
  if (
    publicRoutes.includes(pathname) ||
    dynamicPublicRoutes.some((route) => route.test(pathname))
  ) {
    return NextResponse.next();
  }

  // If No Token, Redirect to Login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.decode(token);
    // console.log(decoded);

    // Normalize Role to Lowercase
    decoded.role = decoded.role.toLowerCase();

    // Redirect Already Logged-in Users
    if (publicRoutes.includes(pathname) && decoded) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[decoded.role] || "/pages/admin/dashboard", request.url));
    }

    // Block Unauthorized Roles from Admin Pages
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  } catch (error) {
    console.error("Invalid Token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\..*).*)"],
};
