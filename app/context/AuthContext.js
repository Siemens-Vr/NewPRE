// app/context/AuthContext.js
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

// Role-based dashboard mappings
const ROLE_DASHBOARDS = {
admin: "/admin/dashboard",
equipment: "/equipment/dashboard",
employee: "/employee/dashboard",
staff: "/staffs/dashboard",
user: "/user/dashboard",
};


let _accessToken = null;

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[2]) : null;
};

const getStoredToken = () => {
  return getCookie('token');
};


const getStoredRefreshToken = () => {
  return getCookie('refreshToken');
};

const setStoredTokens = (accessToken, refreshToken) => {
  if (typeof window === 'undefined') return;

  // 1 hour for accessToken
  document.cookie = [
    `token=${encodeURIComponent(accessToken)}`,
    `path=/`,
    `secure`,
    `samesite=strict`,
    `max-age=${60 * 60}`
  ].join('; ');

  document.cookie = [
    `refreshToken=${encodeURIComponent(refreshToken)}`,
    `path=/`,
    `secure`,
    `samesite=strict`,
    `max-age=${7 * 24 * 60 * 60}`
  ].join('; ');

  _accessToken = accessToken;
};

/** Clear both cookies and the in-memory access token */
const clearStoredTokens = () => {
  if (typeof window === 'undefined') return;

  document.cookie = [
    `token=`,
    `path=/`,
    `expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ].join('; ');

  document.cookie = [
    `refreshToken=`,
    `path=/`,
    `expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ].join('; ');

  _accessToken = null;
};

// --- DATA FETCHING ---
const fetchUserProfile = async (token) => {
if (!token) return null;
try {
const { data } = await api.get(`/api/auth/profile`, {
headers: { Authorization: `Bearer ${token}` },
});
return data;
} catch (error) {
console.error("Error fetching user profile:", error);
if (error.response?.status !== 401) {
clearStoredTokens();
}
return null;
}
};

// --- WEBSOCKET MANAGEMENT ---
const connectWebSocket = () => {
try {
const token = getStoredToken();
if (!token || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) return;

// const wsUrl = `ws://localhost:10600/ws?token=${token}`;
const wsUrl = `wss://vml-erp-api.dkut.ac.ke/ws?token=${token}`;
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
// console.log("🔌 WebSocket connected");
setIsSocketConnected(true);
setSocket(ws);
socketRef.current = ws;
if (reconnectTimeoutRef.current) {
clearTimeout(reconnectTimeoutRef.current);
}
sendSocketMessage({
type: "ACTIVITY_UPDATE",
payload: { status: "online", currentPage: window.location.pathname },
});
};

ws.onmessage = (event) => {
try {
const data = JSON.parse(event.data);
handleSocketMessage(data);
} catch (error) {
console.error("Error parsing WebSocket message:", error);
}
};

ws.onclose = () => {
// console.log("🔌 WebSocket disconnected");
setIsSocketConnected(false);
setSocket(null);
socketRef.current = null;
if (user && isAuthenticated) {
reconnectTimeoutRef.current = setTimeout(() => {
console.log("🔄 Attempting to reconnect WebSocket...");
connectWebSocket();
}, 3000);
}
};

ws.onerror = (error) => console.error("WebSocket error:", error);
} catch (error) {
console.error("Error connecting WebSocket:", error);
}
};

const disconnectWebSocket = () => {
if (reconnectTimeoutRef.current) {
clearTimeout(reconnectTimeoutRef.current);
}
if (socketRef.current) {
socketRef.current.close();
}
setSocket(null);
setIsSocketConnected(false);
socketRef.current = null;
};

const handleSocketMessage = (data) => {
switch (data.type) {
case "CONNECTION_SUCCESS":
console.log("✅ WebSocket connection established");
break;
case "ONLINE_USERS_UPDATE":
setOnlineUsers(data.data || []);
break;
case "ACTIVITY_UPDATE":
// Handle real-time activity updates if needed
break;
default:
console.log("Unknown WebSocket message:", data);
}
};

const sendSocketMessage = (message) => {
if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
socketRef.current.send(JSON.stringify(message));
}
};

