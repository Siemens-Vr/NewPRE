"use client";

import React from "react";
import FormModal from "@/app/components/Form/FormModal";

export default function EditProjectModal({
  editProjectData,
 setEditProjectData,
  updateProject,
  closeEditModal,
  isSaving,
}) {
  console.log("EditProjectModal props:", 
    editProjectData,
  );
  // const project = editProjectData.editProjectData || null;  
  if (!editProjectData) return null;

  const fields = [
    { name: "title",                     label: "Project Name",   type: "text"   },
    { name: "description",               label: "Description",    type: "text"   },
    { name: "total_value",                    label: "Total Value",         type: "number" },
    { name: "approved_funding",                   label: "Approved Funding",        type: "number" },
    { name: "implementation_startDate",  label: "Start Date",     type: "text"   },
    { name: "implementation_endDate",    label: "End Date",       type: "text"   },
  ];

  return (
    <FormModal
      isOpen={true}
      title="Edit Project"
      fields={fields}
      initialValues={editProjectData}
      onChange={setEditProjectData}
      onSubmit={updateProject}
      onClose={closeEditModal}
      isSaving={isSaving}
    />
  );
}