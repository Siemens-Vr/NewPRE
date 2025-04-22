 
"use client";

import { useEffect, useState } from "react";
import styles from '@/app/styles/supplier/addSupplier.module.css';
import { config } from "/config";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStaffPage = ({ onClose }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    idNo: "",
    phone: "",
    startDate: "",
    project: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetch(`${config.baseURL}/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    getProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/staffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Staff added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          idNo: "",
          phone: "",
          startDate: "",
          project: "",
        });
      } else {
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach(err => toast.error(err));
        }
        console.error("Failed to add Staff");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.top}></div>

          <button type="button" onClick={onClose} className={styles.btn}>X</button>
          <div className={styles.form}>

            <div className={styles.divInput}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.divInput}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.divInput}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.divInput}>
              <label htmlFor="gender">Gender</label>
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.divInput}>
              <label htmlFor="idNo">ID Number</label>
              <input
                type="text"
                name="idNo"
                placeholder="ID Number"
                value={formData.idNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.divInput}>
              <label htmlFor="project">Project</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.uuid} value={project.uuid}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.divInput}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

             <ToastContainer />
          </div>
          <button type="submit" className={styles.submit1}>Submit</button>

        </form>
      </div>
    </>
  );
};

export default AddStaffPage;
