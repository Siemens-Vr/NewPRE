// utils/auth.js

export async function refreshAccessToken() {
    try {
      const res = await fetch("https://vml-erp-api.dkut.ac.ke/api/auth/refresh-token", {
      // const res = await fetch("https://backenderp-u19m.onrender.com/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // very important to include cookies
      });
  
      if (!res.ok) throw new Error("Refresh failed");
  
      const data = await res.json();
      return data.accessToken; // your backend should send this
    } catch (err) {
      console.error("Unable to refresh token:", err);
      return null;
    }
  }
  // await api.get("/api/public/endpoint", { skipAuth: true });