"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from '@/app/lib/utils/axios';
import FormModal from '@/app/components/Form/FormModal';

const SingleFacilitatorPage = ({ onClose }) => {
  const [facilitator, setFacilitator] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchFacilitator = async () => {
    try {
      const response = await api.get(`/facilitators/${id}`);
      setFacilitator(response.data);
    } catch (error) {
      console.error("Error fetching facilitator:", error);
      alert("Failed to load facilitator data");
    }
  };

  useEffect(() => {
    fetchFacilitator();
  }, [id]);

  const handleSubmit = async (values) => {
    const updated = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      idNo: values.idNo,
      phoneNo: values.phoneNo,
      gender: values.gender,
    };

    try {
      const response = await api.patch(`/facilitators/${id}/update`, updated);
      if (response.status === 200) {
        setSuccessMessage("Facilitator updated successfully");
        setTimeout(() => {
          router.push(`/pages/student/dashboard/facilitators/${id}`);
        }, 0);
      }
    } catch (error) {
      console.error("Update failed:", error);
      if (error.response) {
        alert(error.response.data?.error?.join('\n') || "Update failed.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    { name: 'idNo', label: 'ID Number', type: 'text', placeholder: 'ID Number' },
    { name: 'phoneNo', label: 'Phone Number', type: 'text', placeholder: 'Phone Number' },
    {
      name: "gender", label: "Gender", type: "select", options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ]
    }
  ];

  if (!facilitator) {
    return <div>Loading...</div>;
  }

  return (
    <FormModal
      title="Update Facilitator"
      fields={fields}
      initialValues={facilitator}
      onSubmit={handleSubmit}
      onClose={onClose}
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
    />
  );
};

export default SingleFacilitatorPage;
