"use client";

import React, { useState } from "react";
import FormModal from "@/app/components/Form/formTable";
import styles from "@/app/styles/cohorts/addCohort/addCohort.module.css";
import api from "@/app/lib/utils/axios";
import Spinner from "@/app/components/spinner/spinner";
import LevelForm from "@/app/components/cohort/AddLevel";

const AddCohortPage = ({ onClose, onSave }) => {
  const [levels, setLevels] = useState([]);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [cohortDateError, setCohortDateError] = useState('');

  // Manage cohort form fields here
  const [cohortFormValues, setCohortFormValues] = useState({
    cohortName: "",
    startDate: "",
    endDate: ""
  });

  // Handle cohort form changes from FormModal
  const handleCohortFormChange = (updatedValues) => {
    setCohortFormValues(updatedValues);
  };

  const handleAddLevel = (levelData) => {
    setLevels([...levels, levelData]);
    console.log("Added level:", levelData);
    setShowAddLevelModal(false);
  };

  const handleRemoveLevel = (index) => {
    const updated = [...levels];
    updated.splice(index, 1);
    setLevels(updated);
  };

  const validateDates = (startDate, endDate) => {
    if (new Date(startDate) >= new Date(endDate)) {
      return 'Cohort start date must be before end date.';
    }
    return '';
  };

  const handleSubmit = async (values) => {
    const error = validateDates(values.startDate, values.endDate);
    if (error) {
      setCohortDateError(error);
      return;
    }

    const payload = {
      ...values,
      levels,
    };

    try {
      const res = await api.post(`/cohorts`, payload);
      onSave?.(res.data);
      onClose();
    } catch (error) {
      console.error("Failed to create cohort:", error);
    }
  };

  const fields = [
    { name: 'cohortName', label: 'Cohort Name', type: 'text', placeholder: 'Enter cohort name' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
  ];

  const levelsTable = levels.length > 0 ? (
    <table className={styles.infoTable}>
      <thead>
        <tr>
          <th>Level Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level, index) => (
          <tr key={index}>
            <td>{level.levelName}</td>
            <td>{new Date(level.startDate).toLocaleDateString()}</td>
            <td>{new Date(level.endDate).toLocaleDateString()}</td>
            <td>
              <button
                type="button"
                onClick={() => handleRemoveLevel(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p>No levels added yet.</p>;

  return (
    <>
      <FormModal
        title="Create New Cohort"
        fields={fields}
        initialValues={cohortFormValues}
        onChange={handleCohortFormChange}  
        onSubmit={handleSubmit}
        onClose={onClose}
        onAdd={() => setShowAddLevelModal(true)}
        tableContent={levelsTable}
        extraActions={[]}
      />

      {showAddLevelModal && (
        <LevelForm
          onClose={() => setShowAddLevelModal(false)}
          onSave={handleAddLevel}
          cohortStartDate={cohortFormValues.startDate}
          cohortEndDate={cohortFormValues.endDate}
        />
      )}
    </>
  );
};

export default AddCohortPage;
