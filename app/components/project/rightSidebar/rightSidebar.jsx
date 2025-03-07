// components/RightSidebar.js
"use client";
import React from "react";
import styles from "@/app/styles/project/rightSideBar/rightSideBar.module.css";

const RightSidebar = ({ budget, funding }) => {
  return (
    <div className={styles.rightSidebar}>
      <div className={styles.budgetCard}>
        <h3>Budget and Funding</h3>
        <p>
          <strong>Budget:</strong> ${budget}
        </p>
        <p>
          <strong>Funding:</strong> ${funding}
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;
