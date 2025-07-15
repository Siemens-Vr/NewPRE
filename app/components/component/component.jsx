"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormModal from '@/app/components/Form/FormModal';
import ConditionPopUp from '@/app/components/condition/condition';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/components/add/addComponent.module.css';

export default function AddComponent({ onClose , onSuccess}) {
  const router = useRouter();
  const [componentTypes, setComponentTypes] = useState([]);
  const [disablePartNumber, setDisablePartNumber] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [formData, setFormData] = useState({
    componentType: '',
    componentName: '',
    modelNumber: '',
    quantity: '',
    partNumber: '',
    description: '',
    status: false,
  });

  // console.log("conditions",conditions);

  // Fetch component types on mount
  useEffect(() => {
    api.get(`/categories`)
      .then(response => setComponentTypes(response.data || []))
      .catch(error => console.error("Error fetching categories", error));
  }, []);

  // Disable partNumber if quantity > 1
  useEffect(() => {
    setDisablePartNumber(parseInt(formData.quantity, 10) > 1);
  }, [formData.quantity]);

  const handleSubmit = async (values) => {
    const dataToSubmit = {
      ...values,
      partNumber: values.partNumber?.trim() || null,
      conditions
    };

    try {
      const response = await api.post(`/components`, dataToSubmit);
      if (response.status === 200) {
        alert("Component created successfully");
        onClose();
        onSuccess();
      
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Define fields for FormModal
  const fields = [
    {
      name: 'componentType',
      label: 'Component Type',
      type: 'select',
      options: componentTypes.map(c => ({ value: c.category, label: c.category })),
    },
    { name: 'componentName', label: 'Component Name', type: 'text', placeholder: 'Ethernet Cables' },
    { name: 'modelNumber', label: 'Model Number', type: 'text', placeholder: 'U133345w' },
    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: '20' },
    { name: 'partNumber', label: 'Serial Number', type: 'text', placeholder: '11222 (Optional)', disabled: disablePartNumber },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  return (
    <>
      <FormModal
        title="Add Component"
        fields={fields}
        initialValues={formData}
        onSubmit={handleSubmit}
        onClose={onClose}
        extraActions={[
          { label: 'Add Condition', onClick: () => setShowPopup(true), className: 'cancel' }
        ]}
      />

      {showPopup && (
        <ConditionPopUp
          onClose={() => setShowPopup(false)}
          conditions={conditions}
          setConditions={setConditions}
        />
      )}
    </>
  );
}
