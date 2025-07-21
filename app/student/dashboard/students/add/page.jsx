// AddStudentPage.jsx
"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/lib/utils/axios";
import FormModal from "@/app/components/Form/formTable";
import CohortLevelModal from "@/app/components/cohort/CohortLevelModal";
import styles from "@/app/styles/students/addStudent/addStudent.module.css";

export default function AddStudentPage({ onClose }) {
  const [studentValues, setStudentValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regNo: "",
    kcseNo: "",
    gender: "",
    idNo: "",
    examResults: "",
    feePayment: "",
  });
  const [cohortLevels, setCohortLevels] = useState([]);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const studentFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName",  label: "Last Name",  type: "text" },
    { name: "email",     label: "Email",      type: "text" },
    { name: "phone",     label: "Phone",      type: "text" },
    { name: "regNo",     label: "Reg No",     type: "text" },
    { name: "kcseNo",    label: "KCSE No",    type: "text" },
    { name: "gender",    label: "Gender",     type: "select",
      options: [
        { value: "male",   label: "Male" },
        { value: "female", label: "Female" }
      ]
    },
    { name: "idNo",      label: "ID No",      type: "text" },
    {
          name: "examResults", label: "Exam Status", type: "select",
          options: [
            { value: "pass",    label: "Pass" },
            { value: "fail",    label: "Fail" },
            { value: "no-show", label: "No Show" }
          ]
        },
    { name: "feePayment",  label: "Fee Payment",  type: "number" }
  ];

  // update student form fields
  const handleStudentChange = (vals) => {
    setStudentValues(vals);
  };

  // save a new cohort‐level row
  const handleSaveCohortRow = (row) => {
    setCohortLevels((prev) => [...prev, row]);
    setShowCohortModal(false);
  };

  // remove row by index
  const handleDeleteRow = (idx) => {
    setCohortLevels(prev => prev.filter((_, i) => i !== idx));
  };
console.log("Cohort Levels:", cohortLevels);
console.log("Student Values:", studentValues);
  // final submit
  const handleSubmit = async () => {
    if (cohortLevels.length === 0) {
      toast.error("Please add at least one Cohort & Level.");
      return;
    }

    setLoading(true);
    const payload = {
      firstName: studentValues.firstName,
      lastName: studentValues.lastName,
      email: studentValues.email,
      phone: studentValues.phone,
      regNo: studentValues.regNo,
      kcseNo: studentValues.kcseNo,
      gender: studentValues.gender,
      idNo: studentValues.idNo,
      examResults: studentValues.examResults,
      feePayment: studentValues.feePayment,
      cohortLevels
    };
console.log("Submitting student data:", cohortLevels, payload);
    try {
      await api.post("/students", payload);
      // only call onSave if it exists:
      if (typeof onSave === "function") {
        onSave(payload);
      }
      // then always close the form or navigate away:
      setLoading(false);
      toast.success("Student added!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  // table to show inside the modal
  const cohortTable = cohortLevels.length > 0
    ? (
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
            {cohortLevels.map((it, i) => (
              <tr key={i}>
                <td>{it.cohortName}</td>
                <td>{it.levelName}</td>
                <td>{it.fee}</td>
                <td>{it.examResults}</td>
                <td>
                  <button onClick={() => handleDeleteRow(i)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    : <p>No cohorts added yet.</p>;

  return (
    <>
      <FormModal
        title="Add Student"
        fields={studentFields}
        initialValues={studentValues}
        onChange={handleStudentChange}
        onAdd={() => setShowCohortModal(true)}   // “Add Cohort+Level”
        onSubmit={handleSubmit}
        onClose={onClose}
        tableContent={cohortTable}
      />

      {showCohortModal && (
        <CohortLevelModal
          onClose={() => setShowCohortModal(false)}
          onSave={handleSaveCohortRow}
        />
      )}

      <ToastContainer />
      {/* {loading && <Spinner />} */}
    </>
  );
}
