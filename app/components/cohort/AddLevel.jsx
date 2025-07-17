"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/formTable";
import api from "@/app/lib/utils/axios";
import FacilitatorPopup from "@/app/components/cohort/FacilitatorPopUp";

export default function AddLevelForm({
  onClose,
  onSave,
  cohortStartDate,
  cohortEndDate,
}) {
  const [formValues, setFormValues] = useState({
    levelName: "",
    startDate: "",
    endDate: "",
    exam_dates: "",
    exam_quotation_number: "",
    facilitators: [],
  });
  const [facList, setFacList] = useState([]);
  const [showFacPopup, setShowFacPopup] = useState(false);
  const [dateError, setDateError] = useState("");
  const [facilitatorsList, setFacilitatorsList] = useState([]);

  const levelOptions = [
    { value: "SMSCP Level 1", label: "SMSCP Level 1" },
    { value: "SMSCP Level 2", label: "SMSCP Level 2" },
    { value: "SMSCP Level 3", label: "SMSCP Level 3" },
  ];
useEffect(() => {
  api.get("/facilitators")
     .then(res => setFacilitatorsList(res.data || []))
     .catch(() => setFacilitatorsList([]));
}, []);

  const validateDates = () => {
    const s = new Date(formValues.startDate);
    const e = new Date(formValues.endDate);
    const cs = new Date(cohortStartDate);
    const ce = new Date(cohortEndDate);

    if (s >= e) {
      return "End must be after start.";
    }
    if (cs && ce && (s < cs || e > ce)) {
      return "Level must sit within cohort dates.";
    }
    return "";
  };

  const handleSubmit = () => {
    const err = validateDates();
    if (err) {
      setDateError(err);
      return;
    }
    // everything’s valid!
     const readyLevel = {
    levelName:             formValues.levelName,
    startDate:             new Date(formValues.startDate).toISOString(),
    endDate:               new Date(formValues.endDate).toISOString(),
    exam_dates:            formValues.exam_dates
                             ? new Date(formValues.exam_dates).toISOString()
                             : null,
    exam_quotation_number: formValues.exam_quotation_number,
    facilitators:          formValues.facilitators   // already {value,role}
  };

   onSave(readyLevel);
   onClose();
  };
const openFacilitatorPopup = () => {
  if (facilitatorsList.length === 0) {
    alert("No facilitators available yet.");
    return;
  }
  setShowFacilitatorPopup(true);
};
  // when FormModal calls onChange
  const handleChange = (vals) => setFormValues(vals);

  const addFacilitator = (fac) => {
    if (!formValues.facilitators.some((f) => f.uuid === fac.uuid)) {
     setFormValues(prev => ({
    ...prev,
    facilitators: [...prev.facilitators, {
      value: fac.value,
      role:  fac.role
    }]
  }));
    }
    setShowFacPopup(false);
  };

  const removeFac = (i) => {
    setFormValues((prev) => ({
      ...prev,
      facilitators: prev.facilitators.filter((_, idx) => idx !== i),
    }));
  };

  const levelFields = [
    {
      name: "levelName",
      label: "Level",
      type: "select",
      options: levelOptions,
      required: true,
    },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date", required: true },
    { name: "exam_dates", label: "Exam Date", type: "date" },
    {
      name: "exam_quotation_number",
      label: "Quotation #",
      type: "text",
    },
  ];

  const facTable = formValues.facilitators.length ? (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {formValues.facilitators.map((f, i) => (
          <tr key={i}>
            <td>{f.name}</td>
            <td>{f.role}</td>
            <td>
              <button onClick={() => removeFac(i)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No facilitators</p>
  );

  return (
    <>
      <FormModal
        title="Add Level"
        fields={levelFields}
        initialValues={formValues}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onAdd={() => setShowFacPopup(true)}
        onClose={onClose}
        extraActions={[
          {
            label:"+ Add Facilitator",
            onClick: openFacilitatorPopup
          },
        ]}
        tableContent={
          <>
            {dateError && (
              <p className="text-red-600 text-center">{dateError}</p>
            )}
            {facTable}
          </>
        }
      />

      {showFacPopup && (
        <FacilitatorPopup
          onClose={() => setShowFacPopup(false)}
          facilitators={facList}
          onAddFacilitator={addFacilitator}
        />
      )}
    </>
  );
}
