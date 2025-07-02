"use client";

import React, { useState } from "react";
import FormModal from "@/app/components/Form/FormModal";
import Select from "react-select";

const FacilitatorFormModal = ({ onClose, onAddFacilitator, facilitators }) => {
  const [formValues, setFormValues] = useState({
    facilitator: null,
    role: null,
  });

  const roleOptions = [
    { value: 'Theory Instructor', label: 'Theory Instructor' },
    { value: 'Practical Instructor', label: 'Practical Instructor' },
  ];

  const handleFormChange = (updated) => {
    setFormValues(updated);
  };

 const handleSubmit = () => {
  const { facilitator: facilitatorId, role } = formValues;

  // Find the full facilitator object from facilitators list
  const fullFacilitator = facilitators.find(fac => fac.uuid === facilitatorId);

  if (fullFacilitator && role) {
    onAddFacilitator({
      uuid: fullFacilitator.uuid,
      name: `${fullFacilitator.firstName} ${fullFacilitator.lastName}`, // full name string
      role: role,  // role is already the string from select
    });
    onClose();
  } else {
    alert("Please select a valid facilitator and role");
  }
};


  const fields = [
    {
      name: 'facilitator',
      label: 'Select Facilitator',
      type: 'select',
      options: facilitators.map(fac => ({
        value: fac.uuid,
        label: `${fac.firstName} ${fac.lastName}`,
      })),
    },
    {
      name: 'role',
      label: 'Select Role',
      type: 'select',
      options: roleOptions
    }
  ];

  return (
    <FormModal
      title="Add Facilitator"
      fields={fields}
      initialValues={formValues}
      onSubmit={handleSubmit}
      onAdd={() => {}}
      onChange={handleFormChange}
      onClose={onClose}
    />
  );
};

export default FacilitatorFormModal;
