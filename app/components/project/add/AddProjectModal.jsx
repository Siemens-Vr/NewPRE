"use client";

import React, { useState } from "react";

import FormModal from "@/app/components/Form/FormModal";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";
import api from "@/app/lib/utils/axios";
import Swal from "sweetalert2";

export default function AddProjectModal({ isOpen, onClose, onAdded }) {
    const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  if (!isOpen) return null;



  // Align initial values with model fields
  const initialValues = {
    project_id: "",           // Optional string identifier
    title: "",
    description: "",
    type: "Milestones",       // default per model
    total_value: "",          // decimal input as string for now
    approved_funding: "",     // decimal input as string for now
    implementation_startDate: "",
    implementation_endDate: "",
  };

  // Form fields matching your model
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

  // Handle form submission
  const handleSubmit = async (values) => {
  setIsSaving(true);
  setError(null);

  // Validations (same as yours)...

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
      onAdded(); // Call the callback to refresh projects (optional)
      onClose(); // Close the modal
      // router.push("/pages/project/dashboard"); // optional, if you want to navigate away
    } else {
      setError("Failed to add project.");
    }
  } catch (err) {
    if (err.response) {
      console.error("API error response:", err.response.data);
      setError(`API Error: ${err.response.data.message || "Unknown error"}`);
    } else {
      console.error("Error adding project:", err.message);
      setError("An error occurred while adding the project.");
    }
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
