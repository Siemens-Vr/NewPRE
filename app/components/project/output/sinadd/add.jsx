'use client';

import React, { useState, useEffect } from 'react';
import FormModal from '@/app/components/Form/FormModal';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/components/singleComponent/singlecomponent.module.css';

export default function AddOutputModal({
  open,
  onClose,
  onAdded,
  phaseuuid
}) {
  const initialValues = { no: '', name: '', description: '', value: '0', output: null };
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) setValues(initialValues);
  }, [open]);

  const handleSubmit = async vals => {
    setIsSaving(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(vals).forEach(([key, val]) => {
        if (val !== null) formData.append(key, val);
      });

      // debug
      for (let [k, v] of formData.entries()) {
        console.log(k, v);
      }

      const res = await api.post(`/outputs/${phaseuuid}`, formData);
      if (res.status === 201) {
        onAdded();
        onClose();
      } else {
        setError('Failed to add output.');
      }
    } catch (e) {
      console.error('SERVER ERROR RAW:', e.response?.data);
      setError(
        typeof e.response?.data === 'string'
          ? e.response.data
          : JSON.stringify(e.response?.data, null, 2)
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { name: 'no', label: 'No', type: 'number', placeholder: '#', required: true },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description', required: true },
    { name: 'value', label: 'Value', type: 'number', placeholder: 'Δ Value', required: true },
    { name: 'output', label: 'Document', type: 'file', required: true }
  ];

  return (
    <FormModal
      isOpen={open}
      title="Add Output"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      extraActions={[]}
    >
      {error && <div className={styles.errorMessage} style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{error}</div>}
    </FormModal>
  );
}