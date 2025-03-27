"use client";

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from '@/app/styles/cohorts/addCohort/addCohort.module.css';
import Link from 'next/link';
import Spinner from '@/app/components/spinner/spinner'
import { config } from '/config';
import blur from '../../cohorts/page';

// console.log(`${config.baseURL}`)

const CohortForm = ({onClose}) => {
  const [cohortName, setCohortName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [levels, setLevels] = useState([]);
  const [facilitators, setFacilitators] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedFacilitator, setSelectedFacilitator] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [facilitatorRoles, setFacilitatorRoles] = useState([]);
  const [cohortDateError, setCohortDateError] = useState('');
  const [levelDateErrors, setLevelDateErrors] = useState([]);
  const [loading, setLoading] = useState(false);


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

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await fetch(`${config.baseURL}/facilitators`);
        const data = await response.json();
        // console.log('Fetched facilitators:', data);
        if (Array.isArray(data)) {
          setFacilitators(data);
        } else {
          setFacilitators([]);
        }
      } catch (error) {
        // console.error('Error fetching facilitators:', error);
        setFacilitators([]);
      }
    };

    fetchFacilitators();
  }, []);

  const handleLevels = async (cohortId) => {
    for (const level of levels) {
      // console.log('Level data:', level);

      const levelResponse = await fetch(`${config.baseURL}/levels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...level, cohortId }),
      });

      if (!levelResponse.ok) {
        throw new Error('Failed to create level');
      }

      const levelData = await levelResponse.json();
      console.log('Level created:', levelData);
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

    try {
      setLoading(true); // Start the loading spinner
  console.log(payload)
      const cohortResponse = await fetch(`${config.baseURL}/cohorts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!cohortResponse.ok) {
        throw new Error('Failed to create cohort and levels');
      }

      const result = await cohortResponse.json();
      console.log('Cohort and levels created:', result);

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


  const addLevel = () => {
    setLevels([...levels, { levelName: '', startDate: '', endDate: '', exam_dates: '' , exam_quotation_number: '', facilitators: [] }]);
  };

  const deleteLevel = (index) => {
    const updatedLevels = levels.filter((_, i) => i !== index);
    setLevels(updatedLevels);
  };

 // Level date validation on input
 const handleLevelChange = (index, field, value) => {
  const updatedLevels = [...levels];
  updatedLevels[index][field] = value || null;

  // Level date validation
  const updatedLevelDateErrors = [...levelDateErrors];

  // Validate level start and end dates within cohort dates
  if (field === 'startDate' || field === 'endDate') {
    const levelStartDate = new Date(updatedLevels[index].startDate);
    const levelEndDate = new Date(updatedLevels[index].endDate);

    if (levelStartDate < new Date(startDate) || levelEndDate > new Date(endDate)) {
      updatedLevelDateErrors[index] = 'Level dates must be within the cohort start and end dates.';
    } else if (levelEndDate <= levelStartDate) {
      updatedLevelDateErrors[index] = 'Level end date must be after the start date.';
    } else {
      updatedLevelDateErrors[index] = '';
    }
  }

  setLevels(updatedLevels);
  setLevelDateErrors(updatedLevelDateErrors);
};

  const addFacilitatorRole = (levelIndex) => {
    if (selectedFacilitator && selectedRole) {
      const updatedLevels = [...levels];
      const updatedFacilitators = [
        ...updatedLevels[levelIndex].facilitators,
        { value: selectedFacilitator.value, label: selectedFacilitator.label, role: selectedRole.value }
      ];
      updatedLevels[levelIndex].facilitators = updatedFacilitators;
      setLevels(updatedLevels);
      setSelectedFacilitator(null);
      setSelectedRole(null);
    }
  };
  const removeFacilitatorRole = (levelIndex, facilitatorIndex) => {
    const updatedLevels = [...levels];
    updatedLevels[levelIndex].facilitators.splice(facilitatorIndex, 1);
    setLevels(updatedLevels);
  };

  const roleOptions = [
    { value: 'Theory Instructor', label: 'Theory Instructor' },
    { value: ' Practical Instructor', label: ' Practical Instructor' },
  ];

  //add

  // const handleSave = () => {
  //   onSave(cohortLevelList);
  //   onClose();
  // };
console.log(facilitators)
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
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                      className={styles.input}
                      type="date"
                      value={startDate}
                      onChange={(e) => handleCohortStartDateChange(e.target.value)}
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
                  />
                  {cohortDateError && <p className='text-red-600 text-sm'>{cohortDateError}</p>}

                </div>

                {levels.map((level, index) => (
                    <div className={styles.levelGroup} key={index}>
                      <h3 className={styles.title}>Level</h3>
                      <div className={styles.forms}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Level Name</label>
                          <select
                              className={styles.input}
                              name="levelName"
                              value={level.levelName}
                              onChange={(e) => handleLevelChange(index, 'levelName', e.target.value)}
                              required
                          >
                            <option value="">Select level name</option>
                            <option value="SMSCP Level 1">SMSCP Level 1</option>
                            <option value="SMSCP Level 2">SMSCP Level 2</option>
                            <option value="SMSCP Level 3">SMSCP Level 3</option>
                          </select>

                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Start Date</label>
                          <input
                              className={styles.input}
                              type="date"
                              value={level.startDate}
                              onChange={(e) => handleLevelChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        {levelDateErrors[index] &&
                            <p className='text-red-700 text-base text-center	font-semibold	 '>{levelDateErrors[index]}</p>}

                        <div className={styles.formGroup}>
                          <label className={styles.label}>End Date</label>
                          <input
                              className={styles.input}
                              type="date"
                              value={level.endDate}
                              onChange={(e) => handleLevelChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        {levelDateErrors[index] &&
                            <p className='text-red-700 text-base text-center	font-semibold'>{levelDateErrors[index]}</p>}

                        <div className={styles.formGroup}>
                          <label className={styles.label}>Exam Date</label>
                          <input
                              className={styles.input}
                              type="date"
                              value={level.exam_dates}
                              onChange={(e) => handleLevelChange(index, 'exam_dates', e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Exam Quotation Number</label>
                          <input
                              className={styles.input}
                              type="text"
                              value={level.exam_quotation_number}
                              onChange={(e) => handleLevelChange(index, 'exam_quotation_number', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className={styles.facilitator}>
                        <label htmlFor="" className={styles.title}>Facilitators</label>


                        {level.facilitators.length > 0 && (
                            <div className={styles.facilitatorRoleTable}>
                              <table>
                                <thead>
                                <tr>
                                  <th>Facilitator</th>
                                  <th>Role</th>
                                  <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {level.facilitators.map((facilitator, i) => (
                                    <tr key={i}>
                                      <td>{facilitator.label}</td>
                                      <td>{facilitator.role}</td>
                                      <td>
                                        <button onClick={() => removeFacilitatorRole(index, i)}>Remove</button>
                                      </td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                            </div>
                        )}
                        <div className={styles.facilitatorRoleSelection}>
                          <Select
                              className={styles.select}
                              placeholder="Select Facilitator"
                              options={facilitators.map(facilitator => ({
                                value: facilitator.uuid,
                                label: `${facilitator.firstName} ${facilitator.lastName}`
                              }))}
                              value={selectedFacilitator}
                              onChange={setSelectedFacilitator}
                          />
                          <Select
                              className={styles.select}
                              placeholder="Select Role"
                              options={roleOptions}
                              value={selectedRole}
                              onChange={setSelectedRole}
                          />


                        </div>
                        <button
                            type="button"
                            className={styles.addFacilitatorRoleButton}
                            onClick={() => addFacilitatorRole(index)}
                        >
                          Add
                        </button>

                      </div>


                      <button
                          type="button"
                          onClick={() => deleteLevel(index)}
                          className={`${styles.deleteButton} ${styles.button}`}
                      >
                        Delete Level
                      </button>
                    </div>
                ))}
              </div>
              <div className={styles.buttons}>
                <button
                    type="button"
                    onClick={addLevel}
                    className={`${styles.addButton} ${styles.button}`}
                >
                  Add New Level
                </button>
                <button type="submit" className={`${styles.submitButton} ${styles.button}`} disabled={loading}>
                  {loading ? (
                      <>
                        <Spinner/> Please wait...
                      </>
                  ) : (
                      'Create Cohort'
                  )}
                </button>


              </div>
            </form>
          </div>
        </div>

  );
};

export default CohortForm;
