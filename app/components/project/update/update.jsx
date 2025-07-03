"use client";

import React from "react";
import FormModal from "@/app/components/Form/FormModal";
import styles from "@/app/styles/components/singleComponent/singlecomponent.module.css";

export default function EditProjectModal({
  editProjectData,
  setEditProjectData,
  updateProject,
  closeEditModal,
  isSaving,
}) {
  if (!editProjectData) return null;

  // Define form fields matching your project data keys
  const fields = [
    {
      name: "name",
      label: "Project Name",
      type: "text",
      placeholder: "Project Name",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Project Description",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "todo", label: "Todo" },
        { value: "progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      name: "budget",
      label: "Budget",
      type: "number",
      placeholder: "Budget",
    },
    {
      name: "funding",
      label: "Funding",
      type: "number",
      placeholder: "Funding",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
    },
  ];

  // Handle field changes: update project data state
  const handleChange = (updatedValues) => {
    setEditProjectData(updatedValues);
  };

  // Handle form submit
  const handleSubmit = () => {
    updateProject();
  };

  return (
    <FormModal
      title="Edit Project"
      fields={fields}
      initialValues={editProjectData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={closeEditModal}
      extraActions={[]}
      isSaving={isSaving} // Optional if you want to handle saving state in your FormModal styles
    />
  );
}
