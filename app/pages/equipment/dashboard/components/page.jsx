 
"use client";

import styles from "@/app/styles/components/components.module.css";
import CategoriesPopUp from "@/app/components/categories/categories";
import AddComponent from "@/app/components/component/component";
import Search from "@/app/components/search/search";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { config } from "/config";

const Page = () => {
  const [components, setComponents] = useState([]); // Holds all fetched components
  const [filteredComponents, setFilteredComponents] = useState([]); // Holds filtered components
  const { q } = useParams();
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [showPopup, setShowPopup] = useState(false);
  const [component, setAddComponent] = useState(false);

  // Fetch Components Data
  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const url = `${config.baseURL}/components${q ? `?q=${q}` : ""}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setComponents(data);
          setFilteredComponents(data); // Initialize with all components
        } else {
          console.error("Failed to fetch component types");
        }
      } catch (error) {
        console.error("Error fetching component types:", error);
      }
    };

    fetchComponentData();
  }, [q]);

  // Log the search query to the console
  useEffect(() => {
    console.log("Search Query:", searchQuery);
  }, [searchQuery]);

  // Filter components as the user types
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredComponents(components);
    } else {
      const filtered = components.filter((comp) =>
        comp.componentType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredComponents(filtered);
    }
  }, [searchQuery, components]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1 className={styles.h2}>Components</h1>

        <Suspense fallback={<div>Loading...</div>} className={styles.suspense}>
          <Search
            placeholder="Search by Category"
            onChange={(e) => {
              console.log("Search Query:", e.target.value); // Logs search query
              setSearchQuery(e.target.value);
            }}
          />
        </Suspense>

        <button onClick={() => setShowPopup(true)} className={styles.addButton}>
          Add Categories
        </button>
        <button onClick={() => setAddComponent(true)} className={styles.addButton}>
          Add New
        </button>
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
          {filteredComponents.map((component, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{component.componentType}</td>
              <td>{component.totalQuantity}</td>
              <td>
                <span className={`${styles.badge} ${component.totalQuantity > 0 ? styles.inStock : styles.outOfStock}`}>
                  {component.totalQuantity > 0 ? "In Stock" : "Out of Stock"}
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

      {showPopup && <CategoriesPopUp onClose={() => setShowPopup(false)} />}
      {component && <AddComponent onClose={() => setAddComponent(false)} />}
    </div>
  );
};

export default Page;
