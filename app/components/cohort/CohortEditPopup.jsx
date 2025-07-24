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

  // This onChange matches FormModal: it receives a partial object { fieldName: value }
  const handleChange = (updates) => {
    setFormValues((prev) => ({ ...prev, ...updates }));
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

  // Include `value` in each field so FormModal can control the input
  const fields = [
    {
      name: 'cohortName',
      label: 'Cohort Name',
      type: 'text',
      placeholder: 'Enter cohort name',
      value: formValues.cohortName,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      value: formValues.startDate,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      value: formValues.endDate,
    },
  ];

  return (
    <FormModal
      title="Edit Cohort Details"
      fields={fields}
      initialValues={formValues}
      onSubmit={handleSubmit}
      onClose={onClose}
      onChange={handleChange}
    />
  );
};

export default CohortEditPopup;
