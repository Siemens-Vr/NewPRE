"use client";

import {
createContext,
useState,
useEffect,
useContext,
useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/app/lib/utils/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
// --- STATE AND REFS ---
// Auth state
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [isInitialized, setIsInitialized] = useState(false);

// WebSocket and Activity Tracking state
const [onlineUsers, setOnlineUsers] = useState([]);
const [activityLogs, setActivityLogs] = useState([]);
const [socket, setSocket] = useState(null);
const [isSocketConnected, setIsSocketConnected] = useState(false);
const socketRef = useRef(null);
const reconnectTimeoutRef = useRef(null);

const router = useRouter();

  const ROLE_DASHBOARDS = {
    admin: "/admin/dashboard",
    equipment: "/equipment/dashboard",
    employee: "/employee/dashboard",
    staff: "/staff/dashboard",
    user: "/user/dashboard",
  };

  const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  };

  const setStoredTokens = (accessToken, refreshToken) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshtoken", refreshToken);
    document.cookie = `token=${accessToken}; path=/; secure; samesite=strict; max-age=3600`;
    setAccessToken(accessToken);
  };

  const clearStoredTokens = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setAccessToken(null);
  };

  useEffect(() => {
    const fetchUserProfile = async (token) => {
      if (!token) return null;
      try {
        const { data } = await api.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401) return null;
        clearStoredTokens();
        return null;
      }
    };

    const initializeAuth = async () => {
      try {
        setLoading(true);
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
}, []);

  const login = async (email, password) => {
    try {
      console.log("🚀 Login attempt started");
      setLoading(true);

      const response = await api.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true, skipAuth: true }
      );

      console.log("📡 Response status:", response);
      console.log("📊 Response data:", response.data);

      const { data } = response;

      switch (response.status) {
        case 200: {
          if (data.changePasswordRequired || data.requirePasswordChange) {
            console.log("🔄 Password change required");
            setStoredTokens(data.accessToken, data.refreshToken);
            const decodedToken = jwtDecode(data.accessToken);
            const userId = decodedToken.userId;
            router.push(`/resetPassword/${userId}`);
            return { success: true, requirePasswordChange: true, message: data.message };
          }

          console.log("✅ Login successful!");
          setStoredTokens(data.accessToken, data.refreshToken);
          setUser(data.user);

          const userRole = data.user.role?.toLowerCase();
          if (userRole === "employee" || userRole === "staff") {
            router.push(`/staffs/${data.user.uuid}/profile`);
          } else {
            router.push(ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user);
          }

          return { success: true, message: data.message };
        }

        case 401: {
          console.log("❌ Invalid credentials");
          return { success: false, error: data.message || "Invalid email or password", errorCode: data.error };
        }

        case 202: {
          if (data.approvalRequired) {
            console.log("⚠️ Account approval required");
            router.push("/403");
            return { success: false, error: data.message || "Account approval required", approvalRequired: true, errorCode: data.error };
          }
          return { success: false, error: data.message || "Access denied", errorCode: data.error };
        }

        default: {
          console.error("❌ Unexpected response:", response.status);
          return { success: false, error: data.message || `Request failed with status ${response.status}`, errorCode: data.error };
        }
      }

    } catch (error) {
      console.error("❌ Network error:", error);
      return { success: false, error: "Network error. Please check your connection and try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during server logout:", error);
    } finally {
      clearStoredTokens();
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  const hasRole = (role) => user?.role?.toLowerCase() === role?.toLowerCase();
  const hasAnyRole = (roles) => roles.some(r => r?.toLowerCase() === user?.role?.toLowerCase());
  const getUserDashboard = () => {
    if (!user) return "/login";
    const userRole = user.role.toLowerCase();
    if (userRole === "employee" || userRole === "staff") {
      return `/staffs/${user.uuid}/profile`;
    }
    return ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user;
  };

  const isAuthenticated = Boolean(user && isInitialized && !loading);

  const value = {
    user,
    loading,
    isInitialized,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getUserDashboard,
    isAdmin: hasRole("admin"),
    isEquipment: hasRole("equipment"),
    isEmployee: hasRole("employee"),
    isStaff: hasRole("staff"),
    isUser: hasRole("user"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};

export const useAuth = () => useAuthContext();
