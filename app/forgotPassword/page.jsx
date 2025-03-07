"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import { toast, ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ForgotPassword = () =>  {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${config.baseURL}/api/auth/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setLoading(false);
      setEmail("")

      if (res.ok) {
        toast.success("A password reset link has been sent to your email.");
     
        router.push("/");
      } else {
        const data = await res.json();
        console.log(data)
        toast.error(data.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-center" autoClose={6000} />
      <h1 className="text-3xl  font-bold mb-6 text-gray-700">Forgot Password</h1>
      <form onSubmit={handleResetRequest} className="bg-white p-6 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label className="block text-gray-700">Enter Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
export default ForgotPassword;