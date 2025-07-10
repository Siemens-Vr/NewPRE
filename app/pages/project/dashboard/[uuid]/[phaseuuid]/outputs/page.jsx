"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import { MdAdd, MdFilterList, MdDownload } from "react-icons/md";
import AddOutputModal from "@/app/components/project/output/sinadd/add";


export default function OutputDetails() {
  const { uuid, phaseuuid } = useParams();
  const router = useRouter();
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [adding, setAdding] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Fetch outputs for this phase
  const fetchOutputs = async () => {
    if (!phaseuuid) return;
    setLoading(true);
    try {
      const res = await api.get(`/outputs/${phaseuuid}`);
      setOutputs(res.data || []);
    } catch (err) {
      console.error("Error fetching outputs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputs();
  }, [phaseuuid]);

  // Sorting handler
  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sorted = [...outputs].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
    setOutputs(sorted);
  };

  const tableColumns = [
    { key: "no", label: "No.", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: false },
    { key: "value", label: "Δ Value", sortable: true },
    {
      key: "document_name",
      label: "Document",
      render: (r) => (
        <a href={r.document_path} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {r.document_name}
        </a>
      )
    },
    { key: "createdAt", label: "Created At", render: (r) => new Date(r.createdAt).toLocaleString(), sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <>
          <button className={styles.updateBtn} style={{ marginRight: '0.5rem' }} onClick={() => window.open(r.document_path)}>
            View
          </button>
          <button
            className={styles.updateBtn}
            style={{ marginRight: '0.5rem' }}
            onClick={() => setEditingData(r)}
          >
            Edit
          </button>
          <button className={styles.actionBtnDelete} onClick={() => {/* implement delete */}}>
            Delete
          </button>
        </>
      )
    }
  ];

  const displayed = expanded ? outputs : outputs.slice(0, 3);

  if (loading) return <div className={styles.loading}>Loading outputs…</div>;

  return (
    <>
          {adding && (
        <AddOutputModal
          open={true}
          onClose={() => setAdding(false)}
          onAdded={() => {
            fetchOutputs();
            setAdding(false);
          }}
          phaseuuid={phaseuuid}
        />
      )}
    {/* Edit Modal */}
    {editingData && (
  <AddOutputModal
    open={!!editingData}
    onClose={() => setEditingData(null)}
    onEdited={() => { fetchOutputs(); setEditingData(null); }}
    phaseuuid={phaseuuid}
    editData={editingData}
  />
)}

    <div className={styles.milestonesSection}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <h2 className={styles.sectionTitle}>Outputs</h2>
        <Toolbar
          placeholder="Search outputs..."
          buttons={[
            { label: 'Filter', onClick: () => {}, variant: 'secondary', icon: MdFilterList },
            { label: 'Download PDF', onClick: () => {}, variant: 'primary', icon: MdDownload },
            { label: 'Add New', onClick: () => setAdding(true), variant: 'primary', icon: MdAdd }
          ]}
        />
      </div>

      <Table
        columns={tableColumns}
        data={displayed}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {outputs.length > 3 && (
        <button className={styles.accordionBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide outputs ↑' : 'View all outputs →'}
        </button>
      )}

    </div>
     </>
  );
}