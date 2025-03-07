"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "@/config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({});
  const params = useParams();
  const resetToken = params?.id || null;
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@#$%^&*()_+!~]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    setPasswordsMatch(password.trim() === confirmPassword.trim());
  }, [password, confirmPassword]);

  if (!resetToken) {
    return <p>Loading...</p>;
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!Object.values(passwordValidations).every(Boolean)) {
      toast.error("Password does not meet all requirements.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${config.baseURL}/api/auth/resetPassword/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      setLoading(false);

      if (res.ok) {
        toast.success("Password reset successful. You can now log in.");
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  const togglePassword = (field) => {
    if (field === "password") setShowPassword(!showPassword);
    if (field === "confirmPassword") setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Reset Password</h1>
      <form onSubmit={handlePasswordReset} className="bg-white p-6 rounded-lg shadow-md w-80">
        <div className="mb-4 relative">
          <label className="block text-gray-700">New Password</label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              onClick={() => togglePassword("password")}
              className="absolute right-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Confirm Password</label>
          <div className="flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              onClick={() => togglePassword("confirmPassword")}
              className="absolute right-3 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="text-red-500 text-sm">Passwords do not match!</p>
          )}
        </div>

        <div className="text-sm mb-4">
          <p className="text-gray-700">Password must contain:</p>
          <ul className="list-disc pl-5">
            <li className={passwordValidations.length ? "text-green-600" : "text-red-600"}>At least 8 characters</li>
            <li className={passwordValidations.uppercase ? "text-green-600" : "text-red-600"}>One uppercase letter</li>
            <li className={passwordValidations.lowercase ? "text-green-600" : "text-red-600"}>One lowercase letter</li>
            <li className={passwordValidations.number ? "text-green-600" : "text-red-600"}>One number</li>
            <li className={passwordValidations.specialChar ? "text-green-600" : "text-red-600"}>One special character</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
