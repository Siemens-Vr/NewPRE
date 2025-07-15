"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";

export default function ProjectDetails() {
  const { uuid, phaseuuid } = useParams();
  // console.log("ProjectDetails mounted with params:", { uuid, phaseuuid });
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Navigation handlers
  const handleEdit = () => {
    router.push(`/projects/${uuid}/${phaseuuid}/outputs/edit`);
  };

  const handleBulkAdd = () => {
    router.push(`/projects/${uuid}/${phaseuuid}/outputs/add`);
  };

  // Table‐column helper to inject an Actions column
  const appendActionsColumn = (columns) => [
    ...columns,
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => handleView(row.uuid)}
            className={styles.actionBtn}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  // Map project.type → table config
  const typeConfig = {
    Milestones: {
      title: "Project Milestones",
      columns: appendActionsColumn([
        { key: "no", label: "No.", sortable: true },
        { key: "title", label: "Milestone Name", sortable: true },
        {
          key: "implementation_startDate",
          label: "Start Date",
          sortable: true,
          render: (r) => new Date(r.implementation_startDate).toLocaleDateString(),
        },
        { key: "status", label: "Status", sortable: true },
        { key: "description", label: "Description", sortable: false },
      ]),
      dataKey: "milestones",
    },
    "Work Package": {
      title: "Project Work Packages",
      columns: appendActionsColumn([
        { key: "no", label: "No.", sortable: true },
        { key: "title", label: "Work Package Name", sortable: true },
        {
          key: "startDate",
          label: "Start Date",
          sortable: true,
          render: (r) => new Date(r.startDate).toLocaleDateString(),
        },
        {
          key: "endDate",
          label: "End Date",
          sortable: true,
          render: (r) => new Date(r.endDate).toLocaleDateString(),
        },
        { key: "status", label: "Status", sortable: true },
        { key: "description", label: "Description", sortable: false },
      ]),
        dataKey: "milestones",
    },
    "Duration Years": {
      title: "Project Duration",
      columns: appendActionsColumn([
        { key: "no", label: "No.", sortable: true },
        { key: "year", label: "Year", sortable: true },
        { key: "description", label: "Description", sortable: false },
      ]),
        dataKey: "milestones",
    },
  };

  // Fetch project & populate items
  const fetchProjectData = async () => {
    if (!uuid) return;
    try {
      const res = await api.get(`projects/${uuid}`);
      if (res.status === 200) {
        const data = res.data;
        setProject(data);

        const config = typeConfig[data.type];
        if (config && Array.isArray(data[config.dataKey])) {
          setItems(data[config.dataKey]);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error("Error fetching project data", err);
      setProject(null);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [uuid]);

  // Loading guard
  if (!project) {
    return <div className={styles.loading}>Loading project data…</div>;
  }

  // Sorting handler
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);

    const sorted = [...items].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
    setItems(sorted);
  };

  const handleView = (phaseuuid) => {
    if (!phaseuuid) return;
    router.push(`/projects/${uuid}/${phaseuuid}/outputs`);
  };

  const currentConfig = typeConfig[project.type] || {};
  const {
    title: tableTitle = "Project Details",
    columns: tableColumns = [],
  } = currentConfig;

  const displayedItems = itemsExpanded ? items : items.slice(0, 3);

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
            <h2 className={styles.sectionTitle}>{tableTitle}</h2>
            <div className={styles.buttonGroup}>
              <button onClick={handleEdit} className={styles.editBtn}>
                Edit
              </button>
              <button onClick={handleBulkAdd} className={styles.bulkBtn}>
                Add in Bulk
              </button>
            </div>
          </div>
        </div>

        <Table
          columns={tableColumns}
          data={displayedItems}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {items.length > 3 && (
          <button
            className={styles.accordionBtn}
            onClick={() => setItemsExpanded(!itemsExpanded)}
          >
            {itemsExpanded
              ? `Hide ${tableTitle.toLowerCase()} ↑`
              : `View all ${tableTitle.toLowerCase()} →`}
          </button>
        )}
      </div>
    </div>
  );
}
