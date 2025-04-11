"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation"; 
import styles from "@/app/styles/project/navbar/navbar.module.css"; 

const Navbar = () => {
  const pathname = usePathname(); 
  const params = useParams();
  const { uuid, phaseuuid, outputuuid } = params;
  console.log("Params in parent:", params);

  return (
    <div className={styles.navbar}>
        <div className={styles.brand}>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.navLinks}>
        <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/documents`}>
            <button
              className={pathname.includes("documents") ? styles.active : ""}
            >
              Documents
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses`}>
            <button
              className={pathname.includes("expenses") ? styles.active : ""}
            >
              Expenses
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/report`}>
            <button
              className={pathname.includes("report") ? styles.active : ""}
            >
              Report
            </button>
          </Link>
        </div>
    </div>
  );
};

export default Navbar;
