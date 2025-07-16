// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/", "/signup", "/forgotPassword", "/403"];
  const dynamicPublicRoutes = [/^\/resetPassword\/[a-f0-9\-]+$/i];
  
  // Role-based dashboard mappings (consistent with your AuthContext)
  const ROLE_DASHBOARDS = {
    admin: "/admin/dashboard",
    equipment: "/equipment/dashboard",
    employee: "/employee/dashboard", 
    staff: "/staff/dashboard",
    user: "/user/dashboard"
  };
  
  // Route permissions - which roles can access which route prefixes
  const ROUTE_PERMISSIONS = {
    "/admin": ["admin"],
    "/equipment": ["equipment", "admin"],
    "/employee": ["employee", "admin"],
    "/staff": ["staff", "admin"],
    "/user": ["user", "admin"],
    "/staffs": ["employee", "staff", "admin"], // Your special staff profile routes
  };
  
  // Helper function to check if route is public
  const isPublicRoute = (path) => {
    return publicRoutes.includes(path) || 
           dynamicPublicRoutes.some((route) => route.test(path));
  };
  
  // Helper function to check route permissions
  const hasRouteAccess = (path, userRole) => {
    // Check each route prefix
    for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (path.startsWith(routePrefix)) {
        return allowedRoles.includes(userRole.toLowerCase());
      }
    }
    // If no specific restrictions, allow access
    return true;
  };
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    // If user is already logged in and tries to access login/signup, redirect to dashboard
    if (token && ["/login", "/signup", "/"].includes(pathname)) {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.role) {
          const normalizedRole = decoded.role.toLowerCase();
          
          // Handle special case for employee/staff going to profile
          if (normalizedRole === "employee" || normalizedRole === "staff") {
            return NextResponse.redirect(new URL(`/staffs/${decoded.userId || decoded.uuid}/profile`, request.url));
          }
          
          // Regular dashboard redirect
          const dashboardUrl = ROLE_DASHBOARDS[normalizedRole] || ROLE_DASHBOARDS.user;
          return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
      } catch (error) {
        console.error("Invalid token in middleware:", error);
        // Token is invalid, let them access public routes
      }
    }
    return NextResponse.next();
  }
  
  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  try {
    const decoded = jwt.decode(token);
    
    if (!decoded?.role) {
      throw new Error("No role found in token");
    }
    
    const userRole = decoded.role.toLowerCase();
    
    // Check if user has permission for this route
    if (!hasRouteAccess(pathname, userRole)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    
    // Handle root dashboard redirect based on role
    if (pathname === "/dashboard") {
      if (userRole === "employee" || userRole === "staff") {
        return NextResponse.redirect(new URL(`/staffs/${decoded.userId || decoded.uuid}/profile`, request.url));
      }
      
      const dashboardUrl = ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user;
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    
  } catch (error) {
    console.error("Token validation error:", error);
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)",
  ],
};