"use client";
import { useState } from "react";
import styles from '@/app/styles/students/addStudent/addStudent.module.css';
import { config } from "/config";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/styles/customToast/customToast.module.css'

const AddFacilitatorPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    idNo: "",
    phoneNo: "",
    specification: ""
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/facilitators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log("Facilitator added successfully");
        setSuccessMessage("Facilitator added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          idNo: "",
          phoneNo: "",
          specification: ""
        });
  
        if (router) {
          router.push(`/pages/student/dashboard/facilitators`);
        } else {
          console.error("Router is not available");
        }
      } else {
        const data = await response.json();
        // Only display error toasts
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach(err => toast.error(err)); // Display each error as a toast
        } else {
          toast.error("Failed to add Facilitator");
        }
        console.error("Failed to add Facilitator");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  

  return (
    <div className={styles.container}>
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.divInput}>
          <label htmlFor="firstName" className={styles.label}>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="lastName" className={styles.label}>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="gender" className={styles.label}>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className={styles.divInput}>
          <label htmlFor="phoneNo" className={styles.label}>Phone Number</label>
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="specification" className={styles.label}>Specification</label>
          <input
            type="text"
            placeholder="Specification"
            name="specification"
            value={formData.specification}
            onChange={handleChange}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="idNo" className={styles.label}>ID Number</label>
          <input
            type="text"
            placeholder="ID Number"
            name="idNo"
            value={formData.idNo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          // transition={Slide}
          toastClassName="custom-toast" // Apply custom styling
          bodyClassName="custom-toast-body"
        />
      </form>
    </div>
  );
};

export default AddFacilitatorPage;
