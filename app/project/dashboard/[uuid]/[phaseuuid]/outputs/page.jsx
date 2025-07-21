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
  const { user, hasRole, isAuthenticated, sendSocketMessage } = useAuth();

  // State
  const [allOutputs, setAllOutputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [archivedOutputs, setArchivedOutputs] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sorting
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Modals
  const [adding, setAdding] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectInitialValues, setRejectInitialValues] = useState({ reason: "" });

  // Feedback
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch outputs
  const fetchOutputs = async () => {
    if (!phaseuuid) return;
    setLoading(true);
    try {
      const res = await api.get(`/outputs/${phaseuuid}`);
      const all = res.data || [];
      console.log(all)
      setAllOutputs(all.outputs);
 
    } catch (err) {
      console.error(err);
      setError("Failed to load outputs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOutputs(); }, [phaseuuid]);

  // Archive
  const archiveOutput = async (uuid, reason) => {
    setMessage(null); setError(null);
    try {
      await api.post(`/outputs/${uuid}/archive`, { reason });
      const updated = allOutputs.map(o =>
        o.uuid === uuid ? { ...o, is_archived: true } : o
      );
      setAllOutputs(updated);
      setOutputs(updated.filter(o => !o.is_archived));
      setArchivedOutputs(updated.filter(o => o.is_archived));
      const name = allOutputs.find(o => o.uuid === uuid)?.name;
      setMessage(`“${name}” archived.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Archive failed");
    }
  };

  // Reject
 const rejectOutput = async (uuid, reason) => {
  setMessage(null);
  setError(null);

  try {
    // 1) Mark the output as rejected
    await api.post(`/outputs/reject/${uuid}`, { reason });

    // 2) Update UI state
    const updated = allOutputs.map(o =>
      o.uuid === uuid ? { ...o, is_rejected: true } : o
    );
    setAllOutputs(updated);
   
    const name = allOutputs.find(o => o.uuid === uuid)?.name;
    setMessage(`“${name}” was rejected.`);

    // 3) Send a notification via HTTP
    const createdBy = allOutputs.find(o => o.uuid === uuid)?.createdBy;
    await api.post('/notifications', {
      userId: createdBy,                // the user who should receive this
      type: "output_rejected",
      outputId: uuid,
      message: `Your output “${name}” was rejected. Reason: ${reason}`
    });

  } catch (err) {
    console.error("Reject failed:", err);
    setError(
      err.response?.data?.message ||
      "Reject failed; could not send notification."
    );
  }
};

  // Approve (unchanged)
  const handleApprove = async output => {
    setMessage(null); setError(null);
    try {
      await api.post(`/outputs/approve/${output.uuid}`);
      const updated = allOutputs.map(o =>
        o.uuid === output.uuid ? { ...o, is_approved: true } : o
      );
      setAllOutputs(updated);
      setOutputs(updated.filter(o => !o.is_archived));
      setArchivedOutputs(updated.filter(o => o.is_archived));
      setMessage(`"${output.name}" approved successfully.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Approval failed");
    }
  };

  // Sorting helper
  const handleSort = (key, data, setter) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key); setSortOrder(order);
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key] ?? "", bVal = b[key] ?? "";
      if (typeof aVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return order === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
    setter(sorted);
  };

  // Table columns
  const tableColumns = isArchiveView => [
    { key: "no", label: "No.", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "value", label: "Value", sortable: true },
    {
      key: "document_name",
      label: "Document",
      render: r => {
        const raw = (r.document_name||"").replace(/^[0-9]+-/, "");
        const display = raw.length>50 ? raw.slice(0,50)+"…" : raw;
        return <a href={r.document_path} target="_blank" rel="noreferrer">{display}</a>;
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: r => !isArchiveView && (
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button
            className={`${styles.actionButton} ${styles.actionBtn}`}
            onClick={e => {
              e.stopPropagation();
              window.open(`${api.defaults.baseURL}/uploads/outputs/${r.document_name}`, "_blank");
            }}
          >View</button>

          <button
            className={`${styles.actionButton} ${styles.editBtn}`}
            onClick={e => { e.stopPropagation(); setEditingData(r); }}
          >Edit</button>

          <button
            className={`${styles.actionButton} ${styles.actionBtnDelete}`}
            onClick={e => { e.stopPropagation(); setArchiveTarget(r); setShowArchiveModal(true); }}
          >Archive</button>

          {hasRole("admin") && !r.is_approved && (
            <button
              className={`${styles.actionButton} ${styles.editBtn}`}
              onClick={e => { e.stopPropagation(); handleApprove(r); }}
            >Approve</button>
          )}

          {hasRole("admin") && !r.is_rejected && !r.is_approved && (
            <button
              className={`${styles.actionButton} ${styles.actionBtnDelete}`}
              onClick={e => {
              e.stopPropagation();
               setRejectTarget(r);
           setRejectInitialValues({ reason: "" });
           setShowRejectModal(true);
            }}
            >Reject</button>
          )}
        </div>
      )
    }
  ];

  // Modal fields
  const archiveFields = [{
    name:"reason", label:"Reason for archiving", type:"select",
    options:[
      {value:"No longer relevant", label:"No longer relevant"},
      {value:"Duplicate entry", label:"Duplicate entry"},
      {value:"Incorrect data", label:"Incorrect data"},
      {value:"Other", label:"Other"}
    ]
  }];

  const rejectFields = [
    {
      name: "reason",
      label: "Reason for rejection",
      type: "text",      // <-- was "select" before
    }
  ];

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const id = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(id);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(id);
    }
  }, [error]);

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <>
      {message && <div className={styles.successMsg}>{message}</div>}
      {error   && <div className={styles.errorMsg}>{error}</div>}

      {adding && (
        <AddOutputModal
          open
          onClose={()=>setAdding(false)}
          onAdded={()=>{fetchOutputs(); setAdding(false)}}
          phaseuuid={phaseuuid}
        />
      )}

      {editingData && (
        <EditOutputModal
          open
          onClose={()=>setEditingData(null)}
          onEdited={()=>{fetchOutputs(); setEditingData(null)}}
          phaseuuid={phaseuuid}
          editData={editingData}
        />
      )}

      {showArchiveModal && (
        <FormModal
          title={`Archive “${archiveTarget.name}”`}
          fields={archiveFields}
          initialValues={{ reason: "" }}
          onSubmit={vals=>{archiveOutput(archiveTarget.uuid, vals.reason); setShowArchiveModal(false)}}
          onClose={()=>setShowArchiveModal(false)}
          extraActions={[]}
        />
      )}

      {showRejectModal && (
        <FormModal
          title={`Reject “${rejectTarget.name}”`}
          fields={rejectFields}
           initialValues={rejectInitialValues}
          onSubmit={vals => {
            rejectOutput(rejectTarget.uuid, vals.reason);
            setShowRejectModal(false);
          }}
          onClose={() => setShowRejectModal(false)}
          extraActions={[]}
        />
      )}


      <div className={styles.milestonesSection}>
        <h2>Outputs</h2>
        <div style={{display:"flex", gap:"0.5rem", marginBottom:"1rem"}}>
          <Toolbar
            placeholder="Search outputs..."
            buttons={[
              { label:"Filter", variant:"secondary", icon:MdFilterList },
              !showArchived && { label:"Add New", onClick:()=>setAdding(true), variant:"primary", icon:MdAdd }
            ].filter(Boolean)}
          />
        </div>
        <Table
          columns={tableColumns(showArchived)}
          data={allOutputs}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={key => handleSort(
            key,
            showArchived ? archivedOutputs : outputs,
            showArchived ? setArchivedOutputs : setOutputs
          )}
          onRowClick={r =>
            window.open(
              `${api.defaults.baseURL}/uploads/outputs/${r.document_name}`,
              "_blank"
            )
          }
        />
      </div>
    </>
  );
}