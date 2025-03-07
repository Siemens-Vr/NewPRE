"use client"; 

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '@/app/styles/transactions/transactions.module.css'
import { config } from "/config"; 

const Transactions = () => {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch(`${config.baseURL}/staffs`);
        const data = await response.json();
        setStaffs(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaffs();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Staff</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Phone</td>
            <td>Project</td>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.uuid}>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {`${staff.firstName} ${staff.lastName}`}
                </div>
              </td>
             <td>
          <span className={`${styles.status} ${styles.done}`}>
               Active
              </span>
             </td>
               <td>{staff.phone}</td>
              <td>{staff.project}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
