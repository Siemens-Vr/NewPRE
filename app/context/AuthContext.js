// app/context/AuthContext.js
"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/app/lib/utils/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Role-based dashboard mappings (consistent with middleware)
  const ROLE_DASHBOARDS = {
    admin: "/admin/dashboard",
    equipment: "/equipment/dashboard",
    employee: "/employee/dashboard",
    staff: "/staff/dashboard",
    user: "/user/dashboard"
  };

  // Token management functions
  const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  };

  const setStoredTokens = (accessToken, refreshToken) => {
    if (typeof window === 'undefined') return;
    
    // Store tokens
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshtoken", refreshToken);
    
    // Store in HTTP-only cookie
    document.cookie = `token=${accessToken}; path=/; secure; samesite=strict; max-age=3600`;
    
    // Set in axios instance
    setAccessToken(accessToken);
  };

  const clearStoredTokens = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    
    // Clear cookie
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Clear axios token
    setAccessToken(null);
  };




  useEffect(() => {
    // 1. Define fetchUserProfile *inside* the effect
    const fetchUserProfile = async (token) => {
      if (!token) return null;
      try {
        const { data } = await api.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If 401, token expired: bail out
        if (error.response?.status === 401) {
          return null;
        }
        // Other errors: clear tokens
        clearStoredTokens();
        return null;
      }
    };
  
    // 2. Run your initializer exactly once
    const initializeAuth = async () => {
      try {
        setLoading(true);
  
        // Client-only
        if (typeof window === 'undefined') {
          setLoading(false);
          setIsInitialized(true);
          return;
        }
  
        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          setIsInitialized(true);
          return;
        }
  
        // Validate JWT expiry
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            clearStoredTokens();
            setLoading(false);
            setIsInitialized(true);
            return;
          }
        } catch {
          clearStoredTokens();
          setLoading(false);
          setIsInitialized(true);
          return;
        }
  
        // Token ok → set axios header & fetch profile
        setAccessToken(token);
        const userData = await fetchUserProfile(token);
        if (userData) {
          setUser(userData);
        } else {
          clearStoredTokens();
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        clearStoredTokens();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
  
    initializeAuth();
  }, []);  // <- no missing deps anymore
  

  // Enhanced login function based on your current implementation
  const login = async (email, password) => {
  try {
    console.log("🚀 Login attempt started");
    setLoading(true);
    
    const response = await api.post(`/api/auth/login`, {
      email,
      password,
    }, {
      withCredentials: true,
      skipAuth: true,
    });
    
    console.log("📡 Response status:", response);
    console.log("📊 Response data:", response.data);
    
    const { data } = response;
    
    // Handle different response scenarios
    switch (response.status) {
      case 200:
        // Success cases
        if (data.changePasswordRequired || data.requirePasswordChange) {
          console.log("🔄 Password change required");
          
          // Store tokens even for password change
          setStoredTokens(data.accessToken, data.refreshToken);
          
          // Decode token to get user info
          const decodedToken = jwtDecode(data.accessToken);
          const userId = decodedToken.userId;
          
          router.push(`/resetPassword/${userId}`);
          return { 
            success: true, 
            requirePasswordChange: true,
            message: data.message 
          };
        }
        
        // Normal successful login
        console.log("✅ Login successful!");
        
        // Store tokens
        setStoredTokens(data.accessToken, data.refreshToken);
        
        // Set user data
        setUser(data.user);
        
        // Role-based redirection
        const userRole = data.user.role?.toLowerCase();
        console.log("🎭 User role:", userRole);
        
        if (userRole === "employee" || userRole === "staff") {
          const profileUrl = `/staffs/${data.user.uuid}/profile`;
          console.log("👥 Redirecting to profile:", profileUrl);
          router.push(profileUrl);
        } else {
          const dashboardRoute = ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user;
          console.log("📊 Redirecting to dashboard:", dashboardRoute);
          router.push(dashboardRoute);
        }
        
        return { 
          success: true,
          message: data.message 
        };
        
      case 401:
        // Invalid credentials
        console.log("❌ Invalid credentials");
        return {
          success: false,
          error: data.message || "Invalid email or password",
          errorCode: data.error
        };
        
      case 202:
        // Account approval required
        if (data.approvalRequired) {
          console.log("⚠️ Account approval required");
          router.push("/403");
          return { 
            success: false, 
            error: data.message || "Account approval required",
            approvalRequired: true,
            errorCode: data.error
          };
        }
        
        // Other 403 errors
        return {
          success: false,
          error: data.message || "Access denied",
          errorCode: data.error
        };
        
      default:
        // Other errors
        console.error("❌ Unexpected response:", response.status);
        return {
          success: false,
          error: data.message || `Request failed with status ${response.status}`,
          errorCode: data.error
        };
    }
    
  } catch (error) {
    console.error("❌ Network error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  } finally {
    setLoading(false);
  }
};

  // Enhanced logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call server logout to invalidate refresh token
      await api.post("/api/auth/logout", {}, { 
        withCredentials: true,
        // Don't skip auth here so the token gets sent
      });
    } catch (error) {
      console.error("Error during server logout:", error);
      // Continue with local cleanup even if server call fails
    } finally {
      // Always clear local storage and state
      clearStoredTokens();
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  // Helper functions for role checking
  const hasRole = (role) => {
    if (!user) return false;
    return user.role?.toLowerCase() === role?.toLowerCase();
  };

  const hasAnyRole = (roles) => {
    if (!user || !Array.isArray(roles)) return false;
    const userRole = user.role?.toLowerCase();
    return roles.some(role => role?.toLowerCase() === userRole);
  };

  // Get appropriate dashboard URL for user
  const getUserDashboard = () => {
    if (!user) return "/login";
    
    const userRole = user.role?.toLowerCase();
    
    // Handle special employee/staff routing
    if (userRole === "employee" || userRole === "staff") {
      return `/staffs/${user.uuid}/profile`;
    }
    
    return ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user;
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(user && isInitialized && !loading);

  // Context value
  const value = {
    // State
    user,
    loading,
    isInitialized,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    
    // Helpers
    hasRole,
    hasAnyRole,
    getUserDashboard,
    
    // Role checks for convenience
    isAdmin: hasRole("admin"),
    isEquipment: hasRole("equipment"),
    isEmployee: hasRole("employee"),
    isStaff: hasRole("staff"),
    isUser: hasRole("user"),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// Simple useAuth hook (matches your current usage)
export const useAuth = () => {
  return useAuthContext();
};