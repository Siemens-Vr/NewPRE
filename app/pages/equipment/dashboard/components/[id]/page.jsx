"use client";
import React, { useEffect, useState } from 'react';
import styles from '@/app/styles/components/singleComponent/singlecomponent.module.css';
import Search from '@/app/components/search/search';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AddBorrow from '@/app/components/Borrow/borrow';

import { MdSearch} from "react-icons/md";


import { config } from '/config';

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
  const [borrow,setAddBorrow]=useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${config.baseURL}/components/components/${componentsType}${q ? `?q=${q}` : ''}`;
        // console.log('Fetching URL:', url);
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

  // Separate components into three categories
  const componentsWithPartNumbers = components.filter(component => component.partNumber);
  const componentsWithoutPartNumbers = components.filter(component => !component.partNumber);

  // For component types that have both parts with and without part numbers
  const componentTypesWithBoth = componentsWithPartNumbers.some(comp => componentsWithoutPartNumbers.find(comp2 => comp.componentType === comp2.componentType));

  const handleAddQuantity = (component) => {
    setSelectedComponent(component);
    setShowPopup(true);
  };

  const handleSubmitQuantity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/components/${selectedComponent.uuid}/update-quantity`, {
        method: 'PATCH',
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
    <div>
      {componentsWithoutPartNumbers.length > 0 && (

    
    <div className={styles.container}>

      {/* <div className={styles.top}>
        <Search placeholder="Search components" />
      </div> */}

      <div className={styles.search}>
          <input type="text" placeholder="Search..." className={styles.input} />
           <MdSearch />
         </div>
  
 
        {/* Components without Part Numbers */}
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <td>No.</td>
                <td>Component Name</td>
                <td>Category</td>
                <td>Total Quantity</td>
                <td>Remaining Quantity</td>
                <td>Borrowed Quantity</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {componentsWithoutPartNumbers.map((component, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{component.componentName}</td>
                  <td>{component.componentType}</td>
                  <td>{component.totalQuantity}</td>
                  <td>{component.remainingQuantity}</td>
                  <td>{component.borrowedQuantity}</td>
                  <td className={styles.buttons}>
                  <Link href={`/pages/equipment/dashboard/components/single/${component.uuid}`}>
                      {/* <button className={styles.button}>View</button> */}
                    </Link>
                    <button className={styles.button} onClick={() => handleAddQuantity(component)}>
                      AddQ
                    </button>
                    {/* <Link href={`/pages/equipment/dashboard/borrow/add?id=${component.uuid}`}>
                      <button className={styles.button}>Borrow</button>
                    </Link>    */}

                     {/* Added a pop up button */}
                    <button onClick={() => setAddBorrow(true)} className={styles.addButton}>Borrow</button>
                    
                   
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </>
     


    
    </div>
  )}
  
  {componentsWithPartNumbers.length > 0 && (
    <div className={styles.container}>

      {/* <div className={styles.top}>
        <Search placeholder="Search components" />
      </div> */}

      <div className={styles.search}>
          <input type="text" placeholder="Search..." className={styles.input} />
          <MdSearch />
        </div>

      {/* Components with Part Numbers */}
      
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <td>No.</td>
                <td>Component Name</td>
                <td>Part Number</td>
                <td>Category</td>
                <td>Status</td>
                <td>Condition</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {componentsWithPartNumbers.map((component, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{component.componentName}</td>
                  <td>{component.partNumber}</td>
                  <td>{component.componentType}</td>
                  <td>
                    <span className={`${styles.badgePill} ${component.status ? styles.greenPill : styles.redPill}`}>
                      {component.status ? 'Borrowed' : 'Not Borrowed'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badgePill} ${component.condition ? styles.greenPill : styles.redPill}`}>
                      {component.condition ? 'Not Okay' : 'Okay'}
                    </span>
                  </td>
                  <td className={styles.buttons}>
                    <Link href={`/pages/equipment/dashboard/components/single/${component.uuid}`}>
                      <button className={styles.button}>View</button>
                    </Link> 
                    {/* <Link href={`/pages/equipment/dashboard/borrow/add?id=${component.uuid}`}>
                      <button className={styles.button}>Borrow</button>
                    </Link> */}
                           
                    {/* Added a pop up button        */}
                   <button onClick={() => setAddBorrow(true)} className={styles.addButton}>Borrow</button>
                    
 
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
    
    </div>
      )}

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


      {borrow && (
        <AddBorrow        
          onClose={() => setAddBorrow(false)}         
        />
      )}

    </div>
  );
};

export default SingleComponentPage;
