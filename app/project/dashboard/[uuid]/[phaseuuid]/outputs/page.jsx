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

export default function OutputDetails() {
  const { phaseuuid } = useParams();

  // all outputs and split lists
  const [allOutputs, setAllOutputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [archivedOutputs, setArchivedOutputs] = useState([]);
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
      setAllOutputs(all);
      setOutputs(all.filter(o => !o.is_archived));
      setArchivedOutputs(all.filter(o => o.is_archived));
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
    console.log("Archiving Output:", uuid, reason)
    setMessage(null);
    setError(null);
    try {
      await api.post(`/outputs/${uuid}/archive`, { reason });
      const updatedAll = allOutputs.map(o =>
        o.uuid === uuid ? { ...o, is_archived: true } : o
      );
      setAllOutputs(updatedAll);
      setOutputs(updatedAll.filter(o => !o.is_archived));
      setArchivedOutputs(updatedAll.filter(o => o.is_archived));
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
              onClick={() => {
                const w = window.open("_blank", "noopener");
                if (!w) return alert("Allow pop-ups");
                w.location.href = `${api.defaults.baseURL}/uploads/outputs/${r.document_name}`;
              }}
            >
              View
            </button>
            <button
              className={`${styles.actionButton} ${styles.editBtn}`}
              onClick={() => setEditingData(r)}
            >
              Edit
            </button>
            <button
              className={`${styles.actionButton} ${styles.actionBtnDelete}`}
              onClick={() => {
                setArchiveTarget(r);
                setShowArchiveModal(true);
              }}
            >
              Archive
            </button>
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
          data={showArchived ? archivedOutputs : outputs}
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
