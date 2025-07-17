"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import AddCostCategoryModal from "@/app/components/project/output/addOutput";
import styles from "@/app/styles/project/phases/cardCategory.module.css";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import { MdAdd, MdFilterList } from "react-icons/md";
import Loading from "@/app/components/Loading/Loading";
import FormModal from "@/app/components/Form/FormModal";

export default function CostCategoryDetailPage() {
  const { uuid, phaseuuid, category_id } = useParams();
  const router = useRouter();

  const [costItems, setCostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Archive modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);
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

  // Feedback
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch cost items
  const fetchCostItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cost_categories_tables/${category_id}`);
      if (res.status === 200) {
        setCostItems(res.data);
      } else {
        setError("Failed to fetch cost items");
      }
    } catch {
      setError("Error fetching cost items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category_id) fetchCostItems();
  }, [category_id]);

  // Archive handler via FormModal
  const handleArchive = async ({ reason }) => {
    if (!archiveTarget) return;
    console.log("Archiving Cost Item:", archiveTarget.uuid, reason);
    setMessage(null);
    setError(null);
    try {
      await api.post(
        `/cost_categories_tables/${archiveTarget.uuid}/archive`,
        { reason }
      );
      await fetchCostItems();
      setMessage(`“${archiveTarget.title}” archived.`);
    } catch (err) {
      setError(err.response?.data?.message || "Archive failed");
    } finally {
      setShowArchiveModal(false);
      setArchiveTarget(null);
    }
  };

  // Columns
  const columns = [
    { key: "no", label: "No", sortable: true },
    { key: "title", label: "Title", sortable: true },
    {
      key: "total_amount",
      label: "Total Amount",
      sortable: true,
      render: (row) => `${row.total_amount?.toLocaleString() || "0"}`,
    },
    { key: "description", label: "Description" },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`${styles.actionButton} ${styles.actionBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/projects/${uuid}/${phaseuuid}/${category_id}/${row.uuid}`
              );
            }}
          >
            View
          </button>
          <button
            className={`${styles.actionButton} ${styles.editBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              setEditItem(row);
              setShowEditModal(true);
            }}
          >
            Edit
          </button>
          <button
            className={`${styles.actionButton} ${styles.actionBtnDelete}`}
            onClick={(e) => {
              e.stopPropagation();
              setArchiveTarget(row);
              setShowArchiveModal(true);
            }}
          >
            Archive
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <Loading text="Loading cost items…" />;

  return (
    <div className={styles.container}>
      {message && <div className={styles.successMsg}>{message}</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <Toolbar
        placeholder="Search cost items…"
        buttons={[
          {
            label: "Filter",
            onClick: () => {},
            variant: "secondary",
            icon: MdFilterList,
          },
          {
            label: "Add Cost Item",
            onClick: () => setShowAddModal(true),
            variant: "primary",
            icon: MdAdd,
          },
        ]}
      />

      <Table
        columns={columns}
        data={costItems}
        sortKey={null}
        sortOrder={null}
        onSort={() => {}}
        onRowClick={(row) =>
          router.push(
            `/projects/${uuid}/${phaseuuid}/${category_id}/${row.uuid}`
          )
        }
      />

      {/* Add Modal */}
      {showAddModal && (
        <AddCostCategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            fetchCostItems();
            setShowAddModal(false);
          }}
          phaseUuid={phaseuuid}
          costCategoryId={category_id}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <AddCostCategoryModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditItem(null);
          }}
          onAdded={() => {
            fetchCostItems();
            setShowEditModal(false);
            setEditItem(null);
          }}
          phaseUuid={phaseuuid}
          costCategoryId={category_id}
          editData={editItem}
        />
      )}

      {/* Archive FormModal */}
      {showArchiveModal && (
        <FormModal
          title={`Archive "${archiveTarget?.title}"`}
          fields={archiveFields}
          initialValues={{ reason: "" }}
          onChange={() => {}}
          onSubmit={handleArchive}
          onClose={() => {
            setShowArchiveModal(false);
            setArchiveTarget(null);
          }}
          extraActions={[]}
        />
      )}
    </div>
  );
}
