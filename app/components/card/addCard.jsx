"use client";

import React, { useState } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddCardModal({ isOpen, onClose, onAdded, phaseUuid }) {
  const initialValues = {
    title: "",
  };

  const fields = [
    {
      name: "title",
      label: "Card Title",
      type: "text",
      placeholder: "Enter card title",
    },
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setIsSaving(true);
    setError(null);

    if (!values.title.trim()) {
      setError("Card title is required.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await api.post(
        `/cost_categories/${phaseUuid}`,
        { title: values.title.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
console.log("Response:", response);
      if (response.status === 201) {
        onAdded();
        onClose();
      } else {
        setError("Failed to add card.");
      }
    } catch (err) {
      setError("An error occurred while adding the card.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
      <FormModal
        title="Add Card"
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        extraActions={[]}
        isSaving={isSaving}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
