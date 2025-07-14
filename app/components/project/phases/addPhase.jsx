// File: app/components/project/phases/addPhase.jsx
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
  editData = null,
  isEditing = false,
}) {
  // common fields
  const fields = [
    { name: "no", type: "number", label: "Number", placeholder: `Enter ${phaseType} number` },
    { name: "title", type: "text", label: `${phaseType} Title`, placeholder: `Enter ${phaseType} title` },
    { name: "implementation_startDate", type: "date", label: "Start Date" },
    { name: "implementation_endDate", type: "date", label: "End Date" },
    {
      name: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "", label: "Select Status" },
        { value: "todo", label: "To Do" },
        { value: "progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: `${phaseType} Description`,
      placeholder: `Enter ${phaseType} description`,
    },
  ];

  const formatDateForInput = (d) => d ? new Date(d).toISOString().split("T")[0] : "";

  const getInitialValues = () => {
    if (isEditing && editData) {
      return {
        no: editData.no || 0,
        title: editData.title || "",
        implementation_startDate: formatDateForInput(editData.implementation_startDate),
        implementation_endDate: formatDateForInput(editData.implementation_endDate),
        status: editData.status || "",
        description: editData.description || "",
        uuid: editData.uuid,
      };
    }
    return {
      no: 0,
      title: "",
      implementation_startDate: "",
      implementation_endDate: "",
      status: "",
      description: "",
    };
  };

  const [initialValues, setInitialValues] = useState(getInitialValues());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInitialValues(getInitialValues());
    if (!isOpen) setError("");
  }, [editData, isEditing, isOpen]);

  const validate = (vals) => {
    if (!vals.title.trim()) return "Title is required.";
    if (!vals.description.trim()) return "Description is required.";
    if (!vals.implementation_startDate || !vals.implementation_endDate)
      return "Start and End dates are required.";
    if (new Date(vals.implementation_endDate) < new Date(vals.implementation_startDate))
      return "End Date cannot be before Start Date.";
    if (!vals.status) return "Status is required.";
    return "";
  };

  const handleSubmit = async (values) => {
    setError("");
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const payload = {
      no: values.no,
      title: values.title,
      description: values.description,
      implementation_startDate: values.implementation_startDate,
      implementation_endDate: values.implementation_endDate,
      status: values.status,
      projectId: projectUuid,
    };

    try {
      let res;
      if (isEditing && values.uuid) {
        // UPDATE
        res = await api.put(
          `/milestones/update/${values.uuid}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
        );
      } else {
        // CREATE
        res = await api.post(
          `/milestones/${projectUuid}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
        );
      }

      if (res.status === 200 || res.status === 201) {
        onAdded();
        onClose();
      } else {
        setError(`Failed to ${isEditing ? "update" : "add"} ${phaseType.toLowerCase()}.`);
      }
    } catch (err) {
      // Extract a useful message
      const errMsg = err.response?.data?.error
        || err.response?.data?.message
        || err.message
        || "Unknown server error";
      console.error("Phase creation/updating failed:", err);
      setError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <FormModal
        isOpen={isOpen}
        title={`${isEditing ? "Edit" : "Add"} ${phaseType}`}
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
