"use client";

import React, { useState } from "react";
import FormModal from "@/app/components/Form/FormModal";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Swal from "sweetalert2";

export default function AddProjectModal({ isOpen, onClose, onAdded }) {
  // ==== Hooks always at top ====
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // ==== Early return only after hooks ====
  if (!isOpen) return null;

  // Initial values for the form
  const initialValues = {
    project_id: "",
    title: "",
    description: "",
    type: "Milestones",
    total_value: "",
    approved_funding: "",
    implementation_startDate: "",
    implementation_endDate: "",
  };

  const fields = [
    { name: "project_id", label: "Project ID", type: "text", placeholder: "Optional project ID" },
    { name: "title", label: "Title", type: "text", placeholder: "Project title" },
    { name: "total_value", label: "Total Value (Funds)", type: "number", placeholder: "Total value" },
    { name: "approved_funding", label: "Approved Funding", type: "number", placeholder: "Approved funding" },
    { name: "implementation_startDate", label: "Start Date", type: "date" },
    { name: "implementation_endDate", label: "End Date", type: "date" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "Milestones", label: "Milestones" },
        { value: "Work Package", label: "Work Package" },
        { value: "Duration Years", label: "Duration Years" },
      ],
    },
    { name: "description", label: "Description", type: "textarea", placeholder: "Project description" },
  ];

  const handleSubmit = async (values) => {
    setIsSaving(true);
    setError(null);

    const payload = {
      ...values,
      total_value: values.total_value ? Number(values.total_value) : null,
      approved_funding: values.approved_funding ? Number(values.approved_funding) : null,
    };

    try {
      const response = await api.post(`/projects`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          icon: "success",
          title: "Project added successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        onAdded();  // refresh parent list
        onClose();  // close modal
      } else {
        setError("Failed to add project.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      console.error("API error:", err.response?.data || err);
      setError(`API Error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Add New Project</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <FormModal
        title="Add Project"
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        extraActions={[]}
        isSaving={isSaving}
      />
    </div>
  );
}
