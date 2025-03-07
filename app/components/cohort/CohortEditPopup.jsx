import React, { useState } from 'react';

import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css'

const CohortEditPopup = ({ cohortData, onClose, onUpdate }) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  const [formData, setFormData] = useState({
    cohortName: cohortData.cohortName,
    startDate: formatDate(cohortData.startDate),
    endDate: formatDate(cohortData.endDate),
    // Add any additional cohort-specific fields here
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
    };
    onUpdate(formattedData);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Edit Cohort Details</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="cohortName">Name:</label>
            <input
              type="text"
              id="cohortName"
              name="cohortName"
              value={formData.cohortName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          {/* Add any additional fields as needed */}
          <div className={styles.popupActions}>
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CohortEditPopup;
