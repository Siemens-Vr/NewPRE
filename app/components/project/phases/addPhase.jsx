"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddPhaseModal({ 
  isOpen, 
  onClose, 
  onAdded, 
  projectUuid, 
  phaseType,
  editData = null,      // NEW: data to edit
  isEditing = false     // NEW: edit mode flag
}) {
  // Default initial values
  const defaultInitialValues = {
    no: 0,
    title: "",
    description: "",
    implementation_startDate: "",
    implementation_endDate: "",
    status: "",
    projectId: projectUuid || "",
  };

  // NEW: Function to get initial values based on mode
  const getInitialValues = () => {
    if (isEditing && editData) {
      // Format dates for date inputs (YYYY-MM-DD format)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      return {
        no: editData.no || 0,
        title: editData.title || "",
        description: editData.description || "",
        implementation_startDate: formatDateForInput(editData.implementation_startDate),
        implementation_endDate: formatDateForInput(editData.implementation_endDate),
        status: editData.status || "",
        projectId: projectUuid || "",
        uuid: editData.uuid // Keep the UUID for updates
      };
    }
    return defaultInitialValues;
  };

  // NEW: Dynamic initial values that update when editData changes
  const [initialValues, setInitialValues] = useState(getInitialValues());

  const fields = [
    { name: "no", label: "Number", type: "number", placeholder: `Enter ${phaseType} number` },
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
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Update initial values when editData changes
  useEffect(() => {
    setInitialValues(getInitialValues());
  }, [editData, isEditing, projectUuid]);

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
      no: values.no,
      title: values.title,
      description: values.description,
      implementation_startDate: values.implementation_startDate,
      implementation_endDate: values.implementation_endDate,
      status: values.status,
      projectId: projectUuid,
    };

    // NEW: Different API calls for add vs edit
    try {
      let response;
      
      if (isEditing && editData?.uuid) {
        // UPDATE existing phase
        console.log("Updating phase with payload:", payload);
        response = await api.put(`/milestones/update/${editData.uuid}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Update response:", response);
      } else {
        // CREATE new phase
        console.log("Creating new phase with payload:", payload);
        response = await api.post(`/milestones/${projectUuid}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Create response:", response);
      }

      // Check for success status codes
      if (response.status === 201 || response.status === 200) {
        onAdded();  // refresh parent
        onClose();
        console.log(`${phaseType} ${isEditing ? 'updated' : 'added'} successfully:`, response.data);
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'add'} ${phaseType.toLowerCase()}.`);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} phase:`, err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'adding'} the ${phaseType.toLowerCase()}.`);
    } finally {
      setIsSaving(false); // FIX: This was incorrectly set to true
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <FormModal
        isOpen={isOpen}
        title={`${isEditing ? 'Edit' : 'Add'} ${phaseType}`} 
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