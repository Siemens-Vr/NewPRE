"use client";

import React, { useEffect, useState } from 'react';
import styles from '@/app/styles/borrow/borrow.module.css';
import { Suspense } from 'react';
import Link from 'next/link';
import Search from '@/app/components/search/search';

import { config } from '/config';


const BorrowedComponentPage = () => {
  const [borrowsData, setBorrowsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseURL}/borrow`);
        if (response.ok) {
          const data = await response.json();
          setBorrowsData(data);
        } else {
          console.log('Error fetching data');
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
    <div className={styles.container}>
      <div className={styles.top}>
      <Suspense fallback={<div>Loading...</div>}>
   
      <Search />
    </Suspense>
 
        <Link href="/pages/equipment/dashboard/borrow/add">
          <button className={styles.addButton}>Borrow</button>
        </Link>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Component</td>
            <td>Name</td>
            <td>Department</td>
            <td>Borrow Date</td>
            <td>Status</td>
            <td>Return Date</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {borrowsData.map((borrowData, index) => (
            <tr key={index}>
              <td>{borrowData.component.componentName}</td>
              <td>{borrowData.fullName}</td>
              {/* <td>{borrowData.borrowerID}</td> */}
              <td>{borrowData.departmentName}</td>
              <td>{formatDate(borrowData.dateOfIssue)}</td>
              <td>{borrowData.status ? 'Returned' : 'Not Returned'}</td>
              <td>{formatDate(borrowData.expectedReturnDate)}</td>
              <td>  
                <Link href={`/pages/equipment/dashboard/borrow/${borrowData.uuid}`}>
                <button className={styles.updateButton}>Update</button></Link>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
};

export default BorrowedComponentPage;
