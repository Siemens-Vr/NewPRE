"use client";

import Link from "next/link";


// const Home= async () =
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Siemens Erp</h1>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Get started
          </button>
        </Link>
      </div>
    </div>
  );
}