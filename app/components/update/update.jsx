
import React, { useState } from 'react';
import styles from '@/app/styles/update/update.module.css';

const UpdatePopUp = ({ componentData, onClose, onUpdate, showConditionDetails }) => {
  const [formData, setFormData] = useState({
    componentName: componentData?.componentName || '',
    componentType: componentData?.componentType || '',
    modelNumber: componentData?.modelNumber || '',
    partNumber: componentData?.partNumber || '',
    condition: componentData?.condition || false,
    conditionDetails: componentData?.conditionDetails || '',
    description: componentData?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Edit Component Details</h2>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Only show General Details if NOT updating Condition Details */}
          {!showConditionDetails && (
            <>
            <div className={styles.flex}>
              <div className={styles.formGroup}>
                <label htmlFor="componentName">Component Name:</label>
                <input type="text" 
                id="componentName"
                 name="componentName" 
                 value={formData.componentName}
                 onChange={handleChange} />

              </div>
              <div className={styles.formGroup}>
                <label htmlFor="componentType">Category:</label>
                <input type="text"
                 id="componentType"
                  name="componentType" 
                  value={formData.componentType}
                   onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="modelNumber">Model Number:</label>
                <input type="text"
                 id="modelNumber"
                  name="modelNumber" 
                  value={formData.modelNumber} 
                  onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="partNumber">Serial Number:</label>
                <input type="text" 
                id="partNumber"
                 name="partNumber" 
                 value={formData.partNumber}
                  onChange={handleChange} />
              </div>

          

            </div>

                 <div className={styles.formGroup}>
             <label htmlFor="description">Description:</label>
             <textarea
               id="description"
               name="description"
               value={formData.description}
               onChange={handleChange}
              />
           </div>
            </>

          )}

          {/* Show Condition Fields if updating Condition Details */}
          {showConditionDetails && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="condition">Condition:</label>
                <select id="condition" name="condition" value={formData.condition ? 'Good' : 'Not Good'} onChange={(e) => setFormData({ ...formData, condition: e.target.value === 'Good' })}>
                  <option value="Good">Good</option>
                  <option value="Not Good">Not Good</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="conditionDetails">Condition Details:</label>
                <textarea id="conditionDetails" name="conditionDetails" value={formData.conditionDetails} onChange={handleChange} />
              </div>
            </>
          )}

          <div className={styles.popupActions}>
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePopUp;
