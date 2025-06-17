"use client";
import styles from '@/app/styles/students/singleStudent/updateStudent.module.css';
import { useState, useEffect } from "react";
import { config } from "../../../config";
import { useParams } from "next/navigation";
import api from '@/app/lib/utils/axios';

const SinstudentPage = ({onClose}) => {
  const [student, setStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched student data:", data);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedStudent = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      regNo: formData.get("regNo"),
      kcseNo: formData.get("kcseNo"),
      gender: formData.get("gender"),
      feePayment: formData.get("feePayment"),
      examResults: formData.get("examResults"),
    };

    try {
      const response = await api.get(`/students/${id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <div className={styles.modalHeader}>
            <h2 className={styles.title}>Update Student Details</h2>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              ✖
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input type="text" name="firstName" defaultValue={student.firstName}/>
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input type="text" name="lastName" defaultValue={student.lastName}/>
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" defaultValue={student.email}/>
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="text" name="phone" defaultValue={student.phone}/>
            </div>
            <div className={styles.formGroup}>
              <label>Registration Number</label>
              <input type="text" name="regNo" defaultValue={student.regNo}/>
            </div>
            <div className={styles.formGroup}>
              <label>KCSE Number</label>
              <input type="text" name="kcseNo" defaultValue={student.kcseNo}/>
            </div>
            <div className={styles.formGroup}>
              <label>Gender</label>
              <select name="gender" defaultValue={student.gender}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Fee Payment Status</label>
              <select name="feePayment" defaultValue={student.feePayment}>
                <option value="">Fee Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Exam Result Status</label>
              <select name="examResults" defaultValue={student.examResults}>
                <option value="">Exam Result Status</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="no-show">No Show</option>
              </select>
            </div>


          </form>
          <div className={styles.buttonContainer}>

            <button type="submit" className={styles.submitButton}>Update</button>
          </div>
        </div>
      </div>
  );
};

export default SinstudentPage;
