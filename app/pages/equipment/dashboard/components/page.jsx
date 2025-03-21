"use client"
import styles from '@/app/styles/components/components.module.css'
import CategoriesPopUp from '@/app/components/categories/categories'
import Search from '@/app/components/search/search'
import { Suspense } from "react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


import { config } from '/config';


const Page = () => {
  const [components, setComponents] = useState([]);
  const { q } = useParams();
  const [showPopup, setShowPopup] = useState(false); 

  const handleCreateCategory = (category) => {
    // Handle the creation of a new category
    // console.log("New Category Created:", category);
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const url = `${config.baseURL}/components${q ? `?q=${q}` : ''}`;
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          setComponents(data);
        } else {
          console.error('Failed to fetch component types');
        }
      } catch (error) {
        console.error('Error fetching component types:', error);
      }
    };
    fetchComponentData();
  }, [q]);

  const [selectedOption, setSelectedOption] = useState("");

  const sortBy = {
    title: "Sort By",
    options: ["Computers", "Laptops", "Mouse", "Omen", "Robot"],
  };

  return (   

         <div className={styles.container}>

         <div className={styles.top}>
         <h1 className={styles.h2}>Components</h1>

         <select
        id="sort"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className={styles.select}
      >
        <option value="" disabled>Sort by</option>
        {sortBy.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

     {/* <Suspense fallback={<div>Loading...</div>}>
      <Search placeholder="search for components" />
     </Suspense> */}

      <button onClick={() => setShowPopup(true)}   className={styles.addButton}>Add Categories</button>
      
       <Link href="/pages/equipment/dashboard/components/add">
       <button className={styles.addButton}>Add New</button>
      </Link>
    </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>No</td>
            <td>Category</td>
            <td>Total Quantity</td>
            <td>Status</td>
            <td>Action</td>
            
          </tr>
        </thead>
        <tbody>
          {components.map((component, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{component.componentType}</td>
              <td>{component.totalQuantity}</td>
              <td>
                  <span className={`${styles.badge} ${component.totalQuantity > 0 ? styles.inStock : styles.outOfStock}`}>
                    {component.totalQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
              <td>
                <Link href={`/pages/equipment/dashboard/components/${component.componentType}`}>
                  <button className={styles.button}>View</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
      {showPopup && (
        <CategoriesPopUp
        
          onClose={() => setShowPopup(false)}
         
        />
      )}
    </div>
    
  )
}

export default Page;



{/* <div className={styles.top}>
<Suspense fallback={<div>Loading...</div>}>
<Search placeholder="search for components" />


</Suspense>

  <button onClick={() => setShowPopup(true)}   className={styles.addButton}>Add Categories</button>
      
  <Link href="/pages/equipment/dashboard/components/add">
    <button className={styles.addButton}>Add New</button>
  </Link>
</div> */}