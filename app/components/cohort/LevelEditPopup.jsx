'use client';

import React, { useState, useEffect } from 'react';
import FormModal from '@/app/components/Form/formTable';
import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css';

const LevelEditPopup = ({ levelData, onClose, onUpdate }) => {
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split('T')[0] : '';

  const [formValues, setFormValues] = useState({
    levelName: levelData.levelName,
    startDate: formatDate(levelData.startDate),
    endDate: formatDate(levelData.endDate),
    exam_dates: formatDate(levelData.examDates),
    exam_quotation_number: levelData.examQuotationNumber,
    facilitatorRole: '', // assuming static/default value
  });

  const handleChange = (updatedValues) => {
    setFormValues(updatedValues);
  };

  const handleSubmit = () => {
    const payload = {
      ...formValues,
      startDate: formatDate(formValues.startDate),
      endDate: formatDate(formValues.endDate),
      exam_dates: formatDate(formValues.exam_dates),
    };
    onUpdate(payload);
    onClose();
  };

  const fields = [
    { name: 'levelName', label: 'Level Name', type: 'text' },
    { name: 'exam_dates', label: 'Exam Date', type: 'date' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'exam_quotation_number', label: 'Exam Quotation No', type: 'text' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    {
      name: 'facilitatorRole',
      label: 'Facilitator & Role',
      type: 'select',
      options: [
        { value: '', label: 'Select Role' },
        { value: 'Theory Instructor', label: 'Theory Instructor' },
        { value: 'Practical Instructor', label: 'Practical Instructor' },
      ],
    },
  ];

  return (
    <FormModal
      title="Edit Level Details"
      fields={fields}
      initialValues={formValues}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={onClose}
      extraActions={[]}
    />
  );
};

export default LevelEditPopup;
