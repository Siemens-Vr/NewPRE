"use client";

import { useState } from "react";
import styles from '@/app/styles/students/addStudent/addStudent.module.css';
import { config } from "/config";
import CohortModal from '@/app/components/cohort/AddCohort';
import Spinner from '@/app/components/spinner/spinner'
import { Label } from "recharts";
import {useRouter} from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/app/lib/utils/axios';
import FormModal from '@/app/components/Form/FormModal';

const AddStudentPage = ({onClose}) => {
  const router= useRouter();
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cohortLevelList, setCohortLevelList] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regNo: "",
    kcseNo: "",
    gender: "",
    idNo: "",
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCohorts = (data) => {
    setCohortLevelList(data);
  };

  const handleDelete = (index) => {
    const updatedCohortLevelList = cohortLevelList.filter((_, i) => i !== index);
    setCohortLevelList(updatedCohortLevelList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValues = e.values;
    setLoading(true);
    setErrorMessage("");
    toast.success("Student added successfully! ");
    const dataToSend = {
      ...formValues,
      cohortLevels: cohortLevelList.map(item => ({
        cohortUuid: item.cohortUuid,
        levelUuid: item.levelUuid,
        fee : item.fee,
        examResults : item.examResults

      }))
    };


    console.log("Data to be sent to the backend:", dataToSend);

    try {
        const response = await api.post("/students", dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        const data = response.data;

        console.log("Backend responded with:", data);
        
        if (response.statusText === 201) {
          toast.success("Student added successfully! 🎉");
          // ... redirect, reset, etc.
        } else {
          // Fallback error toast
          toast.error("Failed to add Facilitator");
        }
      }  catch (error) {
        console.error("Caught error:", error?.response?.data || error.message || error);
        toast.error("An unexpected error occurred.");
      }
       finally {
        setLoading(false);
      }
    }      

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
    { name: 'email', label: 'Email', type: 'text', placeholder: 'Email' },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Phone Number' },
    { name: 'regNo', label: 'Registration No', type: 'text', placeholder: 'Registration Number' },
    { name: 'kcseNo', label: 'KCSE No', type: 'text', placeholder: 'KCSE Number' },
    {
      name: 'gender', label: 'Gender', type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    { name: 'idNo', label: 'ID Number', type: 'text', placeholder: 'ID Number' },
  ];

  return (
    <>
      <FormModal
        title="Add Student"
        fields={fields}
        initialValues={formData}
        onSubmit={(values) => handleSubmit({ preventDefault: () => {}, values })}
        onClose={onClose}
        extraActions={[
          { label: 'Add Cohort & Level', onClick: () => setShowCohortModal(true), className: 'cancel' }
        ]}
      >
        {cohortLevelList.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cohort</th>
                  <th>Level</th>
                  <th>Fee</th>
                  <th>Exam Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cohortLevelList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cohortName}</td>
                    <td>{item.levelName}</td>
                    <td>{item.fee}</td>
                    <td>{item.examResults}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormModal>

      {showCohortModal && (
        <CohortModal
          onSave={handleSaveCohorts}
          onClose={() => setShowCohortModal(false)}
        />
      )}
    </>
  );
};

export default AddStudentPage;
