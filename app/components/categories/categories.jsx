// app/components/categories/CategoriesPopUp.jsx
"use client";
import React, { useState } from 'react';
import FormModal from '@/app/components/Form/FormModal';
import api from '@/app/lib/utils/axios';

export default function CategoriesPopUp({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // initial form values
  const initialValues = { categories: "" };

  // called with { categories: "a, b, c" }
  const handleSubmit = async ({ categories }) => {
    setLoading(true);
    setError(null);

    // build array
    const cats = categories
      .split(",")
      .map(c => c.trim())
      .filter(c => c);

    if (cats.length === 0) {
      setError("Please enter at least one category.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/categories", { categories: cats });
      if (res.status === 200) {
        onClose();
      } else {
        setError("Failed to add categories");
      }
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // our single form field
  const fields = [
    {
      name:        "categories",
      label:       "Component Types (comma-separated)",
      type:        "textarea",
      placeholder: "e.g. Mechanical, Electrical, Pneumatics",
    },
  ];

  return (
    <FormModal
      title="Add New Component Types"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {/* extra UI below the fields */}
      {loading && <p style={{ color:"#888" }}>Adding, please wait…</p>}
      {error   && <p style={{ color:"red"   }}>{error}</p>}
    </FormModal>
  );
}
