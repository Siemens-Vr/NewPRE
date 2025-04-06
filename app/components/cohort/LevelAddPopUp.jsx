import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css'
import { config } from '/config';

const LevelAddPopUp = ({ cohortId, onClose, onAdd }) => {
  const [facilitators, setFacilitators] = useState([]);
  const [selectedFacilitator, setSelectedFacilitator] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [levelData, setLevelData] = useState({
    levelName: '',
    startDate: '',
    endDate: '',
    exam_dates: '',
    exam_quotation_number: '',
    facilitators: []
  });

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await fetch(`${config.baseURL}/facilitators`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setFacilitators(data);
        } else {
          setFacilitators([]);
        }
      } catch (error) {
        console.error("Error fetching facilitators:", error);
        setFacilitators([]);
      }
    };

    fetchFacilitators();
  }, []);

  const handleLevelChange = (field, value) => {
    setLevelData({ ...levelData, [field]: value });
  };

  const addFacilitatorRole = () => {
    if (selectedFacilitator && selectedRole) {
      const updatedFacilitators = [
        ...levelData.facilitators,
        { value: selectedFacilitator.value, label: selectedFacilitator.label, role: selectedRole.value }
      ];
      setLevelData({ ...levelData, facilitators: updatedFacilitators });
      setSelectedFacilitator(null);
      setSelectedRole(null);
    }
  };

  const removeFacilitatorRole = (index) => {
    const updatedFacilitators = levelData.facilitators.filter((_, i) => i !== index);
    setLevelData({ ...levelData, facilitators: updatedFacilitators });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...levelData,
      cohortId: cohortId,
      facilitatorRoles: levelData.facilitators.map(facilitator => ({
        facilitatorId: facilitator.value,
        role: facilitator.role
      }))
    });
  };

  const roleOptions = [
    { value: 'Theory Instructor', label: 'Theory Instructor' },
    { value: 'Practical Instructor', label: 'Practical Instructor' },
  ];

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2 className={styles.title}>Add New Level</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Level Name</label>
            <select
                className={styles.input}
                name="levelName"
                value={levelData.levelName}
                onChange={(e) => handleLevelChange('levelName', e.target.value)}
                required
            >
              <option value="">Select level name</option>
              <option value="SMSCP Level 1">SMSCP Level 1</option>
              <option value="SMSCP Level 2">SMSCP Level 2</option>
              <option value="SMSCP Level 3">SMSCP Level 3</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date:</label>
            <input
                type="date"
                id="startDate"
                name="startDate"
                value={levelData.startDate}
                onChange={(e) => handleLevelChange('startDate', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date:</label>
            <input
                type="date"
                id="endDate"
                name="endDate"
                value={levelData.endDate}
                onChange={(e) => handleLevelChange('endDate', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="exam_dates">Exam Date:</label>
            <input
                type="date"
                id="exam_dates"
                name="exam_dates"
                value={levelData.exam_dates}
                onChange={(e) => handleLevelChange('exam_dates', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="exam_quotation_number">Exam Quotation Number:</label>
            <input
                type="text"
                id="exam_quotation_number"
                name="exam_quotation_number"
                value={levelData.exam_quotation_number}
                onChange={(e) => handleLevelChange('exam_quotation_number', e.target.value)}
            />
          </div>
          <div className={styles.facilitator}>
            <label className={styles.labels}>Facilitators</label>
            {levelData.facilitators.length > 0 && (
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
                    {levelData.facilitators.map((facilitator, index) => (
                        <tr key={index}>
                          <td>{facilitator.label}</td>
                          <td>{facilitator.role}</td>
                          <td>
                            <button type="button" onClick={() => removeFacilitatorRole(index)}>Remove</button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
            <div className={styles.facilitatorRoleSelections}>
              <select
                  className={styles.select}
                  value={selectedFacilitator ? selectedFacilitator.value : ""}
                  onChange={(e) =>
                      setSelectedFacilitator({
                        value: e.target.value,
                        label: e.target.options[e.target.selectedIndex].text,
                      })
                  }
              >
                <option value="" disabled>Select Facilitator</option>
                {facilitators.map((facilitator) => (
                    <option key={facilitator.uuid} value={facilitator.uuid}>
                      {`${facilitator.firstName} ${facilitator.lastName}`}
                    </option>
                ))}
              </select>

              <select
                  className={styles.select}
                  value={selectedRole ? selectedRole.value : ""}
                  onChange={(e) => setSelectedRole({
                    value: e.target.value,
                    label: e.target.options[e.target.selectedIndex].text
                  })}
              >
                <option value="" disabled>Select Role</option>
                {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                ))}
              </select>
            </div>
            <button
                type="button"
                className={styles.addFacilitatorRoleButton}
                onClick={addFacilitatorRole}
            >
              Add Facilitator
            </button>
          </div>

          <div className={styles.popupActions}>

            <button className={styles.closeButtons} onClick={onClose}>×</button>
          </div>
        </form>
        <button type="submit" className={styles.submit}>Add Level</button>
      </div>
    </div>
  );
};

export default LevelAddPopUp;