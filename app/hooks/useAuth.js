"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/router";
// import AdminDashboard from "../pages/admin/dashboard";

// Define role constants
export const ROLES = {
  ADMIN: 'Admin',
  EQUIPMENT: 'equipment',
  EMPLOYEE: 'employee',
  USER: 'user'
};

// Define dashboard routes for each role
const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: '../pages/admin/dashboard',
  [ROLES.EQUIPMENT]: '/equipment/dashboard',
  [ROLES.EMPLOYEE]: '/employee/dashboard',
  [ROLES.USER]: '/user/dashboard'
};

export default function useAuth(allowedRoles = []) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not authenticated, redirect to login
        router.push("/login");
      } else if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // If user's role is not in allowed roles, redirect to unauthorized
          router.push("/403");
        }
      } else {
        // If no specific roles are required, redirect to appropriate dashboard
        const dashboardRoute = ROLE_DASHBOARDS[user.role];
        if (dashboardRoute && router.pathname === '/login') {
          router.push(dashboardRoute);
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { 
    user, 
    loading,
    isAdmin: user?.role === ROLES.ADMIN,
    isEquipment: user?.role === ROLES.EQUIPMENT,
    isEmployee: user?.role === ROLES.EMPLOYEE,
    isUser: user?.role === ROLES.USER
  };
}