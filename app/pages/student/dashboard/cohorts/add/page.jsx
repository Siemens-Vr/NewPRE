"use client";

import React, { useState } from 'react';
import styles from '@/app/styles/cohorts/addCohort/addCohort.module.css';
import Spinner from '@/app/components/spinner/spinner';
import { config } from '/config';
import LevelForm from "@/app/components/cohort/AddLevel";
import api from '@/app/lib/utils/axios';

const CohortForm = ({ onClose }) => {
  const [cohortName, setCohortName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [levels, setLevels] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [cohortDateError, setCohortDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);

  // Cohort date validation on input
  const handleCohortStartDateChange = (value) => {
    setStartDate(value);
    if (new Date(endDate) && new Date(value) >= new Date(endDate)) {
      setCohortDateError('Cohort start date must be before end date.');
    } else {
      setCohortDateError('');
    }
  };

  const handleCohortEndDateChange = (value) => {
    setEndDate(value);
    if (new Date(startDate) && new Date(value) <= new Date(startDate)) {
      setCohortDateError('Cohort end date must be after start date.');
    } else {
      setCohortDateError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create one payload with both cohort and levels data
    const payload = {
      cohortName,
      startDate,
      endDate,
      levels, // Send all the levels as part of the cohort creation
    };

    console.log(payload)
    try {
      setLoading(true); // Start the loading spinner
   
      const cohortResponse = await api.post(`/cohorts`,payload);
      console.log(cohortResponse)
      // if (!cohortResponse.ok) {
      //   throw new Error('Failed to create cohort and levels');
      // }

      // const result = await cohortResponse.json();
      // console.log('Cohort and levels created:', result);

      // Show success message
      setShowSuccessMessage(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setCohortName('');
        setStartDate('');
        setEndDate('');
        setLevels([]);
      }, 3000);
    } catch (error) {
      console.error('Error creating cohort and levels:', error);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  const handleAddNewClick = () => {
    setShowAddNewPopup(true);
  };

  // Close the "Add New" level popup
  const handleClosePopup = () => {
    setShowAddNewPopup(false);
  };

  // Handler for when a level is saved in the LevelForm
  const handleLevelSave = (levelData) => {
    setLevels([...levels, levelData]);
    setShowAddNewPopup(false);
  };

  // Remove a level from the table
  const removeLevel = (index) => {
    const updatedLevels = [...levels];
    updatedLevels.splice(index, 1);
    setLevels(updatedLevels);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {showSuccessMessage && (
          <div className={styles.successMessage}>Cohort created successfully!</div>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cohort Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter cohort name"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Date</label>
              <input
                className={styles.input}
                type="date"
                value={startDate}
                onChange={(e) => handleCohortStartDateChange(e.target.value)}
                required
              />
              {cohortDateError && <p className='text-red-600 text-sm'>{cohortDateError}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>End Date</label>
              <input
                className={styles.input}
                type="date"
                value={endDate}
                onChange={(e) => handleCohortEndDateChange(e.target.value)}
                required
              />
              {cohortDateError && <p className='text-red-600 text-sm'>{cohortDateError}</p>}
            </div>

            
          </div>
        </form>
        {/* Display Levels Table */}
        {levels.length > 0 && (
              <div className={styles.facilitator}>
              <div className={styles.mainTable}>
                {/* <h3 className={styles.tableTitle}>Levels</h3> */}
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
                            onClick={() => removeLevel(index)}
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            )}

            <div className={styles.buttons2}>
              <button
                type="button"
                onClick={handleAddNewClick}
                className={`${styles.addButton} ${styles.button}`}
              >
                Add New Level
              </button>

              <button onClick={handleSubmit}className={`${styles.submitButtons} ${styles.button}`} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner/> Please wait...
                  </>
                ) : (
                  'Create Cohort'
                )}
              </button>
            </div>

        {showAddNewPopup && (
          <LevelForm 
            onClose={handleClosePopup}
            onSave={handleLevelSave}
            cohortStartDate={startDate}
            cohortEndDate={endDate}
          />
        )}
      </div>
    </div>
  );
};

export default CohortForm;