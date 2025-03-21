"use client";

import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import styles from "@/app/styles/signup/signup.module.css";
import { config } from "@/config";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [error, setError] = useState("");
  const [hints, setHints] = useState([]);
  const router = useRouter();
  

 
  // Password Validation
  const validatePassword = (password) => {
    const errors = [];

    if (password.length > 0 && password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (password.length > 0 && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (password.length > 0 && !/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (password.length > 0 && !/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&).");
    }

    return errors;
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setHints(validatePassword(newPassword));
    setPasswordsMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(newConfirmPassword === password);
  };




  const handleSignup = async (e) => {
    e.preventDefault();

    // if (!allValid) {
    //   alert("Password does not meet all requirements!");
    //   return;
    // }
  

    const res = await fetch(`${config.baseURL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, idNumber, dateJoined, email, password,confirmPassword, phoneNumber, gender }),
    });
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    if (res.ok) {
      setDateJoined("")
      alert("Signup successful!");
      router.push("/login");
    } else {
      const data = await res.json()
      console.log(data.message)
      alert(data.message ||"Signup failed! Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={handleSignup} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Phone Number</label>
          <input className={styles.input} type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Gender</label>
          <select className={styles.input} value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>ID Number</label>
          <input type="number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Date Joined</label>
          <input type="date" value={dateJoined} onChange={(e) => setDateJoined(e.target.value)} required className={styles.input} />
        </div>

        <div className={`${styles.inputGroup} ${styles.passwordContainer}`}>
          <label className={styles.label}>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            required
            className={styles.input}
          />
          <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className={`${styles.inputGroup} ${styles.passwordContainer}`}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className={`${styles.input} ${passwordsMatch ? "border-green-500" : "border-red-500"}`}
          />
          <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="text-red-500 text-sm">Passwords do not match!</p>
          )}
        </div>

        {/* Show password hints dynamically */}
        {password.length > 0 && hints.length > 0 && (
            <div style={{color: "red", fontSize: "0.9em", marginTop: "5px"}}>
              {hints.map((hint, index) => (
                  <p key={index}>{hint}</p>
              ))}
            </div>
        )}
        {error && <p style={{color: "red"}}>{error}</p>}

        <button >
          Sign Up
        </button>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