// --- LIFECYCLE HOOKS ---
// Check if user is authenticated on initial load
useEffect(() => {
const initializeAuth = async () => {
try {
if (typeof window === "undefined") return;
const token = getStoredToken();
if (!token) return;

const decodedToken = jwtDecode(token);
if (decodedToken.exp < Date.now() / 1000) {
console.log("Token expired, clearing storage");
clearStoredTokens();
return;
}

setAccessToken(token);
const userData = await fetchUserProfile(token);
if (userData) {
setUser(userData);
} else {
clearStoredTokens();
}
} catch (error) {
console.error("Invalid token or auth error:", error);
clearStoredTokens();
} finally {
setLoading(false);
setIsInitialized(true);
}
};

initializeAuth();
}, []);

// Manage WebSocket connection based on auth state
useEffect(() => {
const isAuthenticated = Boolean(user && isInitialized && !loading);
if (isAuthenticated) {
connectWebSocket();
} else {
disconnectWebSocket();
}
return () => {
disconnectWebSocket();
};
}, [user, isInitialized, loading]);

// Track page changes to update activity status
useEffect(() => {
if (!isSocketConnected) return;

const handleRouteChange = () => {
sendSocketMessage({
type: "PAGE_CHANGE",
payload: { page: window.location.pathname },
});
};

window.addEventListener("popstate", handleRouteChange);
handleRouteChange(); // Send initial page

return () => {
window.removeEventListener("popstate", handleRouteChange);
};
}, [isSocketConnected]);

// --- CORE AUTH ACTIONS ---
const login = async (email, password) => {
setLoading(true);
try {
const response = await api.post(`/api/auth/login`, { email, password });
const { data } = response;

if (data.changePasswordRequired) {
setStoredTokens(data.accessToken, data.refreshToken);
const decodedToken = jwtDecode(data.accessToken);
router.push(`/resetPassword/${decodedToken.userId}`);
return { success: true, requirePasswordChange: true, message: data.message };
}

setStoredTokens(data.accessToken, data.refreshToken);
setUser(data.user);

const userRole = data.user.role?.toLowerCase();
const dashboardRoute = ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.user;
router.push(dashboardRoute);
return { success: true, message: data.message };
} catch (error) {
console.error("Login failed:", error);
return {
success: false,
error: error.response?.data?.message || "Login failed. Please try again.",
};
} finally {
setLoading(false);
}
};

const logout = async () => {
setLoading(true);
try {
// Mark user as offline before logging out
sendSocketMessage({
type: "ACTIVITY_UPDATE",
payload: { status: "offline" },
});
disconnectWebSocket();
await api.post("/api/auth/logout");
} catch (error) {
console.error("Error during server logout:", error);
} finally {
clearStoredTokens();
setUser(null);
setOnlineUsers([]);
setActivityLogs([]);
setLoading(false);
router.push("/login");
}
};

// --- ACTIVITY TRACKING ACTIONS ---
const fetchOnlineUsers = async () => {
try {
const response = await api.get("/api/online/users");
setOnlineUsers(response.data.data);
} catch (error) {
console.error("Error fetching online users:", error);
}
};

const fetchActivityLogs = async (filters = {}) => {
try {
const params = new URLSearchParams(filters).toString();
const response = await api.get(`/api/online/activity?${params}`);
setActivityLogs(response.data.data);
return response.data;
} catch (error) {
console.error("Error fetching activity logs:", error);
}
};

const fetchActivitySummary = async (days = 7) => {
try {
const response = await api.get(`/api/online/activity/summary?days=${days}`);
return response.data.data;
} catch (error) {
console.error("Error fetching activity summary:", error);
}
};

// --- HELPERS AND CONTEXT VALUE ---
const hasRole = (role) => user?.role?.toLowerCase() === role?.toLowerCase();
const hasAnyRole = (roles) => roles.some((role) => hasRole(role));
const isAuthenticated = Boolean(user && isInitialized && !loading);

const value = {
// State
user,
loading,
isInitialized,
isAuthenticated,
onlineUsers,
activityLogs,
isSocketConnected,

// Actions
login,
logout,
fetchOnlineUsers,
fetchActivityLogs,
fetchActivitySummary,
sendSocketMessage,

// Helpers
hasRole,
hasAnyRole,
isAdmin: hasRole("admin"),
isEquipment: hasRole("equipment"),
isEmployee: hasRole("employee"),
isStaff: hasRole("staff"),
isUser: hasRole("user"),
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- CUSTOM HOOKS ---
export const useAuthContext = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error("useAuthContext must be used within an AuthProvider");
}
return context;
};

export const useAuth = () => useAuthContext();