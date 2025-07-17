// utils/axios.js
import axios from "axios";
import { refreshAccessToken } from "./auth";
import { isTokenExpired } from "./token"; 
require('dotenv').config();

let accessToken = null;

export const setAccessToken = (token) => {
    // console.log("✅ Access token set:", token); 

  accessToken = token;
};

const api = axios.create({
  baseURL: process.env.BASE_URL || "https://vml-erp-api.dkut.ac.ke",
  withCredentials: true, 
  
});


api.interceptors.request.use(async (config) => {
   
    if (config.skipAuth) return config;
    if (!accessToken || isTokenExpired(accessToken)) {
    console.log("⚠️ No access token set in interceptor - getting a new one first");

    const newToken = await refreshAccessToken();
    if (newToken) {
      accessToken = newToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
      // console.log("📦 Obtained new token before request:", config.headers.Authorization);
    } else {
      console.log("❌ Failed to obtain token before request");
      // You could decide to continue anyway or reject the request here
    }
  } else {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // console.log("📦 Request with token:", config.headers.Authorization);
  }
  // console.log("Request config", config)
  return config;
}, (error) => {
  return Promise.reject(error);
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
