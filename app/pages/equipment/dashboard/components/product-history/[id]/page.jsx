"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/app/styles/components/productHistory/productHistory.module.css'
import { config } from '/config';



const ProductHistory = () => {
  const { id } = useParams();
  const [productHistory, setProductHistory] = useState([]);
  const [componentDetails, setComponentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    const fetchProductHistory = async () => {
      try {
        const response = await fetch(`${config.baseURL}/components/${id}/history`);
        if (response.ok) {
          const data = await response.json();
          setProductHistory(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch product history:", errorData);
          setError(`Failed to fetch product history: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching product history:", error);
        setError(`Error fetching product history: ${error.message}`);
      }
    };

    const fetchComponentDetails = async () => {
      try {
        const response = await fetch(`${config.baseURL}/components/${id}`);
        if (response.ok) {
          const data = await response.json();
          setComponentDetails(data);
        } else {
          console.error("Failed to fetch component details");
          setError("Failed to fetch component details");
        }
      } catch (error) {
        console.error("Error fetching component details", error);
        setError(`Error fetching component details: ${error.message}`);
      }
    };

    const fetchData = async () => {
      await fetchProductHistory();
      await fetchComponentDetails();
      setLoading(false);  // Set loading to false after both fetches are done
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;  // Add a loader or message while loading
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Product History</h1>
      {componentDetails && (
        <>
        
 
        <div className={styles.componentDetails}>
        
          <p>Name: {componentDetails.componentName}</p>
          <p>Part Number: {componentDetails.partNumber}</p>
          <p>Type: {componentDetails.componentType}</p>
        </div>
        </>
      )}
      {productHistory.length > 0 ? (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Action</th>
              <th>Quantity Change</th>
              <th>New Total Quantity</th>
              <th>Status</th>
              <th>Condition</th>  {/* Add missing headers */}
            </tr>
          </thead>
          <tbody>
            {productHistory.map((record, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                <td>{record.action}</td>
                <td>{record.quantityChange}</td>
                <td>{record.newTotalQuantity}</td>
                <td>{record.status ? 'Active' : 'Inactive'}</td>  {/* Adjust status display */}
                <td>{record.condition ? 'Good' : 'Poor'}</td>  {/* Adjust condition display */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No history available for this product.</p>
      )}
    </div>
  );
};

export default ProductHistory;
