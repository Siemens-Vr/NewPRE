 

"use client";
import styles from '@/app/styles/components/add/addComponent.module.css';
import UpdatePopUp from '@/app/components/update/update';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/utils/axios';
import { config } from '/config';

const EditComponent = () => {
  const params = useParams();
  const id = params.id;

  const [showPopup, setShowPopup] = useState(false);
  const [showConditionDetails, setShowConditionDetails] = useState(false); 
  const [component, setComponent] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get(`${config.baseURL}/components/${id}`);
      if (response.statusText === 'OK') {
        const data =  response.data;
        setComponent(data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.log("An error occurred when fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComponentUpdate = async (updatedData) => {
    try {
      const response = await fetch(`${config.baseURL}/components/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await fetchData();
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update component:', errorData);
      }
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  return (
    <>
      <div className={styles.historyButtons}>
        <Link href={`/pages/equipment/dashboard/components/borrow-history/${id}`}>
          <button className={styles.historyButton}>View Borrow History</button>
        </Link>
        <Link href={`/pages/equipment/dashboard/components/product-history/${id}`}>
          <button className={styles.historyButton}>View Product History</button>
        </Link>
      </div>

      <div className={styles.container1}>
        <div className={styles.componentInfo}>
          {component ? (
            <>

            <div className={styles.components}>

            <h2 className={styles.h3}>Component Information</h2>
              <div className={styles.component}>
                <p>Component Name: <span>{component.componentName}</span></p>
                <p>Category: <span>{component.componentType}</span></p>
                <p>Model Number: <span>{component.modelNumber || "N/A"}</span></p>
                <p>Serial Number: <span>{component.partNumber}</span></p>
                <p>Description: <span>{component.description || "No description"}</span></p>
                <button onClick={() => { setShowPopup(true); setShowConditionDetails(false); }} className={styles.button}>
                  Update
                </button>
              </div>
              </div>

             <div className={styles.detail}>
             <h2 className={styles.h2}>Component Condition</h2>
              <div className={styles.details}>
                 <p>Condition: <span>{component.condition === null ? "N/A" : component.condition ? "Good" : "Not Good"}</span></p>
                <p>Condition Details: <span>{component.conditionDetails || "N/A"}</span></p>
                <button onClick={() => { setShowPopup(true); setShowConditionDetails(true); }} className={styles.buttonUpdate}>
                  Update Condition Details
                </button>
              </div>
              </div>
            </>
          ) : (
            <p>Loading.....</p>
          )}
        </div>

        {showPopup && (
          <UpdatePopUp
            componentData={component}
            onClose={() => setShowPopup(false)}
            onUpdate={handleComponentUpdate}
            showConditionDetails={showConditionDetails} // Pass as prop
          />
        )}
      </div>
    </>
  );
};

export default EditComponent;

