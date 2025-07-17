"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import Spinner from "@/app/components/spinner/spinner";
import api from "@/app/lib/utils/axios";

export default function FacilitatorFormModal({ onClose, onAddFacilitator }) {
  const [options, setOptions] = useState(null);
  const [formValues, setFormValues] = useState({
    facilitator: "",
    role: "",
  });

  // 1) Fetch once on mount
  useEffect(() => {
    api
      .get("/facilitators")
      .then((res) => {
        // map API data into { value,label } shape
        const opts = Array.isArray(res.data)
          ? res.data.map((f) => ({
              value: f.uuid,
              label: `${f.firstName} ${f.lastName}`,
            }))
          : [];
        setOptions(opts);
      })
      .catch((_) => setOptions([]));
  }, []);

  // 2) If still loading, show spinner
  if (options === null) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spinner />
      </div>
    );
  }

  const roleOptions = [
    { value: "Theory Instructor", label: "Theory Instructor" },
    { value: "Practical Instructor", label: "Practical Instructor" },
  ];

  // 3) When user hits “Done” (or clicks Add), validate & bubble up
  const handleSubmit = () => {
    const { facilitator, role } = formValues;
    console.log("Submitting facilitator:", formValues);
    if (!facilitator || !role) {
      return alert("Please select both facilitator and role.");
    }
    onAddFacilitator({ value: facilitator, role });
    onClose();
  };

  return (
    <FormModal
      title="Add Facilitator"
      fields={[
        {
          name: "facilitator",
          label: "Select Facilitator",
          type: "select",
          options: options,
        },
        {
          name: "role",
          label: "Select Role",
          type: "select",
          options: roleOptions,
        },
      ]}
      initialValues={formValues}
      onChange={(vals) => setFormValues(vals)}
      onAdd={handleSubmit}
      onSubmit={handleSubmit}
      onClose={onClose}
      extraActions={[]}
    />
  );
}
