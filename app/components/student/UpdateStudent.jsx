"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from '@/app/lib/utils/axios';
import FormModal from '@/app/components/Form/FormModal';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';



const SinstudentPage = ({onClose, uuid}) => {
  const [student, setStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  // const { uuid } = params;
  const router = useRouter();

   
 const fetchStudent = async () => {
  try {
    const response = await api.get(`/students/${uuid}`);
    setStudent(response.data); 
    console.log("Fetched student:", response.data);
  } catch (error) {
    console.error("Error fetching student:", error);
    Swal.fire('Error', 'Failed to fetch student details', 'error');
  }
    };

  useEffect(() => {
  fetchStudent(); // Now accessible here and inside handleSubmit
}, [uuid]);

const handleSubmit = async (values) => {
  const updatedStudent = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    regNo: values.regNo,
    kcseNo: values.kcseNo,
    gender: values.gender,
    level: values.Level,
    feePayment: values.feePayment,
    examResults: values.examResults,
  };

  try {
    const response = await api.patch(`/students/${uuid}/update`, updatedStudent);
    if (response.status === 200) {
      setSuccessMessage("Student updated successfully");

      // ✅ Refetch latest student data
      await fetchStudent();

      // ✅ Close modal if available
      if (typeof onClose === 'function') {
        onClose();
      }

      // ✅ Optional redirect (delay slightly to ensure fetch completes)
      setTimeout(() => {
        router.push(`/pages/student/dashboard/students/${uuid}`);
      }, 200);
    }
  } catch (error) {
    console.error("Error updating student:", error);
    if (error.response) {
      alert(error.response.data?.error?.join('\n') || "Update failed.");
    } else {
      alert("Failed to update student. Please try again.");
    }
  }
};


const [Levels, setLevels] = useState([]);

useEffect(() => {
  const fetchLevels = async () => {
    try {
      const res = await api.get('/levels');
      setLevels(res.data);
    } catch (err) {
      console.error('Failed to fetch levels:', err);
    }
  };

  fetchLevels();
}, []);


  const fields = [
    { name: "firstName", label: "First Name", type: "text", placeholder: "First Name" },
    { name: "lastName", label: "Last Name", type: "text", placeholder: "Last Name" },
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    { name: "phone", label: "Phone", type: "text", placeholder: "Phone Number" },
    { name: "regNo", label: "Registration No", type: "text", placeholder: "Registration Number" },
    { name: "kcseNo", label: "KCSE No", type: "text", placeholder: "KCSE Number" },
    {
  name: "Level",
  label: "Select Level",
  type: "select",
  options: Levels.map(Level => ({
    value: Level.uuid, // or level.uuid depending on your DB
    label: Level.levelName
  }))
},
    {
      name: "gender", label: "Gender", type: "select", options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ]
    },
    {
      name: "feePayment", label: "Fee Payment Status", type: "select", options: [
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
      ]
    },
    {
      name: "examResults", label: "Exam Result Status", type: "select", options: [
        { value: "pass", label: "Pass" },
        { value: "fail", label: "Fail" },
        { value: "no-show", label: "No Show" },
      ]
    }
  ];

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <FormModal
            title="Update Student"
            fields={fields}
            initialValues={student}
            onSubmit={handleSubmit}
            onClose={onClose}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
    </>
  );
};

export default SinstudentPage;
