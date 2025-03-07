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
  const router = useRouter();
  

 
  // Password Validation
  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@#$%^&*()_+!~]/.test(password),
  };

  const allValid = Object.values(passwordValidations).every(Boolean);

    useEffect(() => {
      setPasswordsMatch(password.trim() === confirmPassword.trim());
    }, [password, confirmPassword]);



  const handleSignup = async (e) => {
    e.preventDefault();

    if (!allValid) {
      alert("Password does not meet all requirements!");
      return;
    }
  

    const res = await fetch(`${config.baseURL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, idNumber, dateJoined, email, password,confirmPassword, phoneNumber, gender }),
    });

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
            onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
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

        <p className="text-gray-700">Password must contain:</p>
        <ul className="list-disc pl-5">
          <li className={passwordValidations.length ? "text-green-600" : "text-red-600"}>At least 8 characters</li>
          <li className={passwordValidations.uppercase ? "text-green-600" : "text-red-600"}>At least 1 uppercase letter</li>
          <li className={passwordValidations.lowercase ? "text-green-600" : "text-red-600"}>At least 1 lowercase letter</li>
          <li className={passwordValidations.number ? "text-green-600" : "text-red-600"}>At least 1 number</li>
          <li className={passwordValidations.specialChar ? "text-green-600" : "text-red-600"}>At least 1 special character (@#$%^&*)</li>
        </ul>

        <button type="submit" disabled={!allValid || !passwordsMatch} className={`${styles.button} ${!allValid || !passwordsMatch ? "opacity-50 cursor-not-allowed" : ""}`}>
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
