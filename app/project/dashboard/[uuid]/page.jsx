"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import AddPhaseModal from "@/app/components/project/phases/addPhase";
import EditProjectModal from "@/app/components/project/update/update";

export default function ProjectDetails() {
  const { uuid, phaseuuid } = useParams();
  const router = useRouter();
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]); // holds milestones, workPackages, or durationYears depending on type
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const closeTimeoutRef = useRef(null);
  const [phaseEditModalOpen, setPhaseEditModalOpen] = useState(false);
 const [phaseEditData, setPhaseEditData] = useState(null);




  const appendActionsColumn = (columns) => [
  ...columns,
  {
    key: "actions",
    label: "Actions",
    sortable: false,
 render: (row) => (
  <div style={{ display: "flex", gap: "0.5rem" }}>
    {/* Pass the row.uuid to handleView instead of phaseuuid */}
    <button onClick={() => handleView(row.uuid)} className={styles.updateBtn}>View</button>
    <button onClick={() => handleEditPhase(row)} className={styles.actionBtn}>Edit</button>
    <button onClick={() => handleDeletePhase(row)} className={styles.actionBtnDelete}>Delete</button>
  </div>
),


  },
];

  // Configuration per project type
  const typeConfig = {
  "Milestones": {
    title: "Project Milestones",
    columns: appendActionsColumn([
      { key: "no", label: "No.", sortable: true },
      { key: "title", label: "Milestone Name", sortable: true },
      { key: "implementation_startDate", label: "Start Date", sortable: true, render: r => new Date(r.implementation_startDate).toLocaleDateString() },
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
      { key: "startDate", label: "Start Date", sortable: true, render: r => new Date(r.startDate).toLocaleDateString() },
      { key: "endDate", label: "End Date", sortable: true, render: r => new Date(r.endDate).toLocaleDateString() },
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

  // Fetch project and all related data at once
  const fetchProjectData = async () => {
    if (!uuid) return;
    try {
      const res = await api.get(`projects/${uuid}`);
      if (res.status === 200) {
        const data = res.data;
        console.log("Project data fetched successfully:", data);
        setProject(data);

        // Set items for table based on project.type and data keys
        const type = data.type;
        const config = typeConfig[type];
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

  // Sorting handler for current items
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

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
    setItems(sorted);
  };

  // Duration calculation helper
  const getDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) return "Invalid dates";
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();
    let totalMonths = yearsDiff * 12 + monthsDiff;
    if (endDate.getDate() >= startDate.getDate()) totalMonths += 1;
    if (totalMonths <= 0) return "Less than a month";
    return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
  };

  // Edit modal handlers
  const handleEdit = () => {
    setEditProjectData(project);
    setEditModalOpen(true);
    clearTimeout(closeTimeoutRef.current);
  };
  const updateProject = async () => {
    if (!editProjectData) return;
    setIsSaving(true);
    const cleanedData = {
      name: editProjectData.name,
      description: editProjectData.description,
      status: editProjectData.status,
      budget: editProjectData.budget,
      funding: editProjectData.funding,
      startDate: editProjectData.startDate,
      endDate: editProjectData.endDate,
    };
    try {
      const response = await api.post(
        `/projects/update/${editProjectData.uuid}`,
        cleanedData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        closeEditModal();
      } else {
        console.error("Failed to update the project");
      }
    } catch (error) {
      console.error("Error while updating project:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProjectData(null);
    fetchProjectData();
  };

  // Fetch data when uuid changes
  useEffect(() => {
    fetchProjectData();
  }, [uuid]);

  if (!project) return <div className={styles.loading}>Loading project data...</div>;

  // Get current config for rendering
  const currentConfig = typeConfig[project.type] || {};
  const { title: tableTitle = "Project Details", columns: tableColumns = [] } = currentConfig;

  // Defensive slice of items
  const displayedItems = itemsExpanded
    ? items
    : Array.isArray(items)
    ? items.slice(0, 3)
    : [];


    // View simply shows details alert or you can customize it

 const handleView = (phaseuuid) => {
  if (!phaseuuid) {
    console.error("Phase UUID is undefined");
    console.log("phaseuuid not found")
    return;
  }


  const baseUrl = `/projects/${uuid}/${phaseuuid}`;

  router.push(baseUrl);
};



const handleEditPhase = (row) => {
  setPhaseEditData(row);
  setPhaseEditModalOpen(true);
};

// Delete with confirmation
const handleDeletePhase = async (row) => {
  if (!confirm(`Are you sure you want to delete "${row.title || row.year || 'this item'}"?`)) return;

  try {
    // Adjust API delete endpoint accordingly, assuming /milestones/{uuid}/{phaseUuid}
    const response = await api.delete(`/milestones/${uuid}/${row.uuid}`);

    if (response.status === 200) {
      alert("Deleted successfully");
      fetchProjectData(); // Refresh list
    } else {
      alert("Failed to delete item");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("Error occurred while deleting");
  }
};


  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Project Dashboard</h1>

      {/* Project Information and Timeline Cards */}
      <div className={styles.card}>
        <div className={styles.cardColumn}>
          <h2 className={styles.cardTitle}>Project Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoLabel}>Project ID</div>
            <div className={styles.infoValue}>{project.project_id || "N/A"}</div>

            <div className={styles.infoLabel}>Title</div>
            <div className={styles.infoValue}>{project.title || "N/A"}</div>

            <div className={styles.infoLabel}>Description</div>
            <div className={styles.infoValue}>{project.description || "No description"}</div>

            <div className={styles.infoLabel}>Developer</div>
            <div className={styles.infoValue}>{project.developer || "N/A"}</div>

            <div className={styles.infoLabel}>Budget</div>
            <div className={styles.infoValue}>
              {project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}
            </div>
          </div>
          <div className={styles.btn}>
            <button className={styles.updateBtn} onClick={handleEdit}>
              Update Project Info
            </button>
          </div>
        </div>

        <div className={styles.cardColumn}>
          <h2 className={styles.cardTitle}>Project Timeline</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoLabel}>Start Date</div>
            <div className={styles.infoValue}>
              {project.implementation_startDate
                ? new Date(project.implementation_startDate).toLocaleDateString()
                : "N/A"}
            </div>

            <div className={styles.infoLabel}>End Date</div>
            <div className={styles.infoValue}>
              {project.implementation_endDate
                ? new Date(project.implementation_endDate).toLocaleDateString()
                : "N/A"}
            </div>

            <div className={styles.infoLabel}>Duration</div>
            <div className={styles.infoValue}>
              {getDuration(project.implementation_startDate, project.implementation_endDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Table Section */}
      <div className={styles.milestonesSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
  <h2 className={styles.sectionTitle}>{tableTitle}</h2>
  <button
    className={styles.updateBtn}
    onClick={() => setShowPhaseModal(true)}
  >
    + Add {project.type}
  </button>
</div>


        <Table
          columns={tableColumns}
          data={displayedItems}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {items.length > 1 && (
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

      {/* Edit Modal */}
      {editModalOpen && (
        <EditProjectModal
          editProjectData={editProjectData}
          setEditProjectData={setEditProjectData}
          updateProject={updateProject}
          closeEditModal={closeEditModal}
          isSaving={isSaving}
        />
      )}
    <AddPhaseModal
    isOpen={showPhaseModal}
    onClose={() => setShowPhaseModal(false)}
    onAdded={fetchProjectData} 
    projectUuid={uuid}
    phaseType={project.type}
    />
    </div>
  );
}