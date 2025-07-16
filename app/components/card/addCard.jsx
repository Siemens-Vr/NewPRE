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
  editData = null, // if provided, we switch to edit mode
}) {
  // Local state for form values (syncs with FormModal)
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
  }, [editData, open]); // Reset also when opening

  // Fields for FormModal (no value/onChange here)
  const fields = [
    {
      name: "title",
      label: "Card Title",
      type: "text",
      placeholder: "Enter card title",
      disabled: isSaving,
    },
  ];

  // Handle add or edit
  const handleSubmit = async (submittedValues) => {
    setIsSaving(true);
    setError(null);

    const { title = "" } = submittedValues || {};

    if (!title.trim()) {
      setError("Card title is required.");
      setIsSaving(false);
      return;
    }

    try {
      let response;
      if (editData) {
        // Edit existing card
        response = await api.put(
          `/cost_categories/${editData.uuid}`,
          { uuid: editData.uuid, title: title.trim() },
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Add new card
        response = await api.post(
          `/cost_categories/${phaseUuid}`,
          { title: title.trim() },
          { headers: { "Content-Type": "application/json" } }
        );
      }
      if (response.status >= 200 && response.status < 300) {
        onAdded();
        setValues({ title: "" });
        onClose();
      } else {
        setError(editData ? "Failed to update card." : "Failed to add card.");
      }
    } catch (err) {
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
        title={editData ? "Edit Card" : "Add Card"}
        fields={fields}
        initialValues={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        extraActions={[]} // or any extra actions you want to show
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
