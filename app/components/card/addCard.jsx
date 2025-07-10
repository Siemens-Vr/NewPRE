// app/components/card/AddCardModal.jsx
"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddCardModal({
  open,
  onClose,
  onAdded,
  phaseUuid,
  editData = null,   // if provided, we switch to edit mode
}) {
  // Local state for form values
  const [values, setValues] = useState({ title: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // When editData changes, preload the form
  useEffect(() => {
    if (editData) {
      setValues({ title: editData.title || "" });
    } else {
      setValues({ title: "" });
    }
  }, [editData]);

  // Define the fields for FormModal
  const fields = [
    {
      name: "title",
      label: "Card Title",
      type: "text",
      placeholder: "Enter card title",
      value: values.title,
      onChange: (e) => setValues(prev => ({ ...prev, title: e.target.value })),
    },
  ];

  // Handle both add and edit
  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);

    if (!values.title.trim()) {
      setError("Card title is required.");
      setIsSaving(false);
      return;
    }

    try {
      let response;
      if (editData) {
        // Edit existing card
        response = await api.put(
          `/phases/${phaseUuid}/cards/${editData.uuid}`,
          { title: values.title.trim() },
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Add new card
        response = await api.post(
          `/cost_categories/${phaseUuid}`,
          { title: values.title.trim() },
          { headers: { "Content-Type": "application/json" } }
        );
      }
      console.log("Response:", response);

      if (response.status >= 200 && response.status < 300) {
        onAdded();
        setValues({ title: "" });
        onClose();
      } else {
        setError(editData ? "Failed to update card." : "Failed to add card.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          (editData
            ? "An error occurred while updating the card."
            : "An error occurred while adding the card.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render if not open
  if (!open) return null;

  return (
    <div>
      <FormModal
        isOpen={open}
        title={editData ? "Edit Card" : "Add Card"}
        fields={fields}
        onSubmit={handleSubmit}
        onClose={onClose}
        disableSubmit={isSaving}
        submitLabel={
          isSaving
            ? editData
              ? "Updating..."
              : "Saving..."
            : editData
            ? "Update Card"
            : "Add Card"
        }
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
