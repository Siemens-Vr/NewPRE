"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForbiddenPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown ends
    if (countdown === 0) {
      router.push("/");
    }

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-md"
      >
        <h1 className="text-7xl font-bold text-red-500">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mt-2">
          Your account has not been approved yet. Please contact support.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
                 <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md transition-all"
          >
            Go Back to Login
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Redirecting in {countdown} seconds...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
