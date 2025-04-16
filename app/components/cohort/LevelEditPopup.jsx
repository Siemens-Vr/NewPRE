import React, { useState, useEffect } from 'react';
// import styles from "../viewCohort/viewLevel.module.css"
import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css'



const LevelEditPopup = ({ levelData, onClose, onUpdate }) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  const [formData, setFormData] = useState({
    levelName: levelData.levelName,
    startDate: formatDate(levelData.startDate),
    endDate: formatDate(levelData.endDate),
    exam_dates: formatDate(levelData.examDates),
    exam_quotation_number: levelData.examQuotationNumber,
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
      exam_dates: formatDate(formData.exam_dates),
    };
    onUpdate(formattedData);
  };

  return (
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <h2 className={styles.h2}>Edit Level Details</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="levelName">Level Name:</label>
                <input
                    type="text"
                    id="levelName"
                    name="levelName"
                    value={formData.levelName}
                    onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="exam_dates">Exam Date:</label>
                <input
                    type="date"
                    id="exam_dates"
                    name="exam_dates"
                    value={formData.exam_dates}
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
                <label htmlFor="exam_quotation_number">Exam Quotation No:</label>
                <input
                    type="text"
                    id="exam_quotation_number"
                    name="exam_quotation_number"
                    value={formData.exam_quotation_number}
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
              <div className={styles.formGroup}>
                <label htmlFor="facilitatorRole">Facilitator & Role:</label>
                <select id="facilitatorRole">
                  <option>Facilitator & Role</option>
                  {/* Add dynamic options here */}
                </select>
              </div>
            </div>
            <div >
              <button type="submit" className={styles.popups}>Update</button>
              {/*<button type="button" onClick={onClose}>Cancel</button>*/}
            </div>
          </form>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

      </div>
  );
};

export default LevelEditPopup;
