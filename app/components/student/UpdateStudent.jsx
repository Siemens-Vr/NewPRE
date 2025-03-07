"use client";
import styles from "../ui/dashboard/students/singleStudent/singleStudent.module.css";
import { useState, useEffect } from "react";
import { config } from "../../../../config";

const SinstudentPage = ({ params }) => {
  const [student, setStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { id } = params;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${config.baseURL}/students/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched student data:", data);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedStudent = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      regNo: formData.get('regNo'),
      kcseNo: formData.get('kcseNo'),
      gender: formData.get('gender'),
     
   
    };

    try {
      const response = await fetch(`${config.baseURL}/students/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setSuccessMessage(result.message); // Set success message
      setTimeout(() => setSuccessMessage(""), 5000); // Hide message after 5 seconds
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      <div className={styles.infoContainer}>
        {student.firstName} {student.lastName}
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>First Name</label>
          <input type="text" name="firstName" defaultValue={student.firstName} />
          <label>Last Name</label>
          <input type="text" name="lastName" defaultValue={student.lastName} />
          <label>Email</label>
          <input type="email" name="email" defaultValue={student.email} />
          <label>Phone</label>
          <input type="text" name="phone" defaultValue={student.phone} />
          <label>Registration Number</label>
          <input type="text" name="regNo" defaultValue={student.regNo} />
          <label>KCSE Number</label>
          <input type="text" name="kcseNo" defaultValue={student.kcseNo} />
          <label>Gender</label>
          <select name="gender" defaultValue={student.gender}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label>Fee Payment Status</label>
          <select name="feePayment" defaultValue={student.feePayment}>
            <option value="">Fee Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <label>Exam Result Status</label>
          <select name="examResults" defaultValue={student.examResults}>
            <option value="">Exam Result Status</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="no-show">No Show</option>
          </select>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default SinstudentPage;