"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Table from "@/app/components/table/Table";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import { config } from "/config";
import UpdatePopUp from "@/app/components/update/update";

export default function ComponentDetail() {
  const { id } = useParams();

  const [component, setComponent] = useState(null);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [productHistory, setProductHistory] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showConditionDetails, setShowConditionDetails] = useState(false);

  // Accordion toggles
  const [borrowExpanded, setBorrowExpanded] = useState(false);
  const [productExpanded, setProductExpanded] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // ——— Column definitions ———
  const borrowColumns = [
    { key: "fullName",       label: "Borrower Name", sortable: true },
    { key: "borrowerID",     label: "Borrower ID",   sortable: true },
    { key: "departmentName", label: "Department",    sortable: true },
    {
      key: "dateOfIssue",
      label: "Date of Issue",
      sortable: true,
      render: r => new Date(r.dateOfIssue).toLocaleDateString(),
    },
    {
      key: "expectedReturnDate",
      label: "Expected Return",
      sortable: true,
      render: r => new Date(r.expectedReturnDate).toLocaleDateString(),
    },
    {
      key: "actualReturnDate",
      label: "Actual Return",
      sortable: true,
      render: r =>
        r.actualReturnDate
          ? new Date(r.actualReturnDate).toLocaleDateString()
          : "Not returned",
    },
    { key: "quantity", label: "Quantity", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: r => (
        <span className={r.actualReturnDate ? styles.returned : styles.borrowed}>
          {r.actualReturnDate ? "Returned" : "Borrowed"}
        </span>
      ),
    },
  ];

  const productColumns = [
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: r => new Date(r.createdAt).toLocaleDateString(),
    },
    { key: "action",         label: "Action",     sortable: true },
    { key: "quantityChange", label: "Qty Change", sortable: true },
    { key: "newTotalQuantity",label: "New Qty",   sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: r => (r.status ? "Active" : "Inactive"),
    },
    {
      key: "condition",
      label: "Condition",
      sortable: true,
      render: r => (r.condition ? "Good" : "Poor"),
    },
  ];

  // ——— Sort helper ———
  const handleSort = (key, setter, data) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
    setter(sorted);
  };

  // ——— Data fetch ———
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [compRes, borrowRes, prodRes] = await Promise.all([
          api.get(`${config.baseURL}/components/${id}`),
          api.get(`${config.baseURL}/borrow?componentUUID=${id}`),
          api.get(`${config.baseURL}/components/${id}/history`),
        ]);
        if (compRes.statusText === "OK")   setComponent(compRes.data);
        if (borrowRes.statusText === "OK") setBorrowHistory(borrowRes.data);
        if (prodRes.statusText === "OK")   setProductHistory(prodRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchAll();
  }, [id]);

  return (
    <div className={styles.container}>
    
      {component && (
        <div className={styles.card}>
          <div className={styles.cardColumn}>
            <h2 className={styles.cardTitle}>Component Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoLabel}>Component Name</div>
              <div className={styles.infoValue}>{component.componentName}</div>
              <div className={styles.infoLabel}>Category</div>
              <div className={styles.infoValue}>{component.componentType}</div>
              <div className={styles.infoLabel}>Model Number</div>
              <div className={styles.infoValue}>{component.modelNumber || "N/A"}</div>
              <div className={styles.infoLabel}>Serial Number</div>
              <div className={styles.infoValue}>{component.partNumber || "N/A"}</div>
              <div className={styles.infoLabel}>Description</div>
              <div className={styles.infoValue}>{component.description || "No description"}</div>
            </div>
            <div className={styles.btn}>
              <button
                className={styles.updateBtn}
                onClick={() => {
                  setShowPopup(true);
                  setShowConditionDetails(false);
                }}
              >
                Update
              </button>
            </div>
          </div>
          <div className={styles.cardColumn}>
            <h2 className={styles.cardTitle}>Component Condition</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoLabel}>Condition</div>
              <div className={styles.infoValue}>
                {component.condition == null
                  ? "N/A"
                  : component.condition
                  ? "Good"
                  : "Not Good"}
              </div>
              <div className={styles.infoLabel}>Details</div>
              <div className={styles.infoValue}>{component.conditionDetails || "N/A"}</div>
            </div>
            <div className={styles.btn}>
              <button
                className={styles.updateBtn}
                onClick={() => {
                  setShowPopup(true);
                  setShowConditionDetails(true);
                }}
              >
                Update Condition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Borrow History Preview + Accordion */}
      <div className={styles.previewSection}>
        <h2 className={styles.sectionTitle}>Borrow History</h2>
        <div className={styles.previewCard}>
          <Table
            columns={borrowColumns}
            data={borrowExpanded ? borrowHistory : borrowHistory.slice(0, 3)}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={key => handleSort(key, setBorrowHistory, borrowHistory)}
          />
          {borrowHistory.length > 3 && (
            <button
              className={styles.accordionBtn}
              onClick={() => setBorrowExpanded(!borrowExpanded)}
            >
              {borrowExpanded ? "Hide history ↑" : "View all history →"}
            </button>
          )}
        </div>
      </div>

      {/* Product History Preview + Accordion */}
      <div className={styles.previewSection}>
        <h2 className={styles.sectionTitle}>Product History</h2>
        <div className={styles.previewCard}>
          <Table
            columns={productColumns}
            data={productExpanded ? productHistory : productHistory.slice(0, 3)}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={key => handleSort(key, setProductHistory, productHistory)}
          />
          {productHistory.length > 3 && (
            <button
              className={styles.accordionBtn}
              onClick={() => setProductExpanded(!productExpanded)}
            >
              {productExpanded ? "Hide history ↑" : "View all history →"}
            </button>
          )}
        </div>
      </div>

      {/* Edit Popup */}
      {showPopup && (
        <UpdatePopUp
          componentData={component}
          showConditionDetails={showConditionDetails}
          onClose={() => setShowPopup(false)}
          updaet ={''}
          // onUpdate={async upd => {
          //   await handleComponentUpdate(upd);
          //   setShowPopup(false);
          // }}
        />
      )}
    </div>
  );
}
