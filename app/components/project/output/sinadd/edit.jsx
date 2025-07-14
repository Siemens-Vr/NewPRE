// app/components/project/output/sinadd/edit.jsx
'use client';

import React, { useState, useEffect } from 'react';
import FormModal from '@/app/components/Form/FormModal';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/components/singleComponent/singlecomponent.module.css';

/**
 * EditOutputModal
 * Props:
 * - open: boolean
 * - onClose: fn
 * - onEdited: fn
 * - editData: { uuid, no, name, description, value }
 */
export default function EditOutputModal({ open, onClose, onEdited, editData }) {
  const [initialValues, setInitialValues] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Prepare initialValues when editData arrives
  useEffect(() => {
    if (open && editData) {
      setInitialValues({
        no: editData.no?.toString() || '',
        name: editData.name || '',
        description: editData.description || '',
        value: editData.value?.toString() || ''
      });
      setError('');
    }
  }, [open, editData]);

  // Called by FormModal with current values
  const handleSubmit = async (values) => {
    setIsSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('no', values.no);
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('value', values.value);
      // no file support here; if needed, add output field

      const res = await api.put(
        `/outputs/update/${editData.uuid}`,
        formData
      );

      if (res.status === 200) {
        onEdited();
        onClose();
      } else {
        setError('Failed to update output.');
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

  if (!initialValues) return null;

  const fields = [
    { name: 'no', label: 'No', type: 'number', placeholder: '#', required: true },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description', required: true },
    { name: 'value', label: 'Value', type: 'number', placeholder: 'Δ Value', required: true }
  ];

  return (
    <FormModal
      isOpen={open}
      title="Edit Output"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel={isSaving ? 'Updating...' : 'Update'}
      disableSubmit={isSaving}
    >
      {error && <div className={styles.errorMessage} style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{error}</div>}
    </FormModal>
  );
}
