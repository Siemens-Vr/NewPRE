"use client";
import React, { useEffect, useState } from 'react';
import styles from "../../../ui/dashboard/components/singleComponent/singlecomponent.module.css";
import Search from '@/app/ui/dashboard/search/search';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SingleComponentPage = () => {
  const [components, setComponents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const params = useParams();
  const searchParams = useSearchParams();
  const componentsType = params.id;
  const q = searchParams.get('q');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:4000/components/components/${componentsType}${q ? `?q=${q}` : ''}`;
        console.log('Fetching URL:', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.rows)) {
            setComponents(data.rows);
          } else {
            console.error('Fetched data is not an array');
          }
        } else {
          console.log("Failed to fetch data");
        }
      } catch (error) {
        console.log("An error occurred when fetching data", error);
      }
    };
    fetchData();
  }, [componentsType, q]);

  const hasComponentWithPartNumber = components.some(component => component.componentName && component.partNumber);
  const hasComponentWithoutPartNumber = components.some(component => component.componentName && !component.partNumber);

  const handleAddQuantity = (component) => {
    setSelectedComponent(component);
    setShowPopup(true);
  };

  const handleSubmitQuantity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/components/${selectedComponent.uuid}/update-quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentUUID: selectedComponent.uuid,
          quantity: parseInt(quantityToAdd),
        }),
      });

      if (response.ok) {
        setToastMessage("Quantity updated successfully");
        setToastType("success");
        setShowPopup(false);
        // Refresh the component list
        const updatedComponents = components.map(comp =>
          comp.uuid === selectedComponent.uuid
            ? { ...comp, totalQuantity: comp.totalQuantity + parseInt(quantityToAdd) }
            : comp
        );
        setComponents(updatedComponents);
      } else {
        const errorData = await response.json();
        setToastMessage(`Failed to update quantity: ${errorData.message}`);
        setToastType("error");
      }
    } catch (error) {
      console.log("Error updating quantity", error);
      setToastMessage('An error occurred while updating quantity.');
      setToastType("error");
    } finally {
      setTimeout(() => {
        setToastMessage('');
        setToastType('');
      }, 3000); // Hide the toast after 3 seconds
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search components" />
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <td>No.</td>
            <td>Component Name</td>
            {hasComponentWithPartNumber && <td>Part Number</td>}
            <td>Component Type</td>
            {hasComponentWithoutPartNumber && <td>Quantity</td>}
            {hasComponentWithPartNumber && <td>Status</td>}
            {hasComponentWithPartNumber && <td>Condition</td>}
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {components.map((component, index) => {
            const hasPartNumber = component.componentName && component.partNumber;
            return (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{component.componentName}</td>
                {hasComponentWithPartNumber && <td>{component.partNumber}</td>}
                <td>{component.componentType}</td>
                {!hasPartNumber && <td>{component.totalQuantity}</td>}
                {hasPartNumber && (
                  <td>
                    <span className={`${styles.badgePill} ${component.status ? styles.greenPill : styles.redPill}`}>
                      {component.status ? 'Borrowed' : 'Not Borrowed'}
                    </span>
                  </td>
                )}
                {hasPartNumber && (
                  <td>
                    <span className={`${styles.badgePill} ${component.condition ? styles.greenPill : styles.redPill}`}>
                      {component.condition ? 'Okay' : 'Not Okay'}
                    </span>
                  </td>
                )}
                <td className={styles.buttons}>
                  <Link href={`/dashboard/components/add?edit=true&id=${component.uuid}`}>
                    <button className={styles.button}>view</button>
                  </Link>
                  {!hasPartNumber && (
                    <button className={styles.button} onClick={() => handleAddQuantity(component)}>
                      Add Quantity
                    </button>
                  )}
                  {component.quantity === 0 ? (
                    <Link href={`/dashboard/transfer?id=${component.uuid}`}>
                      <button className={styles.button}>Transfer</button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/borrow/add?id=${component.uuid}`}>
                      <button className={styles.button}>Borrow</button>
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Add Quantity for {selectedComponent.componentName}</h2>
            <form onSubmit={handleSubmitQuantity}>
              <input
                type="number"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                placeholder="Quantity to add"
              />
              <div className={styles.buttonContainer}>
                <button type="submit">Add</button>
                <button className={styles.closeButton} onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className={`${styles.toast} ${styles[toastType]} ${toastMessage ? styles.show : styles.hide}`}>
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default SingleComponentPage;
