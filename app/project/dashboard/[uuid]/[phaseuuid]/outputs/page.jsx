"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import { MdAdd, MdFilterList } from "react-icons/md";
import AddOutputModal from "@/app/components/project/output/sinadd/add";
import EditOutputModal from "@/app/components/project/output/sinadd/edit";
import FormModal from "@/app/components/Form/FormModal";
import { useAuth } from "@/app/context/AuthContext";

export default function OutputDetails() {
  const { phaseuuid } = useParams();

    const { user, hasRole, isAuthenticated } = useAuth();


  // all outputs and split lists
  const [allOutputs, setAllOutputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
 
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // sorting
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // add / edit
  const [adding, setAdding] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // archive modal controls
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);

  // feedback
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch outputs and split by is_archived
  const fetchOutputs = async () => {
    if (!phaseuuid) return;
    setLoading(true);
    try {
      const res = await api.get(`/outputs/${phaseuuid}`);
      const all = res.data || [];
      console.log(all.outputs)
      setAllOutputs(all.outputs);
    
    } catch (err) {
      console.error(err);
      setError("Failed to load outputs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputs();
  }, [phaseuuid]);



  // Archive function
  const archiveOutput = async (uuid, reason) => {
    setMessage(null);
    setError(null);
    try {
      await api.post(`/outputs/${uuid}/archive`, { reason });
      const updatedAll = allOutputs.map(o =>
        o.uuid === uuid ? { ...o, is_archived: true } : o
      );
      setAllOutputs(updatedAll);
      const name = allOutputs.find(o => o.uuid === uuid)?.name;
      setMessage(`“${name}” archived.`);
    } catch (err) {
    if (err.response) {
      console.error("Archive API error payload:", err.response.data);
      setError(err.response.data.error || err.response.data.message || "Archive failed");
    } else {
      console.error("Network or CORS error:", err);
      setError("Unable to reach server");
    }
  }
}
 

  // Sorting helper
  const handleSort = (key, data, setter) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";
      if (typeof aVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
    setter(sorted);
  };
  // Add this function to your component
  const handleApprove = async (output) => {

    console.log(output)
    try {
      setMessage(null);
      setError(null);
      
      await api.post(`/outputs/approve/${output.uuid}`);
      
      // Update the local state to reflect the approval
      const updatedAll = allOutputs.map(o =>
        o.uuid === output.uuid ? { ...o, is_approved: true } : o
      );
      setAllOutputs(updatedAll);
      setMessage(`"${output.name}" approved successfully.`);
    } catch (err) {
      console.error('Error approving output:', err);
      if (err.response) {
        setError(err.response.data.error || err.response.data.message || "Approval failed");
      } else {
        setError("Unable to reach server");
      }
    }
  };

  // Table columns
  const tableColumns = (isArchiveView = false) => [
    { key: "no", label: "No.", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "value", label: "Value", sortable: true },
    {
      key: "document_name",
      label: "Document",
        render: (r) => {
      // 1) Strip leading numbers + dash
      const raw = (r.document_name || "").replace(/^[0-9]+-/, "");
      // 2) Truncate to 50 chars
      const MAX = 50;
      const display =
        raw.length > MAX ? raw.slice(0, MAX).trimEnd() + "…" : raw;
      return (
        <a href={r.document_path} target="_blank" rel="noreferrer" title={raw}>
          {display}
        </a>
      );
    }
    },
    {
      key: "actions",
      label: "Actions",
      render: r =>
        isArchiveView ? null : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={` ${styles.actionButton} ${styles.actionBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                const w = window.open("_blank", "noopener");
                if (!w) return alert("Allow pop-ups");
                w.location.href = `${api.defaults.baseURL}/uploads/outputs/${r.document_name}`;
              }}
            >
              View
            </button>
            <button
              className={`${styles.actionButton} ${styles.editBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                setEditingData(r);
              }}
            >
              Edit
            </button>
            <button
              className={`${styles.actionButton} ${styles.actionBtnDelete}`}
              onClick={(e) => {
                e.stopPropagation();
                setArchiveTarget(r);
                setShowArchiveModal(true);
              }}
            >
              Archive
            </button>
           {hasRole('admin') && !r.is_approved && (
            <button
              className={`${styles.actionButton} ${styles.editBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(r);
              }}
            >
              Approve
            </button>
          )}
          </div>
        )
    }
  ];

  // The single "reason" field passed into FormModal
  const archiveFields = [
    {
      name: "reason",
      label: "Reason for archiving",
      type: "select",
      options: [
        { value: "No longer relevant", label: "No longer relevant" },
        { value: "Duplicate entry", label: "Duplicate entry" },
        { value: "Incorrect data", label: "Incorrect data" },
        { value: "Other", label: "Other" }
      ]
    }
  ];

    useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 6000);
    return () => clearTimeout(id);
  }, [message]);

   const handleRowClick = (output) => {
    const url = `${api.defaults.baseURL}/uploads/outputs/${output.document_name}`;
    window.open(url, "_blank");
  };
  // auto-dismiss error after 6s
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(id);
  }, [error]);

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <>
      {message && <div className={styles.successMsg}>{message}</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {adding && (
        <AddOutputModal
          open
          onClose={() => setAdding(false)}
          onAdded={() => {
            fetchOutputs();
            setAdding(false);
          }}
          phaseuuid={phaseuuid}
        />
      )}

      {editingData && (
        <EditOutputModal
          open
          onClose={() => setEditingData(null)}
          onEdited={() => {
            fetchOutputs();
            setEditingData(null);
          }}
          phaseuuid={phaseuuid}
          editData={editingData}
        />
      )}

      {showArchiveModal && (
        <FormModal
          title={`Archive "${archiveTarget.name}"`}
          fields={archiveFields}
          initialValues={{ reason: "" }}
          onChange={vals => {
            /* FormModal will call this with { reason: '...' } */
            /* we don't need to store locally here */
          }}
          onSubmit={vals => {
            archiveOutput(archiveTarget.uuid, vals.reason);
            setShowArchiveModal(false);
          }}
          onClose={() => setShowArchiveModal(false)}
          extraActions={[]}
        />
      )}

      <div className={styles.milestonesSection}>
        <h2>Outputs</h2>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <Toolbar
            placeholder={`Search outputs...`}
            buttons={[
              {
                label: "Filter",

                variant: "secondary",
                icon: MdFilterList
              },
              !showArchived && {
                label: "Add New",
                onClick: () => setAdding(true),
                variant: "primary",
                icon: MdAdd
              }
            ].filter(Boolean)}
          />
        </div>

        <Table
          columns={tableColumns(showArchived)}
          data={allOutputs}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={key =>
            handleSort(
              key,
              showArchived ? archivedOutputs : outputs,
              showArchived ? setArchivedOutputs : setOutputs
            )
          }
             onRowClick={handleRowClick}  
        />
      </div>
    </>
  );
}
