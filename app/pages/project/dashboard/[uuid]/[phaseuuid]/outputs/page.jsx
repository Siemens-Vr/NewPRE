"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import formStyles from "@/app/components/Form/FormModal.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import { MdAdd, MdFilterList, MdDownload } from "react-icons/md";
import AddOutputModal from "@/app/components/project/output/sinadd/add";
import FormModal from "@/app/components/Form/FormModal";

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

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const deleteReasons = [
    "No longer relevant",
    "Duplicate entry",
    "Incorrect data",
    "Other",
  ];

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
          <button
            className={styles.actionBtnDelete}
            onClick={() => { setDeleteTarget(r); setShowDeleteModal(true); }}
          >
            Delete
          </button>
        </>
      )
    }
  ];

  const displayed = expanded ? outputs : outputs.slice(0, 3);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      // Archive instead of delete
      await api.put(`/outputs/archive/${deleteTarget.id}`, { reason: deleteReason });
      fetchOutputs();
    } catch (err) {
      console.error("Error archiving output", err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteReason("");
    }
  };

  if (loading) return <div className={styles.loading}>Loading outputs…</div>;

  return (
    <>
      {adding && (
        <AddOutputModal
          open
          onClose={() => setAdding(false)}
          onAdded={() => { fetchOutputs(); setAdding(false); }}
          phaseuuid={phaseuuid}
        />
      )}

      {editingData && (
        <AddOutputModal
          open={Boolean(editingData)}
          onClose={() => setEditingData(null)}
          onEdited={() => { fetchOutputs(); setEditingData(null); }}
          phaseuuid={phaseuuid}
          editData={editingData}
        />
      )}

      {showDeleteModal && (
        <FormModal
        isOpen={showDeleteModal}
        title="Delete Output"
        onSubmit={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        disableSubmit={!deleteReason}
        submitLabel="Submit"
      >
        <p>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?</p>
        <div className={formStyles.field}>
          <label htmlFor="deleteReason">Reason for deletion</label>
          <select
            id="deleteReason"
            name="deleteReason"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className={formStyles.input}
          >
            <option value="" disabled>
              Select reason
            </option>
            {deleteReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </FormModal>
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
