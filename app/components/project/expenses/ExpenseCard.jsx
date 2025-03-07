"use client";

import React from "react";
import styles from "@/app/styles/project/expenses/ExpenseCard.module.css";
import { useRouter } from "next/navigation";

const ExpenseCard = ({ name, icon, link}) => {
  const router = useRouter();
  const handleClick=()=>{
    if (link){
      router.push(link);
    }
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.icon}>{icon}</div>
      {/* <div className={styles.details}> */}
        <h3>{name}</h3>
      </div>
    // </div>
  );
};

export default ExpenseCard;
