// app/archive/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import Swal from "sweetalert2";
import styles from "@/app/styles/archive/archive.module.css";
import Navbar from  '@/app/components/navbar/navbar';

export default function ArchivePage() {
  const { isAuthenticated, user, hasRole } = useAuth();
  // console.log("ArchivePage user:", user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Fetch archived records for this user
  const fetchArchived = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get("/api/auth/archived");  
        console.log("Fetched archived records:", res.data);
      const grouped = res.data.data || {};
     
      const flat = Object.entries(grouped).flatMap(([tableName, info]) =>
        info.records.map((r) => ({
          tableName,
          recordId: r.recordId,
          archivedAt: r.archivedAt,
          reason: r.reason,
          preview: r.preview,
        }))
      );
      console.log("Fetched archived records:", flat);
      setItems(flat);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load your archived records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, [isAuthenticated]);

  const handleRestore = async (recordId) => {
    const confirm = await Swal.fire({
      title: "Restore this record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.get(`/api/auth/restore/${recordId}`);
      Swal.fire({
        icon: "success",
        title: "Restored in the table!",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchArchived();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to restore record", "error");
    }
  };

  const handleDeletePermanently = async (recordId) => {
    const confirm = await Swal.fire({
      title: "Delete permanently?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete permanently",
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
    });
    
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/auth/archived/${recordId}`);
      Swal.fire({
        icon: "success",
        title: "Record deleted permanently!",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchArchived();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete record permanently", "error");
    }
  };

  const columns = [
    {
      key: "no",
      label: "No",
      sortable: false,
      render: (_r, idx) => idx + 1,
    },
    { key: "tableName", label: "Table", sortable: true },
    {
      key: "preview",
      label: "Preview",
      sortable: false,
      render: (r) => {
        // show title/name if present, else JSON preview
        if (r.preview?.title) return r.preview.title;
        if (r.preview?.name) return r.preview.name;
        return JSON.stringify(r.preview) || "–";
      },
    },
    {
      key: "archivedAt",
      label: "Archived At",
      sortable: true,
      render: (r) => new Date(r.archivedAt).toLocaleString(),
    },
    {
      key: "reason",
      label: "Reason",
      sortable: false,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`${styles.actionButton} ${styles.restoreBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(r.recordId);
            }}
          >
            Restore
          </button>
          {hasRole('admin') && (
            <button
              className={`${styles.actionButton} ${styles.deleteBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePermanently(r.recordId);
              }}
            >
              Delete Permanently
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
    <div className={styles.container}>
      <h1>Your Archived Records</h1>
      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : items.length > 0 ? (
        <Table
          columns={columns}
          data={items}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={(key) => {
            const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
            setSortKey(key);
            setSortOrder(order);
          }}
        />
      ) : (
        <p>No archived records found.</p>
      )}
    </div>
    </>
  );
}