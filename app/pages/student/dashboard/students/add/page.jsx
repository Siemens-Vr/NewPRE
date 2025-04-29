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


const AddStudentPage = ({onClose}) => {
  const router= useRouter();
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cohortLevelList, setCohortLevelList] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    regNo: "",
    kcseNo: "",
    gender: "",
    id: "",
   
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCohorts = (data) => {
    setCohortLevelList(data);
  };

  const handleDelete = (index) => {
    // Filter out the item by index
    const updatedCohortLevelList = cohortLevelList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setCohortLevelList(updatedCohortLevelList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    onClose();
    
    const dataToSend = {
      ...formData,
      cohortLevels: cohortLevelList.map(item => ({
        cohortUuid: item.cohortUuid,
        levelUuid: item.levelUuid,
        fee : item.fee,
        examResults : item.examResults

      }))
    };

    // console.log("Data to be sent to the backend:", dataToSend);

    try {
    const response = await api.post("/students", dataToSend, {
        headers: {
            "Content-Type": "application/json",
        },
        });
        const data = response.data;
         
      if (response.statusText === 'OK') {
        // console.log("Student added successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          regNo: "",
          kcseNo: "",
          gender: "",
          id:"",
          
        });
        setCohortLevelList([]);
        if (router) {
          router.push(`/pages/student/dashboard/students`);
      } else {
          console.error("Router is not available");
      }
      } else {
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach(err => toast.error(err)); // Display each error as a toast
        } else {
          toast.error("Failed to add Facilitator");
        }
        console.error("Failed to add Facilitator");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the student.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
      <div className={styles.modalOverlay} >
          <div className={styles.modalContent}>


              <div>

                  {showSuccess && (<div className={styles.successMessage}>Student added successfully!</div>)}

                  <form onSubmit={handleSubmit} className={styles.form}>
                      {errorMessage && (
                          <div>
                              {errorMessage}
                          </div>
                      )}


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
                          <label htmlFor="phone" className={styles.label}>Phone Number</label>
                          <input
                              type="text"
                              placeholder="Phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                          />
                      </div>
                      <div className={styles.divInput}>
                          <label htmlFor="regNo" className={styles.label}>Registration Number</label>
                          <input
                              type="text"
                              placeholder="Registration Number"
                              name="regNo"
                              value={formData.regNo}
                              onChange={handleChange}
                              required
                          />
                      </div>
                      <div className={styles.divInput}>
                          <label htmlFor="kcseNo" className={styles.label}>KCSE Number</label>

                          <input
                              type="text"
                              placeholder="KCSE Number"
                              name="kcseNo"
                              value={formData.kcseNo}
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
                          <label htmlFor="id" className={styles.label}>Id NO</label>

                          <input
                              type="text"
                              placeholder="Id NO"
                              name="IdNO"
                              value={formData.id}
                              onChange={handleChange}
                              required
                          />
                      </div>


                      <button
                          type="button"
                          onClick={() => setShowCohortModal(true)}
                          className={styles.addCohortButton}
                      >
                          {/*<span className={styles.plusSign}>+</span>*/}
                          <span className={styles.addText}>Add Cohort and Level</span>
                      </button>


                      {cohortLevelList.length > 0 && (
                          <div className={styles.cohortLevelList}>
                              <h3>Selected Cohorts and Levels:</h3>
                              <table className={styles.table}>
                                  <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>Cohort Name</th>
                                      <th>Level Name</th>
                                      <th>Fee Amount</th>
                                      <th>Exam Results</th>
                                      <th>Actions</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {cohortLevelList.map((item, index) => (
                                      <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>{item.cohortName}</td>
                                          <td>{item.levelName}</td>
                                          <td>{item.fee}</td>
                                          <td>{item.examResults}</td>
                                          <td>
                                              <button onClick={() => handleDelete(index)}
                                                      className={styles.deleteButton}>
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </table>
                          </div>
                      )}

                      <button type="submit" className={styles.submitButton} disabled={loading}>
                          {loading ? (
                              <>
                                  <Spinner/> Please wait...
                              </>
                          ) : (
                              'SUBMIT'
                          )}

                      </button>
                      <button type="button" className={styles.closeButton} onClick={onClose}>
                          ✖
                      </button>
                      <ToastContainer/>
                  </form>
                  {showCohortModal && (
                      <CohortModal
                          onSave={handleSaveCohorts}
                          onClose={() => setShowCohortModal(false)}
                      />
                  )}


              </div>
          </div>
      </div>
  );
};

export default AddStudentPage;