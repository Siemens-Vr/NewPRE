require('dotenv').config()

export async function refreshAccessToken() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",    
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Refresh failed");

    const { accessToken } = await res.json();
    return accessToken;
  } catch (err) {
    console.error("Unable to refresh token:", err);
    return null;
  }
}