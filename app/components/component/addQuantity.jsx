"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormModal from '@/app/components/Form/FormModal';
import ConditionPopUp from '@/app/components/condition/condition';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/components/add/addComponent.module.css';

export default function AddComponentQuantity({component, onClose , onSuccess}) {
   const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // initial form values
  const initialValues = { quantity: "" };

  // called with { categories: "a, b, c" }
  const handleSubmit = async ({ quantity }) => {
    setLoading(true);
    setError(null);


    try {
     const payload = { quantity: quantity };
    console.log(payload)

      const response = await api.post(`/components/update-quantity/${component.uuid}`, payload);
      console.log(response)
      if (response.status === 200) {
        alert("Equipment quantity added successfully");
        router.refresh();  
        // onClose();
        // onSuccess();
        
      
      } 
    } catch (error) {
      console.error("Error submitting form", error);
      alert('An error occurred while submitting the form.');
    }
  };


  // Define fields for FormModal
  const fields = [

    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: '20' },

  ];

  return (
    <>
      <FormModal
        title="Add Component"
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={onClose}
   
      />

  
    </>
  );
}
