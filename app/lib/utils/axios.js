// utils/axios.js
import axios from "axios";
import { refreshAccessToken } from "./auth";
require('dotenv').config();

let accessToken = null;

export const setAccessToken = (token) => {
    console.log("✅ Access token set:", token); // DEBUG

  accessToken = token;
};

const api = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:10600",
  withCredentials: true, // required for cookies
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("📦 Request with token:", config.headers.Authorization); // DEBUG
      } else {
        console.log("⚠️ No access token set in interceptor");
      }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        accessToken = newToken;
        err.config.headers.Authorization = `Bearer ${newToken}`;
        return api(err.config); // retry the failed request
      }
    }
    return Promise.reject(err);
  }
);

export default api;
