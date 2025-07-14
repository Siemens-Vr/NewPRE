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
  }, [editData, isOpen]);

  const fields = [
    {
      name: "no",
      label: "No",
      type: "number",
      placeholder: "Number"
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Title"
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      placeholder: "Amount"
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Description"
    }
  ];

  const handleAdd = async (formValues) => {
    if (!costCategoryId) {
      setError("Card ID missing.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        no: Number(formValues.no),
        title: formValues.title,
        description: formValues.description,
        total_amount: Number(formValues.total_amount),
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
      setError(e.response?.data?.message || "Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (formValues) => {
    if (!costCategoryId || !editData?.uuid) {
      setError("Missing identifiers for edit.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        no: Number(formValues.no),
        title: formValues.title,
        description: formValues.description,
        total_amount: Number(formValues.total_amount),
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
      setError(e.response?.data?.message || "Error updating.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (formValues) => {
    editData ? handleEdit(formValues) : handleAdd(formValues);
  };

  if (!isOpen) return null;

  return (
    <div>
      <FormModal
        isOpen={isOpen}
        title={editData ? "Edit Cost Item" : "Add Cost Item"}
        fields={fields}
        initialValues={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        disableSubmit={isSaving}
        submitLabel={isSaving ? "Saving…" : editData ? "Update" : "Add"}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
