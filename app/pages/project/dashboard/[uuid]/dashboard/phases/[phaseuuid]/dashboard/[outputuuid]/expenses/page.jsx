// "use client";
//
// import React, { useEffect, useState } from "react";
// import ExpenseCard from "@/app/components/project/expenses/ExpenseCard";
// import styles from "@/app/styles/project/expenses/Expense.module.css";
// import style from '@/app/styles/project/project/project.module.css';
// import {FaCar, FaBook, FaUser} from 'react-icons/fa';
// import { useParams, useSearchParams } from "next/navigation";
// import Navbar from "@/app/components/project/output/navbar/navbar";
//
//
// const Expenses = () => {
//   const params = useParams()
//   const searchParams = useSearchParams();
//   const [output, setOutput] = useState([]);
//   const [phases, setPhases] = useState([]);
//   const {uuid, phaseuuid, outputuuid} =params;
//   console.log("Params:", params);
//
//
//   return (
//     <div className={style.projectDetails}>
//     <div className={style.navbar}>
//         <Navbar />
//         </div>
//     <div className={styles.container}>
//     {/* <h2>Expense Categories</h2> */}
//     <div className={styles.expenseList}>
//       <ExpenseCard name="Transport" icon={<FaCar />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`} />
//       <ExpenseCard name="Procurement" icon={<FaBook />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`} />
//       {/* <ExpenseCard name="Personnel" icon={<FaUser />} link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/personnel`} /> */}
//     </div>
//   </div>
//   </div>
// );
// };
//
// export default Expenses;
//
//
//
"use client"
import { FaCar, FaBook } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/project/output/navbar/navbar";

const ExpenseCard = ({ name, icon, link }) => {
  return (
      <Link
          href={link}
          className="w-[250px] h-[150px] rounded-xl p-4 flex flex-col justify-between bg-gradient-to-r from-orange-500 to-cyan-600 shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 text-black"
      >
        <div className="text-4xl">{icon}</div>
        <div className="font-semibold text-lg">{name}</div>
        <div className="flex justify-end items-center space-x-[-8px]">
          <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-80"></div>
          <div className="w-5 h-5 rounded-full bg-rose-500 opacity-80"></div>
        </div>
      </Link>
  );
};

const Expenses = () => {
  const { uuid, phaseuuid, outputuuid } = useParams();

  return (
      <div className="min-h-screen bg-white">
        <div className="mb-6">
          <Navbar />
        </div>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <ExpenseCard
              name="Transport"
              icon={<FaCar />}
              link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`}
          />
          <ExpenseCard
              name="Procurement"
              icon={<FaBook />}
              link={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`}
          />
        </div>
      </div>
  );
};

export default Expenses;
