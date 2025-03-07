"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/app/styles/components/borrowHistory/borrowHistory.module.css';

import { config } from '/config';

const BorrowHistory = () => {
  const { id } = useParams();
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [componentDetails, setComponentDetails] = useState(null);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const response = await fetch(`${config.baseURL}/borrow?componentUUID=${id}`);
        if (response.ok) {
          const data = await response.json();
          setBorrowHistory(data);
        } else {
          console.log("Failed to fetch borrow history");
        }
      } catch (error) {
        console.log("Error fetching borrow history", error);
      }
    };

    const fetchComponentDetails = async () => {
      try {
        const response = await fetch(`${config.baseURL}/components/${id}`);
        if (response.ok) {
          const data = await response.json();
          setComponentDetails(data);
        } else {
          console.log("Failed to fetch component details");
        }
      } catch (error) {
        console.log("Error fetching component details", error);
      }
    };

    fetchBorrowHistory();
    fetchComponentDetails();
  }, [id]);

 return (
    <div className={styles.container}>
      <h1 className={styles.title}>Borrow History</h1>
      {componentDetails && (
       <div className={styles.componentDetails}>
          <h2>{componentDetails.componentName}</h2>
          <div className={styles.detailsContent}>
            <p><span>Part Number:</span> {componentDetails.partNumber || 'N/A'}</p>
            <p><span>Type:</span> {componentDetails.componentType}</p>
            <p><span>Status:</span> {componentDetails.status ? 'Active' : 'Inactive'}</p>
            <p><span>Condition:</span> {componentDetails.condition ? 'Good' : 'Needs Attention'}</p>
          </div>
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Borrower Name</th>
            <th>Borrower ID</th>
            <th>Department</th>
            <th>Date of Issue</th>
            <th>Expected Return</th>
            <th>Actual Return</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {borrowHistory.map((borrow) => (
            <tr key={borrow.uuid}>
              <td>{borrow.fullName}</td>
              <td>{borrow.borrowerID}</td>
              <td>{borrow.departmentName}</td>
              <td>{new Date(borrow.dateOfIssue).toLocaleDateString()}</td>
              <td>{new Date(borrow.expectedReturnDate).toLocaleDateString()}</td>
              <td>{borrow.actualReturnDate ? new Date(borrow.actualReturnDate).toLocaleDateString() : 'Not returned'}</td>
              <td>{borrow.quantity}</td>
              <td>
                <span className={`${styles.badge} ${borrow.actualReturnDate ? styles.returned : styles.borrowed}`}>
                  {borrow.actualReturnDate ? 'Returned' : 'Borrowed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowHistory;