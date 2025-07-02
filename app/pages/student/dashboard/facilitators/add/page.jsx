"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/app/lib/utils/axios';
import FormModal from "@/app/components/Form/FormModal";

const AddFacilitatorPage = ({ onClose }) => {
  const router = useRouter();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    staffUuid: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo :'',
    idNo: '',
    gender: '',
  });

  // Fetch staff list on mount
 useEffect(() => {
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/staffs');
      console.log("Full /staffs response:", res);
      // Sometimes data is nested, for example:
      // setStaffList(res.data.staffs || []);
      // or
      // setStaffList(res.data || []);
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


  // Map staff for dropdown select
  const staffOptions = staffList.map(user => ({
    value: user.uuid || user._id,
    label: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
  }));

  // When staff selected, autofill rest of the form fields
  const handleFormChange = (updatedValues) => {
    setFormValues(prev => {
      // If staffUuid changed, update autofill fields
      if (updatedValues.staffUuid && updatedValues.staffUuid !== prev.staffUuid) {
        const selectedStaff = staffList.find(s => s.uuid === updatedValues.staffUuid || s._id === updatedValues.staffUuid);
        if (selectedStaff) {
          return {
            ...prev,
            ...updatedValues,
            firstName: selectedStaff.firstName || '',
            lastName: selectedStaff.lastName || '',
            email: selectedStaff.email || '',
            phoneNo: selectedStaff.phoneNumber || '',
            idNo: selectedStaff.idNumber || '',
            gender: selectedStaff.gender || '',
          };
        }
      }
      return { ...prev, ...updatedValues };
    });
  };

  const fields = [
    {
      name: 'staffUuid',
      label: 'Select Staff Member',
      type: 'select',
      options: staffOptions,
    },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', disabled: true },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', disabled: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', disabled: true },
    { name: 'phoneNo', label: 'Phone Number', type: 'text', placeholder: 'Phone Number', disabled: true },
    { name: 'idNo', label: 'ID Number', type: 'text', placeholder: 'ID Number', disabled: true },
    { name: 'gender', label: 'Gender', type: 'text', placeholder: 'Gender', disabled: true },
  ];

  const handleSubmit = async (values) => {
    if (!values.staffUuid) {
      toast.error("Please select a staff member");
      return;
    }

    // Prepare facilitator payload without staffUuid (backend might not need it)
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNo: values.phoneNo,
      idNo: values.idNo,
      gender: values.gender,
    };

    try {
      const response = await api.post('/facilitators', payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Facilitator added successfully!");
        setTimeout(() => {
          router.push('/pages/student/dashboard/facilitators');
        }, 1500);
      } else {
        toast.error("Failed to add Facilitator.");
      }
    } catch (error) {
      console.error("Error adding facilitator:", error);
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
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </>
  );
};

export default AddFacilitatorPage;
