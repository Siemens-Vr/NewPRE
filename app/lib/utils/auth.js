require('dotenv').config()


export async function refreshAccessToken() {
  try {
    const url =`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`
    console.log(url)
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",    
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(res)

    if (!res.ok) throw new Error("Refresh failed");

    const { accessToken } = await res.json();
    return accessToken;
  } catch (err) {
    console.error("Unable to refresh token:", err);
    return null;
  }
}