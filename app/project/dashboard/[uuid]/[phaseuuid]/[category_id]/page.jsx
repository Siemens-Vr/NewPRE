"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Table from "@/app/components/table/Table";
import AddCostCategoryModal from "@/app/components/project/output/addOutput";
import styles from "@/app/styles/project/phases/cardCategory.module.css";
import Swal from "sweetalert2";
import Toolbar from "@/app/components/ToolBar/ToolBar";
import { MdAdd, MdFilterList } from "react-icons/md";
import Loading from "@/app/components/Loading/Loading";

export default function CostCategoryDetailPage() {
  const {uuid, phaseuuid, category_id } = useParams();
  const router = useRouter();

  const [costItems, setCostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Navigate to document page for a given cost item
  

  // Columns for the table
  const columns = [
    { key: "no", label: "No", sortable: true },
    { key: "title", label: "Title", sortable: true },
    {
      key: "total_amount",
      label: "Total Amount",
      sortable: true,
      render: (row) => `${row.total_amount?.toLocaleString() || "0"}`,
    },
    { key: "description", label: "Description", sortable: false },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={` ${styles.actionButton} ${styles.actionBtn}`}
            onClick={() => handleView(row)}
          >
            View
          </button>
          <button
            className={`${styles.actionButton} ${styles.editBtn}`}
            onClick={() => {
              setEditItem(row);
              setShowEditModal(true);
            }}
          >
            Edit
          </button>
          <button
            className={`${styles.actionButton} ${styles.actionBtnDelete}`}
            onClick={async () => {
              const res = await Swal.fire({
                title: "Delete?",
                text: row.title,
                icon: "warning",
                showCancelButton: true,
              });
              if (res.isConfirmed) {
                await api.delete(
                  `/cost_categories_tables/${category_id}/${row.uuid}`
                );
                fetchCostItems();
              }
            }}
          >
            Archieve
          </button>
        </div>
      ),
    },
  ];
  const handleView = (row) => {
    router.push(`/projects/${uuid}/${phaseuuid}/${category_id}/${row.uuid}`);
  };

  // Fetch cost items
  const fetchCostItems = async () => {
   
    setLoading(true);
    try {
      const res = await api.get(
        `/cost_categories_tables/${category_id}`
      );
      // console.log(res.data);

      if (res.status === 200) {
        setCostItems(res.data);
        // console.log("Fetching cost items for category:", res);
      } else {
        Swal.fire("Error", "Failed to fetch cost items", "error");
      }
    } catch {
      Swal.fire("Error", "Error fetching cost items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category_id) fetchCostItems();
  }, [category_id]);

  return (
    <div className={styles.container}>
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

      {loading ? (
        <Loading text="Loading cost items…" />
      ) : costItems.length === 0 ? (
        <p>No cost items found.</p>
      ) : (
        <Table
          columns={columns}
          data={costItems}
          sortKey={null}
          sortOrder={null}
          onSort={() => {}}
        />
      )}

      {/* Add Cost Item Modal */}
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

      {/* Edit Cost Item Modal */}
      {showEditModal && (
        <AddCostCategoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
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
    </div>
  );
}