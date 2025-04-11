"use client";

import React, { useEffect, useState } from "react";
import ExpenseCard from "@/app/components/project/expenses/ExpenseCard";
import styles from "@/app/styles/project/expenses/Expense.module.css";
import style from '@/app/styles/project/project/project.module.css';
import {FaCar, FaBook, FaUser} from 'react-icons/fa';
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/project/output/navbar/navbar";


const Expenses = () => {
  const params = useParams()
  const searchParams = useSearchParams();
  const [output, setOutput] = useState([]);
  const [phases, setPhases] = useState([]);
  const {uuid, phaseuuid, outputuuid} =params;
  console.log("Params:", params);


  return (
    <div className={style.projectDetails}>
    <div className={style.navbar}>
        <Navbar />
        </div>
    <div className={styles.container}>
    {/* <h2>Expense Categories</h2> */}
    <div className={styles.expenseList}>
      <ExpenseCard name="Transport" icon={<FaCar />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`} />
      <ExpenseCard name="Procurement" icon={<FaBook />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`} />
      {/* <ExpenseCard name="Personnel" icon={<FaUser />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/personnel`} /> */}
    </div>
  </div>
  </div>
);
};

export default Expenses;



