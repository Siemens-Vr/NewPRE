"use client";
import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/app/lib/utils/axios";
import { config } from "@/config";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Move router inside the component

  const ROLE_DASHBOARDS = {
    Admin: "/admin/dashboard",
    equipment: "/equipment/dashboard",
    employee: "/employee/dashboard",
    user: "/user/dashboard"
  };


  // Check if user is authenticated on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Only run on client-side
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem("token");
      
          if (!token) {
            setLoading(false);
            return; // Don't redirect automatically, let the protected route handle it
          }
          // console.log(token)
          const { data } = await api.get(`api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log(data)
      
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token"); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };
      
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post(`/api/auth/login`, {
        email,
        password,
      },  {
        withCredentials: true,
        skipAuth: true, 
      });
  
      // console.log(data);
  
      // Store JWT Token in Cookies
      document.cookie = `token=${data.accessToken}; path=/; secure; samesite=strict`;
  
      // Store Token in Local Storage
      setAccessToken(data.accessToken);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshtoken", data.refreshToken);
  
      const decodedToken = jwtDecode(data.accessToken);
      const userId = decodedToken.userId

  
      // // Check if user must change password
      // if (decodedToken.isDefaultPassword) {
      //   router.push(`${decodedToken.userId}/resetPassword`);
      //   return { success: true };
      // }
  
      setUser(data.user);
      // console.log(data.user);
  
       // ✅ Check for staff and redirect to profile
    if (data.user.role === "employee" || data.user.role === "staff") {
      router.push(`/staffs/${data.user.uuid}/profile`);
    } else {
      const dashboardRoute = ROLE_DASHBOARDS[data.user.role] || "/pages/dashboard";
      router.push(dashboardRoute);
    }
  
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data);
  
      // ✅ Automatically Redirect to 403 if Approval is Required
      if (error.response?.data?.approvalRequired) {
        router.push("/403");
        return { success: false };
      }

     if (error.response?.data?.changePasswordRequired) {
      const decodedToken = jwtDecode(error.response.data.accessToken); // Decode token again from the error response
      const userId = decodedToken.userId; // Get userId
      router.push(`resetPassword/${userId}`); // Use dynamic route
      return { success: false };
    }
  
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };
  
  
  

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    setUser(null);
    router.push("/login");
  };

  // Provide a default value for the context
  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};