"use client";

import React, { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/formTable";
import Spinner from "@/app/components/spinner/spinner";
import FacilitatorPopup from "@/app/components/cohort/FacilitatorPopUp";
import api from "@/app/lib/utils/axios";

const AddLevelForm = ({ onClose, onSave, cohortStartDate = "", cohortEndDate = "" }) => {
 const [formValues, setFormValues] = useState({
  levelName: '',   
  startDate: '',
  endDate: '',
  exam_dates: '',
  exam_quotation_number: '',
  facilitators: [],
});
  const [facilitatorsList, setFacilitatorsList] = useState([]);
  const [showFacilitatorPopup, setShowFacilitatorPopup] = useState(false);
  const [levelDateError, setLevelDateError] = useState('');

  const levelOptions = [
    { value: "SMSCP Level 1", label: "SMSCP Level 1" },
    { value: "SMSCP Level 2", label: "SMSCP Level 2" },
    { value: "SMSCP Level 3", label: "SMSCP Level 3" },
  ];

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const res = await api.get(`/facilitators`);
        setFacilitatorsList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching facilitators:", err);
        setFacilitatorsList([]);
      }
    };
    fetchFacilitators();
  }, []);

  const validateDates = () => {
    const start = new Date(formValues.startDate);
    const end = new Date(formValues.endDate);
    const cohortStart = new Date(cohortStartDate);
    const cohortEnd = new Date(cohortEndDate);

    if (formValues.startDate && formValues.endDate) {
      if (start >= end) {
        setLevelDateError("Level end date must be after start date.");
        return false;
      }
      if (cohortStartDate && cohortEndDate) {
        if (start < cohortStart || end > cohortEnd) {
          setLevelDateError("Level dates must be within cohort dates.");
          return false;
        }
      }
    }
    setLevelDateError("");
    return true;
  };

const handleFormSubmit = () => {
  if (!validateDates()) return;

  if (!formValues?.levelUuid) {
    alert("Please select a level");
    return;
  }

  const selectedOption = levelOptions.find(option => option.value === formValues.levelUuid);

  if (!selectedOption) {
    alert("Selected level is invalid");
    return;
  }

  const newLevel = {
    ...formValues,
    levelName: selectedOption.label,
  };

  delete newLevel.levelUuid;

  onSave(newLevel);
  onClose();
};


  const handleFormChange = (updatedValues) => {
    setFormValues(updatedValues);
  };

 const addFacilitator = (facilitator) => {
 console.log("Adding facilitator:", facilitator);

  setFormValues(prev => {
    if (prev.facilitators.some(f => f.uuid === facilitator.uuid)) return prev;
    return {
      ...prev,
      facilitators: [...prev.facilitators, facilitator]
    };
  });
};



  const removeFacilitator = (index) => {
  const updated = [...formValues.facilitators];
  updated.splice(index, 1);
  setFormValues(prev => ({
    ...prev,
   facilitators: updated
  }));
};


  // ✅ Use levelName directly in the field
  const fields = [
    {
      name: 'levelUuid',
      label: 'Level',
      type: 'select',
      options: levelOptions,
    },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'exam_dates', label: 'Exam Date', type: 'date' },
    { name: 'exam_quotation_number', label: 'Exam Quotation Number', type: 'text' },
  ];

  const facilitatorTable = formValues.facilitators.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {formValues.facilitators.map((fac, index) => (
          <tr key={index}>
            <td>{fac.name || "N/A"}</td>
             <td>{fac.role || "N/A"}</td>

            <td>
              <button type="button" onClick={() => removeFacilitator(index)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p>No facilitators added yet.</p>;

  return (
    <>
      <FormModal
        title="Add Level"
        fields={fields}
        initialValues={formValues}
        onSubmit={handleFormSubmit}
        onAdd={() => setShowFacilitatorPopup(true)}
        onChange={handleFormChange}
        onClose={onClose}
        extraActions={[
          {
            label: "+ Add Facilitator",
            onClick: () => setShowFacilitatorPopup(true),
            className: 'cancel'
          }
        ]}
        tableContent={
          <>
            {levelDateError && (
              <p className="text-red-600 font-semibold text-center">{levelDateError}</p>
            )}
            {facilitatorTable}
          </>
        }
      />

      {showFacilitatorPopup && (
        <FacilitatorPopup
          onClose={() => setShowFacilitatorPopup(false)}
          onAddFacilitator={addFacilitator}
          facilitators={facilitatorsList}
        />
      )}
    </>
  );
};

export default AddLevelForm;
