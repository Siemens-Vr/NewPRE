'use client';

import React, { useState } from 'react';
import FormModal from '@/app/components/Form/FormModal';

const CohortEditPopup = ({ cohortData, onClose, onUpdate }) => {
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split('T')[0] : '';

  const [formValues, setFormValues] = useState({
    cohortName: cohortData.cohortName || '',
    startDate: formatDate(cohortData.startDate),
    endDate: formatDate(cohortData.endDate),
  });

  const fields = [
    {
      name: 'cohortName',
      label: 'Cohort Name',
      type: 'text',
      placeholder: 'Enter cohort name',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
  ];

  // ✅ Update handler that works with reusable FormModal
  const handleFieldChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (values) => {
    const updated = {
      ...values,
      startDate: formatDate(values.startDate),
      endDate: formatDate(values.endDate),
    };
    onUpdate(updated);
    onClose();
  };

  return (
    <FormModal
      title="Edit Cohort Details"
      fields={fields}
      initialValues={formValues}
      onSubmit={handleSubmit}
      onClose={onClose}
      onChange={handleFieldChange} // ✅ important fix
    />
  );
};

export default CohortEditPopup;
