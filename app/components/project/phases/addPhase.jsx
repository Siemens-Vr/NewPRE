"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddPhaseModal({ isOpen, onClose, onAdded, projectUuid, phaseType  }) {
  const initialValues = {
    no:0,
    title: "",
    description: "",
    implementation_startDate: "",
    implementation_endDate: "",
    status: "",
    projectId: projectUuid || "",
  };

  const fields = [
    {name:"no", label: " Number", type: "number", placeholder: `Enter ${phaseType} number` },
    { name: "title", label: `${phaseType} Title`, type: "text", placeholder: `Enter ${phaseType} title` },
    { name: "implementation_startDate", label: "Start Date", type: "date" },
    { name: "implementation_endDate", label: "End Date", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "Select Status" },
        { value: "todo", label: "To Do" },
        { value: "progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },
     { name: "description", label: `${phaseType} Description`, type: "textarea", placeholder: `Enter ${phaseType} description` },
    // projectId is hidden or read-only field, no input needed from user
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error when modal opens/closes
    if (!isOpen) setError(null);
  }, [isOpen]);

  const handleSubmit = async (values) => {
    setIsSaving(true);
    setError(null);

    // Validation
    if (!values.title.trim()) {
      setError("Title is required.");
      setIsSaving(false);
      return;
    }
    if (!values.description.trim()) {
      setError("Description is required.");
      setIsSaving(false);
      return;
    }
    if (!values.implementation_startDate || !values.implementation_endDate) {
      setError("Start and End dates are required.");
      setIsSaving(false);
      return;
    }
    if (new Date(values.implementation_endDate) < new Date(values.implementation_startDate)) {
      setError("End Date cannot be before Start Date.");
      setIsSaving(false);
      return;
    }
    if (!values.status) {
      setError("Status is required.");
      setIsSaving(false);
      return;
    }

    const payload = {
      no: values.no, // include number field in payload
      title: values.title,
      description: values.description,
      implementation_startDate: values.implementation_startDate,
      implementation_endDate: values.implementation_endDate,
      status: values.status,
      projectId: projectUuid,
      // type: phaseType, // send phase type for backend logic
    };
    console.log("Submitting payload:", payload);  

    try {
      const response = await api.post(`/milestones/${projectUuid}`, payload, {
        
        headers: { "Content-Type": "application/json" },
    
      });
      console.log("Response:", response);

      if (response.status === 201) {
        onAdded();  // refresh parent
        onClose();
        console.log(" added successfully:", response.data);
      } else {
        setError("Failed to add phase.");
      }
    } catch (err) {
      console.error("Error adding phase:", err);
      setError("An error occurred while adding the phase.");
    } finally {
      setIsSaving(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
      <FormModal
        title={`Add ${phaseType}`}
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
