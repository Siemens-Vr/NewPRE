"use client";
import { useEffect, useState } from "react";
import styles from '@/app/styles/supplier/addSupplier.module.css';
import {config} from "/config";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStaffPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [projects, setProjects] =useState([]);
  const [users, setUsers] =useState([])
  const router =useRouter ();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    idNo: "",
    phone: "",
    startDate: "",
    project:"",
  });
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(()=>{
    const getProjects = async()=>{
      const response = await fetch(`${config.baseURL}/projects`)
      const data = await response.json()
      setProjects(data)

      console.log(data)
    }
    getProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData); 
    try {
      const response = await fetch(`${config.baseURL}/staffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server Response:", data);
      
      if (response.ok) {
        // Handle successful submission
        console.log("Staff added successfully");
        setSuccessMessage("Staff added successfully!");
        // Clear the form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          idNo: "",
          phone: "",
          startDate:"",
          project:"",
        });
      } else {
        // Handle submission error
        // Check if there are errors in the response
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach(err => toast.error(err)); // Display each error as a toast notification
        }
        console.error("Failed to add Staff");
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.divInput}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
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
        <div className={styles.divInput}>
          <label htmlFor="project" className={styles.label}>Project</label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects?.length > 0 ? projects.map((project) => (
              <option key={project.uuid} value={project.uuid}>
                {project.name}
              </option>
            )) : null}
          </select>
        </div>
        <div className={styles.divInput}>
          <label htmlFor="startDate" className={styles.label}>Start Date</label>
          <input
            type="date"
            placeholder="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.submit1} type="submit">Submit</button>
        </div>
        <ToastContainer />
      </form>
   
    </div>
  );
};

export default AddStaffPage;
