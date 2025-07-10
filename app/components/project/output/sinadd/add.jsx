// app/components/project/output/sinadd/add.jsx
"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function AddOutputModal({ open, onClose, onAdded, onEdited, phaseuuid, editData = null }) {
  // Initial form state
  const initial = { no: "", name: "", description: "", value: "0", output: null };
  const [values, setValues]     = useState(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError]       = useState("");

  // Preload editData or reset
  useEffect(() => {
    if (open) {
      if (editData) {
        setValues({
          no: editData.no?.toString() || "",
          name: editData.name || "",
          description: editData.description || "",
          value: editData.value?.toString() || "0",
          output: null, // user can optionally replace
        });
        setError("");
      } else {
        setValues(initial);
        setError("");
      }
    }
  }, [open, editData]);

  // Called by FormModal on submit
  const handleSubmit = async () => {
    setIsSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("no", values.no);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("value", values.value);
      if (values.output) {
        formData.append("output", values.output);
      }

      let res;
      if (editData) {
        res = await api.put(
          `/outputs/update/${editData.uuid}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await api.post(
          `/outputs/${phaseuuid}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.status === 201 || res.status === 200) {
        editData ? onEdited?.() : onAdded();
        onClose();
      } else {
        setError(editData ? "Failed to update output." : "Failed to add output.");
      }
    } catch (e) {
      console.error("SERVER ERROR RAW:", e.response?.data);
      const serverMsg = typeof e.response?.data === "string"
        ? e.response.data
        : JSON.stringify(e.response?.data, null, 2);
      setError(serverMsg || "Error saving output.");
    } finally {
      setIsSaving(false);
    }
  };

  // Fields for FormModal
  const fields = [
    {
      name:     "no",
      label:    "No",
      type:     "number",
      placeholder: "#",
      required: true,
      value:    values.no,
      onChange: e => setValues(v => ({ ...v, no: e.target.value })),
    },
    {
      name:     "name",
      label:    "Name",
      type:     "text",
      placeholder: "Name",
      required: true,
      value:    values.name,
      onChange: e => setValues(v => ({ ...v, name: e.target.value })),
    },
    {
      name:     "description",
      label:    "Description",
      type:     "textarea",
      placeholder: "Description",
      required: true,
      value:    values.description,
      onChange: e => setValues(v => ({ ...v, description: e.target.value })),
    },
    {
      name:     "value",
      label:    "Value",
      type:     "number",
      placeholder: "Δ Value",
      required: true,
      value:    values.value,
      onChange: e => setValues(v => ({ ...v, value: e.target.value })),
    },
    {
      name:     "output",
      label:    "Document",
      type:     "file",
      required: !editData, // require on add, optional on edit
      onChange: e => setValues(v => ({ ...v, output: e.target.files[0] })),
    },
  ];

  return (
    <FormModal
      isOpen={open}
      title={editData ? "Edit Output" : "Add Output"}
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel={isSaving ? (editData ? "Updating..." : "Saving...") : (editData ? "Update" : "Add")}
      disableSubmit={isSaving}
    >
      {error && (
        <div className={styles.errorMessage} style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
          {error}
        </div>
      )}
    </FormModal>
  );
}
