"use client";

import React, { useState } from "react";
import FormModal from "@/app/components/Form/formTable";
import styles from "@/app/styles/cohorts/addCohort/addCohort.module.css";
import api from "@/app/lib/utils/axios";
import Spinner from "@/app/components/spinner/spinner";
import AddLevelForm from "@/app/components/cohort/AddLevel";

export default function AddCohortPage({ onClose}) {
  const [cohortFormValues, setCohortFormValues] = useState({
    cohortName: "",
    startDate: "",
    endDate: "",
  });
  const [levels, setLevels] = useState([]);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [dateError, setDateError] = useState("");

  // Cohort form change
  const handleCohortChange = (vals) => {
    setCohortFormValues(vals);
  };

  // Add a level from the popup
  const handleAddLevel = (levelData) => {
    setLevels((prev) => [...prev, levelData]);
    setShowAddLevelModal(false);
  };

  // Remove a level row
  const handleRemoveLevel = (idx) => {
    setLevels((prev) => prev.filter((_, i) => i !== idx));
  };

  // Simple date validation
  const validateDates = ({ startDate, endDate }) => {
    if (new Date(startDate) >= new Date(endDate)) {
      return "Cohort start date must be before end date.";
    }
    return "";
  };

  // Final submit
  const handleSubmit = async () => {
    const err = validateDates(cohortFormValues);
    if (err) {
      setDateError(err);
      return;
    }

    const payload = {
  cohortName: cohortFormValues.cohortName,
  startDate:  new Date(cohortFormValues.startDate).toISOString(),
  endDate:    new Date(cohortFormValues.endDate).toISOString(),
  levels,   // array of readyLevel objects
};
console.log("Submitting cohort data:", levels, payload);
   try {
 const res = await api.post("/cohorts", payload);
    // only call onSave if it exists:
    if (typeof onSave === "function") {
      onSave(res.data);
    }
    // then always close the form or navigate away:
    onClose();
    await fetchCohorts(); // refresh the cohort list
    toast.success("Cohort created successfully!");
}  catch (err) {
  console.error("Full Axios error:", err);
  console.error("Error code:", err.code);
  console.error("Error message:", err.message);
  console.error("Request that was sent:", err.request);
  if (err.response) {
    console.error("Response status:", err.response.status);
    console.error("Response data:", err.response.data);
  }
}
}

  const cohortFields = [
    { name: "cohortName", label: "Cohort Name", type: "text" },
    { name: "startDate",   label: "Start Date",   type: "date" },
    { name: "endDate",     label: "End Date",     type: "date" },
  ];

  const levelsTable = levels.length ? (
    <table className={styles.infoTable}>
      <thead>
        <tr>
          <th>Level</th>
          <th>Start</th>
          <th>End</th>
          <th>Facilitators</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((lvl, i) => (
          <tr key={i}>
            <td>{lvl.levelName}</td>
            <td>{new Date(lvl.startDate).toLocaleDateString()}</td>
            <td>{new Date(lvl.endDate).toLocaleDateString()}</td>
            <td>{lvl.facilitators.map((f) => f.name).join(", ")}</td>
            <td>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveLevel(i)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No levels yet</p>
  );

  return (
    <>
      <FormModal
        title="Create New Cohort"
        fields={cohortFields}
        initialValues={cohortFormValues}
        onChange={handleCohortChange}
        onSubmit={handleSubmit}
        onClose={onClose}
        onAdd={() => setShowAddLevelModal(true)}
        tableContent={
          <>
            {dateError && (
              <p className="text-red-600 text-center">{dateError}</p>
            )}
            {levelsTable}
          </>
        }
      />

      {showAddLevelModal && (
        <AddLevelForm
          onClose={() => setShowAddLevelModal(false)}
          onSave={handleAddLevel}
          cohortStartDate={cohortFormValues.startDate}
          cohortEndDate={cohortFormValues.endDate}
        />
      )}
    </>
  );
}
