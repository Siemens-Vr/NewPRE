"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/lib/utils/axios";
import FormModal from "@/app/components/Form/formTable";
import CohortLevelModal from "@/app/components/cohort/CohortLevelModal"; // see below
import styles from "@/app/styles/students/addStudent/addStudent.module.css";

export default function AddStudentPage({ onClose }) {
  const router = useRouter();
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
  const [cohortLevelList, setCohortLevelList] = useState([]);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // student fields change
  const handleStudentChange = (vals) => {
    setFormData(vals);
  };

  // receive cohort+level list from modal
  const handleSaveCohortRow = (row) => {
     console.log("👀 Received new cohort‐level row:", row);
    setCohortLevelList(prev => [...prev, row]);
    setShowCohortModal(false);
  };

  // remove one entry
  const handleDelete = (i) => {
    setCohortLevelList((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // you can validate formData and cohortLevelList here...
    const payload = {
      ...formData,
      cohortLevels: cohortLevelList 
    }
    console.log("Data to send:", payload);
    try {
      const res = await api.post("/students", payload);
      toast.success("Student added!");
      // optionally router.push or onClose()
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

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
  ];

  return (
    <>
      <FormModal
        title="Add Student"
        fields={studentFields}
        initialValues={formData}
        onChange={handleStudentChange}
        onAdd={() => setShowCohortModal(true)}    // “Add Cohort+Level”
        onSubmit={handleSubmit}
        onClose={onClose}
        tableContent={
          cohortLevelList.length ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cohort</th><th>Level</th>
                    <th>Fee</th><th>Exam Results</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortLevelList.map((it, i) => (
                    <tr key={i}>
                      <td>{it.cohortName}</td>
                      <td>{it.levelName}</td>
                      <td>{it.fee}</td>
                      <td>{it.examResults}</td>
                      <td>
                        <button onClick={() => handleDelete(i)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null
        }
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
