// utils/token.js
export function isTokenExpired(token) {
    if (!token) return true;
  
    try {
      const base64Url = token.split('.')[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // fix Base64 URL
      const payload = JSON.parse(atob(base64));
  
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000); // current time in seconds
  
      return exp < now; // true if expired
    } catch (e) {
      console.error("Error decoding token:", e);
      return true; // If can't decode, treat as expired
    }
  }
  