"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import AddPersonnel from "@/app/components/project/personnel/AddPersonnel";
import EmptyState from '@/app/components/EmptyState/EmptyState';


export default function Personnel() {
  const { uuid } = useParams(); 
  console.log(uuid)
  const router = useRouter();
  const [personnel, setPersonnel] = useState([]);
  const [personnelExpanded, setPersonnelExpanded] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false)
   const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  // Navigation handlers
  const handleAddPersonnel = () => {
      console.log('Add Personnel button clicked!'); // Debug log

    setShowAdd(true)

  };

  const handleEditPersonnel = (personnelUuid) => {
    router.push(`/projects/${uuid}/personnel/${personnelUuid}/edit`);
  };

  const handleViewPersonnel = (personnelUuid) => {
    router.push(`/projects/${uuid}/personnel/${personnelUuid}`);
  };

  // Personnel actions
  const handleDeactivatePersonnel = async (personnelUuid) => {
    try {
      const response = await api.patch(`personnel/${personnelUuid}/deactivate`);
      if (response.status === 200) {
        // Refresh personnel list
        fetchPersonnelData();
      }
    } catch (error) {
      console.error("Error deactivating personnel:", error);
      setError("Failed to deactivate personnel");
    }
  };


  // Table column configuration
  const personnelColumns = [
    { 
      key: "user.firstName", 
      label: "Name", 
      sortable: true,
      render: (row) => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim()
    },
    { 
      key: "user.email", 
      label: "Email", 
      sortable: true,
      render: (row) => row.user?.email || 'N/A'
    },
    { 
      key: "role", 
      label: "Role", 
      sortable: true 
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : 'Ongoing',
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span 
          style={{ 
            padding: "4px 8px", 
            borderRadius: "4px", 
            fontSize: "12px",
            backgroundColor: row.isActive ? "#e7f5e7" : "#ffeaea",
            color: row.isActive ? "#2d5a2d" : "#8b2635"
          }}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    { 
      key: "responsibilities", 
      label: "Responsibilities", 
      sortable: false,
      render: (row) => {
        const responsibilities = row.responsibilities || 'Not specified';
        return responsibilities.length > 50 
          ? `${responsibilities.substring(0, 50)}...` 
          : responsibilities;
      }
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewPersonnel(row.uuid);
            }}
            className={styles.updateBtn}
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPersonnel(row.uuid);
            }}
            className={styles.editBtn}
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            Edit
          </button>
          {/* {row.isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeactivatePersonnel(row.uuid);
              }}
              className={styles.deleteBtn}
              style={{ fontSize: "12px", padding: "4px 8px" }}
            >
              Deactivate
            </button>
          )} */}
      
        </div>
      ),
    },
  ];

  // Fetch personnel data
  const fetchPersonnelData = async () => {
    if (!uuid) return;
    try {
      const res = await api.get(`projects/personnel/${uuid}`);
      console.log("response", res)
      if (res.status === 200) {
        setPersonnel(res.data.personnel || []);
      }
    } catch (err) {
      console.error("Error fetching personnel data", err);
      setError("Failed to fetch personnel data");
      setPersonnel([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchPersonnelData();
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // Loading guard
  if (loading) {
    return <div className={styles.loading}>Loading personnel data…</div>;
  }

  // Error guard
  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Sorting handler
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);

    const sorted = [...personnel].sort((a, b) => {
      // Handle nested keys like "user.firstName"
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
      };

      const aVal = getNestedValue(a, key) ?? "";
      const bVal = getNestedValue(b, key) ?? "";

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
    setPersonnel(sorted);
  };

  const displayedPersonnel = personnelExpanded ? personnel : personnel.slice(0, 5);

  // Filter counts
  const activeCount = personnel.filter(p => p.isActive).length;
  const inactiveCount = personnel.filter(p => !p.isActive).length;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.milestonesSection}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 className={styles.sectionTitle}>
              Project Personnel ({personnel.length})
            </h2>
            <div style={{ fontSize: "14px", color: "#666", marginLeft: "1rem" }}>
              <span style={{ color: "#2d5a2d" }}>Active: {activeCount}</span>
              {" | "}
              <span style={{ color: "#8b2635" }}>Inactive: {inactiveCount}</span>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleAddPersonnel} className={styles.editBtn}>
              Add Personnel
            </button>
          </div>
        </div>

        {personnel.length === 0 ? (
              <EmptyState
                   illustration="/undraw_no-data_ig65.svg"
                   message="No personnel records found"
                   details="You haven’t added any personnels in this project"
                   actionLabel="Add first Personnel"
                   onAction={() => setShowAdd(true)}
                 />
        ) : (
          <>
            <Table
              columns={personnelColumns}
              data={displayedPersonnel}
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSort={handleSort}
              onRowClick={(row) => {
                console.log('Personnel row clicked:', row);
                handleViewPersonnel(row.uuid);
              }}
            />

            {personnel.length > 5 && (
              <button
                className={styles.accordionBtn}
                onClick={() => setPersonnelExpanded(!personnelExpanded)}
              >
                {personnelExpanded
                  ? `Hide personnel ↑`
                  : `View all personnel (${personnel.length}) →`}
              </button>
            )}
          </>
        )}
      </div>
        {showAdd && <AddPersonnel onClose={() => setShowAdd(false)} />}
      
      
    
    </div>
  );
}