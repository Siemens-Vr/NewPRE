// UpdatePopUp.jsx
'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '@/app/components/Form/FormModal';
import styles from '@/app/styles/update/update.module.css'; // you can still use any custom CSS if needed

export default function UpdatePopUp({
  componentData,
  onClose,
  onUpdate,
  showConditionDetails
}) {
  // local copy of data (will seed the modal)
  const [formData, setFormData] = useState({
    componentName:    '',
    componentType:    '',
    modelNumber:      '',
    partNumber:       '',
    description:      '',
    condition:        false,
    conditionDetails: ''
  });

  // whenever componentData changes, reset our formData
  useEffect(() => {
    setFormData({
      componentName:    componentData?.componentName    || '',
      componentType:    componentData?.componentType    || '',
      modelNumber:      componentData?.modelNumber      || '',
      partNumber:       componentData?.partNumber       || '',
      description:      componentData?.description      || '',
      condition:        componentData?.condition        || false,
      conditionDetails: componentData?.conditionDetails || ''
    });
  }, [componentData]);

  // pass into FormModal as onChange
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // when the user clicks “Submit”
  const handleSubmit = values => {
    onUpdate(values);
    onClose();
  };

  // fields for the “general” section
  const generalFields = [
    {
      name: 'componentName',
      label: 'Component Name',
      type: 'text',
      placeholder: 'Enter component name'
    },
    {
      name: 'componentType',
      label: 'Category',
      type: 'text',
      placeholder: 'Enter category'
    },
    {
      name: 'modelNumber',
      label: 'Model Number',
      type: 'text',
      placeholder: 'Enter model number'
    },
    {
      name: 'partNumber',
      label: 'Serial Number',
      type: 'text',
      placeholder: 'Enter serial number'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description'
    }
  ];

  // fields for the “condition” section
  const conditionFields = [
    {
      name: 'condition',
      label: 'Condition',
      type: 'select',
      options: [
        { value: true, label: 'Good' },
        { value: false, label: 'Not Good' }
      ]
    },
    {
      name: 'conditionDetails',
      label: 'Condition Details',
      type: 'textarea',
      placeholder: 'Describe the condition'
    }
  ];

  // pick which group based on showConditionDetails
  const fields = showConditionDetails
    ? conditionFields
    : generalFields;

  return (
    <FormModal
      title="Edit Component Details"
      fields={fields}
      initialValues={formData}
      onChange={handleFieldChange}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}

UpdatePopUp.propTypes = {
  componentData:        PropTypes.object.isRequired,
  onClose:              PropTypes.func.isRequired,
  onUpdate:             PropTypes.func.isRequired,
  showConditionDetails: PropTypes.bool.isRequired
};
