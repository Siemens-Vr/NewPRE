// components/Navbar.js
"use client";
import React from "react";
import Link from "next/link";
import styles from "@/app/styles/project/navbar/navbar.module.css"; // Create a CSS module for the Navbar styles

const Navbar = ({ projectID,projectName, onSectionChange, activeSection }) => {
  
  return (
    <div className={styles.navbarPage}>
      <div className={styles.top}>
        <h1>{projectName}</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.navLinks}>
          
           <Link href={`/pages/project/dashboard/${projectID}/dashboard/phases`}>
          <button
            className="">
            Milestones
          </button>

          </Link>
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/documents`}>
            <button
              className="">
              Documents
            </button>
          </Link>
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/deliverables`}>
          <button
            className="">
            Deliverables
          </button>
          </Link>
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/assignees`}>
          <button
            className="">
            Assignees
          </button>

          </Link>
      
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/expenses`}>
          <button
            className="">
            Expenses
          </button>

          </Link>
      
          <Link href={`/pages/project/dashboard/${projectID}/dashboard/report`}>
          <button
            className="">
            Report
          </button>

          </Link>
          {/* <button
            className={activeSection === "calendar" ? styles.active : ""}
            onClick={() => onSectionChange("calendar")}
          >
            Calendar
          </button> */}
        </div>
    </nav>
    </div>
  );
};

export default Navbar;
