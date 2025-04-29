"use client";

import styles from "@/app/styles/components/components.module.css";
import CategoriesPopUp from "@/app/components/categories/categories";
import AddComponent from "@/app/components/component/component";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import api from "@/app/lib/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const { q } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [component, setAddComponent] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Fetch Components Data
  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const url = `/components${q ? `?q=${q}` : ""}`;
        const response = await api.get(url);
        if (response.status === 200) {
          const data = response.data;
          setComponents(data);
          setFilteredComponents(data);
          setNoResults(data.length === 0);
        } else {
          toast.error("Failed to fetch component types");
        }
      } catch (error) {
        console.error("Error fetching component types:", error);
        if (error.response && error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred while fetching components.");
        }
        setNoResults(true);
      }
    };

    fetchComponentData();
  }, [q]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredComponents(components);
      setNoResults(components.length === 0);
    } else {
      const filtered = components.filter((comp) =>
        comp.componentType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredComponents(filtered);
      setNoResults(filtered.length === 0);
    }
  }, [searchQuery, components]);

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className={styles.top}>
        <div className={styles.Search}>
          <MdSearch />
          <input
            type="text"
            placeholder="Search by Category..."
            className={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.btn}>
          <button onClick={() => setShowPopup(true)} className={styles.addButton}>
            Add Categories
          </button>
          <button onClick={() => setAddComponent(true)} className={styles.addButton}>
            Add New
          </button>
        </div>
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
          {noResults ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No components found
              </td>
            </tr>
          ) : (
            filteredComponents.map((component, index) => (
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
            ))
          )}
        </tbody>
      </table>

      {showPopup && <CategoriesPopUp onClose={() => setShowPopup(false)} />}
      {component && <AddComponent onClose={() => setAddComponent(false)} />}
    </div>
  );
};

export default Page;
