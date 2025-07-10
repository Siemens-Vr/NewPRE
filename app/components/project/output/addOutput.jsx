// app/components/project/output/AddCostCategoryModal.jsx
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
  const empty = { no: "", title: "", total_amount: "", description: "" };
  const [values, setValues] = useState(empty);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // When we switch into “edit” mode, preload the form
  useEffect(() => {
    if (editData) {
      setValues({
        no: editData.no?.toString() || "",
        title: editData.title || "",
        total_amount: editData.total_amount?.toString() || "",
        description: editData.description || "",
      });
    } else {
      setValues(empty);
    }
  }, [editData]);

  // Define your fields, wiring up value + onChange
  const fields = [
    {
      name: "no",
      label: "No",
      type: "number",
      placeholder: "Number",
      value: values.no,
      onChange: (e) => setValues((v) => ({ ...v, no: e.target.value })),
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Title",
      value: values.title,
      onChange: (e) => setValues((v) => ({ ...v, title: e.target.value })),
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      placeholder: "Amount",
      value: values.total_amount,
      onChange: (e) =>
        setValues((v) => ({ ...v, total_amount: e.target.value })),
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Description",
      value: values.description,
      onChange: (e) =>
        setValues((v) => ({ ...v, description: e.target.value })),
    },
  ];

  // Add vs. Edit handlers
  const handleAdd = async () => {
    if (!costCategoryId) {
      setError("Card ID missing.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        no: Number(values.no),
        title: values.title,
        description: values.description,
        total_amount: Number(values.total_amount),
      };
      const res = await api.post(
        `/cost_categories_tables/${costCategoryId}`,
        payload
      );
      if (res.status === 201) {
        onAdded();
        onClose();
      } else {
        setError("Save failed.");
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!costCategoryId || !editData?.uuid) {
      setError("Missing identifiers for edit.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        no: Number(values.no),
        title: values.title,
        description: values.description,
        total_amount: Number(values.total_amount),
      };
      const res = await api.put(
        `/cost_categories_tables/${costCategoryId}/${editData.uuid}`,
        payload
      );
      if (res.status >= 200 && res.status < 300) {
        onAdded();
        onClose();
      } else {
        setError("Update failed.");
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Error updating.");
    } finally {
      setIsSaving(false);
    }
  };

  // This is called by FormModal
  const handleSubmit = () => {
    editData ? handleEdit() : handleAdd();
  };

  // Don’t render anything if closed
  if (!isOpen) return null;

  return (
    <div>
      <FormModal
        isOpen={isOpen}
        title={editData ? "Edit Cost Item" : "Add Cost Item"}
        fields={fields}
        onSubmit={handleSubmit}
        onClose={onClose}
        disableSubmit={isSaving}
        submitLabel={isSaving ? "Saving…" : editData ? "Update" : "Add"}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
