"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "@/app/styles/login/login.module.css";
import Link from "next/link";


export default function Login() {
  const context = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // If context is null, show loading or error state
  if (!context) {
    return <div>Loading...</div>;
  }

  const { login } = context;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    console.log(result)
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Log In</h1>
      <form onSubmit={handleLogin} className={styles.formContainer}>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md border border-red-400">
          {error}
        </div>
      )}
        {/* Email */}
        <div className="mb-4">
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Password with Eye Icon */}
        <div className={`mb-4 ${styles.relative}`}>
          <label className={styles.label}>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className={styles.button}>
          Log In
        </button>

        <p className={styles.textCenter}>
          Forgot password?{" "}
          <Link href="/forgotPassword" className={styles.link}>
            Reset here
          </Link>
        </p>
        <p className={styles.textCenter}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}