"use client"; 
import { AuthProvider } from "./AuthContext";

export default function ClientProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
