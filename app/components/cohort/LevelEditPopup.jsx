'use client';

import React, { useState } from 'react';
import FormModal from '@/app/components/Form/formTable';
import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LevelEditPopup = ({
  levelData,
  onClose,
  onUpdate,
  fetchData,
}) => {
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split('T')[0] : '';

  const [formValues, setFormValues] = useState({
    levelName: levelData.levelName,
    startDate: formatDate(levelData.startDate),
    endDate: formatDate(levelData.endDate),
    exam_dates: formatDate(levelData.examDates),
    exam_quotation_number: levelData.examQuotationNumber,
    facilitatorRole: '',
  });

  const handleChange = (updated) => {
    setFormValues((prev) => ({ ...prev, ...updated }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formValues,
      startDate: formatDate(formValues.startDate),
      endDate: formatDate(formValues.endDate),
      exam_dates: formatDate(formValues.exam_dates),
    };

    try {
      // 1) send update
      await onUpdate(payload);

      // 2) re-fetch the latest for this level
      if (typeof fetchData === 'function') {
        await fetchData(levelData.uuid);
      }

      // 3) show success toast
      toast.success('Level updated successfully!');

      // 4) close the modal
      onClose();
    } catch (err) {
      console.error('Error updating level:', err);
      toast.error('Failed to update level.');
    }
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
    <>
      <FormModal
        title="Edit Level Details"
        fields={fields}
        initialValues={formValues}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={onClose}
        extraActions={[]}
      />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default LevelEditPopup;
