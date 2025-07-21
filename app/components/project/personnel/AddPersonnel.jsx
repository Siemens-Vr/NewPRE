"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/app/lib/utils/axios';
import FormModal from "@/app/components/Form/FormModal";
import { useParams } from "next/navigation";

export default function AddPersonnel({  onSave, onClose }) {
  
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const params =useParams()
  const {uuid} = params
  const [formValues, setFormValues] = useState({
    staffUuid: '',
    role: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
  });

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await api.get('/staffs');
        setStaffList(res.data || []);
      } catch (err) {
        toast.error("Failed to load staff list");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const staffOptions = staffList.map(user => ({
    value: user.uuid || user._id,
    label: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
  }));

  const handleFormChange = updatedValues => {
    setFormValues(prev => {
      if (updatedValues.staffUuid && updatedValues.staffUuid !== prev.staffUuid) {
        const sel = staffList.find(s => (s.uuid || s._id) === updatedValues.staffUuid);
        if (sel) {
          return {
            ...prev,
            ...updatedValues,
            role: sel.role || '',
            startDate: sel.startDate || '',
            endDate: sel.endDate || '',
            responsibilities: sel.phoneNumber || '',
          
          };
        }
      }
      return { ...prev, ...updatedValues };
    });
  };

  const fields = [
    { name: 'staffUuid', label: 'Select Staff Member', type: 'select', options: staffOptions },
    { name: 'role', label: 'Role in the project', type: 'text'},
    { name: 'startDate ', label: 'Start Date', type: 'date'},
    { name: 'endDate', label: 'End Date', type: 'date'},
    { name: 'responsibilities', label: 'Responsibilities', type: 'textarea' },

  ];

  const handleSubmit = async values => {
    if (!values.staffUuid) {
      toast.error("Please select a staff member");
      return;
    }

    const payload = {
      staffUuid: values.staffUuid,
      role: values.role,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      responsibilities: values.responsibilities,
     
    };
console.log("Submitting payload:", payload);
    try {
      // use the levelUuid prop here
      const response = await api.post(
        `/projects/personnel/${uuid}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const newFacilitator = response.data;
      toast.success("Facilitator added successfully!");
      onSave(newFacilitator);
      onClose();
    } catch (error) {
      console.error("Error adding facilitator:", error.response?.data || error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <FormModal
        title="Add Facilitator from Staff"
        fields={fields}
        
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        onClose={onClose}
      />
      {loading && <p>Loading staff members...</p>}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}
