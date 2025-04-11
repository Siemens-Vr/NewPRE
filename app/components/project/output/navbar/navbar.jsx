"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation"; 
import styles from "@/app/styles/project/navbar/navbar.module.css"; 

const Navbar = ({ outputName }) => {
  const pathname = usePathname(); 
  const params = useParams();
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Go to the previous page
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.top}>
        <h1>{outputName}</h1>
      </div>
     
        {/* Back Button (Left Side) */}
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <div className={styles.navbarPage}>
        {/* Navigation Links (Right Side) */}
        <div className={styles.navLinks}>
          <Link href={`/pages/project/dashboard/${params.uuid}/dashboard/phases/${params.phaseuuid}/dashboard/${params.outputuuid}/documents`}>
            <button className={pathname.includes("documents") ? styles.active : ""}>
              Documents
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${params.uuid}/dashboard/phases/${params.phaseuuid}/dashboard/${params.outputuuid}/expenses`}>
            <button className={pathname.includes("expenses") ? styles.active : ""}>
              Expenses
            </button>
          </Link>

          <Link href={`/pages/project/dashboard/${params.uuid}/dashboard/phases/${params.phaseuuid}/dashboard/${params.outputuuid}/report`}>
            <button className={pathname.includes("report") ? styles.active : ""}>
              Report
            </button>
          </Link>
        </div>
        </div>
      </nav>
    
  );
};

export default Navbar;
