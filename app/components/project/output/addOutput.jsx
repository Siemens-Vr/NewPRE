"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddCostCategoryModal({
  isOpen,
  onClose,
  onAdded,
  costCategoryId,
  editData = null,
}) {
  const initialValues = { no: "", title: "", total_amount: "", description: "" };
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    // console.log( costCategoryId);
  }, [costCategoryId]);
  useEffect(() => {
    if (editData) {
      setValues({
        ...editData,
        total_amount: editData.total_amount?.toString(),
      });
    } else {
      setValues(initialValues);
    }
  }, [editData]);

  const fields = [
    { name: "no", label: "No", type: "number", placeholder: "Number", required: true },
    { name: "title", label: "Title", type: "text", placeholder: "Title", required: true },
    { name: "total_amount", label: "Total Amount", type: "number", placeholder: "Amount", required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
  ];

  // Create new cost item
  const handleAdd = async () => {
    if (!costCategoryId) {
      setError("Card ID missing.");
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const res = await api.post(`/cost_categories_tables/${costCategoryId}`, {
        no:         values.no,
        title:      values.title,
        total_amount: Number(values.total_amount),
        description:  values.description,
}, {
  headers: { "Content-Type": "application/json" }
});
      if (res.status === 201) {
        onAdded();
        onClose();
        console.log("Cost item added successfully:", res.data);
      } else {
        setError("Save failed.");
      }
    } catch (e) {
      console.error(e);
      setError("Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing cost item
  const handleEdit = async () => {
    if (!costCategoryId || !editData?.uuid) {
      setError("Missing identifiers for edit.");
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const res = await api.put(
        `/cost_categories_tables/${costCategoryId}/${editData.uuid}`,
        {
          no: values.no,
          title: values.title,
          total_amount: Number(values.total_amount),
          description: values.description,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status >= 200 && res.status < 300) {
        onAdded();
        onClose();
      } else {
        setError("Update failed.");
      }
    } catch (e) {
      console.error(e);
      setError("Error updating.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    editData ? handleEdit() : handleAdd();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
      <FormModal
        title={editData ? "Edit Cost Item" : "Add Cost Item"}
        fields={fields}
        initialValues={values}
        onSubmit={handleSubmit}
        onClose={onClose}
        isSaving={isSaving}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
