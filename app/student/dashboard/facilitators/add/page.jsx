"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/app/lib/utils/axios';
import FormModal from "@/app/components/Form/FormModal";

export default function AddFacilitatorPage({ levelUuid, onSave, onClose }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    staffUuid: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    idNo: '',
    gender: '',
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
            firstName: sel.firstName || '',
            lastName: sel.lastName || '',
            email: sel.email || '',
            phoneNo: sel.phoneNumber || '',
            idNo: sel.idNumber || '',
            gender: sel.gender || '',
          };
        }
      }
      return { ...prev, ...updatedValues };
    });
  };

  const fields = [
    { name: 'staffUuid', label: 'Select Staff Member', type: 'select', options: staffOptions },
    { name: 'firstName', label: 'First Name', type: 'text', disabled: true },
    { name: 'lastName', label: 'Last Name', type: 'text', disabled: true },
    { name: 'email', label: 'Email', type: 'email', disabled: true },
    { name: 'phoneNo', label: 'Phone Number', type: 'text', disabled: true },
    { name: 'idNo', label: 'ID Number', type: 'text', disabled: true },
    { name: 'gender', label: 'Gender', type: 'text', disabled: true },
  ];

  const handleSubmit = async values => {
    if (!values.staffUuid) {
      toast.error("Please select a staff member");
      return;
    }

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNo: values.phoneNo,
      idNo: values.idNo,
      gender: values.gender,
    };
console.log("Submitting payload:", payload);
    try {
      // use the levelUuid prop here
      const response = await api.post(
        `/facilitators`,
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
        initialValues={formValues}
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
