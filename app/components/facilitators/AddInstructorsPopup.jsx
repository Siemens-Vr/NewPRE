// AddInstructorsPopup.js
"use client";

import React, { useState } from 'react';
import Select from 'react-select';
import styles from "@/app/ui/dashboard/students/singleStudent/singleStudent.module.css";
import { config } from '@/config';

const AddInstructorsPopup = ({ level, facilitators, onClose, onAddFacilitator }) => {
  const [selectedFacilitator, setSelectedFacilitator] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const addFacilitatorRole = () => {
    if (selectedFacilitator && selectedRole) {
      onAddFacilitator({
        value: selectedFacilitator.value,
        label: selectedFacilitator.label,
        role: selectedRole.value
      });
      setSelectedFacilitator(null);
      setSelectedRole(null);
    }
  };

  const removeFacilitatorRole = (facilitatorIndex) => {
    onAddFacilitator(facilitatorIndex);
  };

  const roleOptions = [
    { value: 'Instructor', label: 'Instructor' },
    { value: 'Lab Teacher', label: 'Lab Teacher' },
    { value: 'Inspector', label: 'Inspector' },
  ];

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Add Instructor</h2>
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
                      <button onClick={() => removeFacilitatorRole(i)}>Remove</button>
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
          <button
            type="button"
            className={styles.addFacilitatorRoleButton}
            onClick={addFacilitatorRole}
          >
            Add
          </button>
        </div>
        <div className={styles.popupButtons}>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddInstructorsPopup;
