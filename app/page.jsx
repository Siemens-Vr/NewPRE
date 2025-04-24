"use client";

import Link from "next/link";
import styles from "@/app/styles/landing/landing.module.css";
import heroImage from "@/public/preview.png";
import Image from "next/image";


// const Home= async () =
export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.topCircle}></div>
      <div className={styles.bottomCircle}></div>
      <div className={styles.smallCircle}></div>
      <div className={styles.cloudShape}></div>

      <div className={styles.imageSection}>
        <Image
          src={heroImage}
          alt="ERP illustration"
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.textSection}>
        <h1 className="text-4xl font-extrabold text-black-700">Take Control</h1>
        <h1 className="text-4xl font-extrabold text-black-700">Smarter, Faster</h1>
        <h1 className="text-4xl font-extrabold text-black-700">and <span className="text-orange-500">More Efficient </span>!!</h1>
      
        <Link href="/login">
          <button className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-500 transition">
            GET STARTED
          </button>
        </Link>
      </div>
    </div>
  );
}