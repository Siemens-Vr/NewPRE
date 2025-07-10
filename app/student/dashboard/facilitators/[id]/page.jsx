"use client"

import styles from '@/app/styles/students/singleStudent/Facilitator.module.css'
import React, { useState, useEffect } from "react";
import { AddUpdateHoursPopup, ViewHoursPopup } from '@/app/components/facilitators/WorkHoursPopups'
import Image from "next/image";
import api from '@/app/lib/utils/axios';
import UpdateFacilitator from "@/app/components/facilitators/UpdateFacilitator";

const SingleFacilitatorPage = ({ params }) => {
 const [facilitator, setFacilitator] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [currentFacilitatorId, setCurrentFacilitatorId] = useState(null);
const [popupType, setPopupType] = useState(null);
const [editingField, setEditingField] = useState(null);
const [showUpdate, setShowUpdate] = useState(false);

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idNo:'',
    phoneNo: '',
    gender: '',
  });
  const { id } = params;

  useEffect(() => {
    const fetchFacilitator = async () => {
      try {
        const response = await api.get(`/facilitators/${id}`);
        setFacilitator(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          idNo: response.data.idNo,
          phoneNo: response.data.phoneNo,
          gender: response.data.gender,

        });
      } catch (error) {
        console.error('Error fetching facilitator:', error);
      }
    };

    fetchFacilitator();
  }, [id]);


  const [showAddUpdateHours, setShowAddUpdateHours] = useState(false);
  const [showViewHours, setShowViewHours] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//added by me
    const handleBlur = () => {
        setEditingField(null); // Exit edit mode when clicking outside
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setEditingField(null); // Save when Enter is pressed
        }
    };
//to this place
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log(formData)
   const response = await api.patch(`/facilitators/${id}/update`, formData);

    if (!response.ok) {
      
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    setSuccessMessage(data.message); // Set the success message

      setTimeout(() => {
      setSuccessMessage('');
    }, 2000);

    setErrorMessage(data.message); // Set the success message

    setTimeout(() => {
    setErrorMessage('');
  }, 404);


    // console.log("Update response:", data);

    const updatedFacilitator = await api.get(`/facilitators/${id}`);
    const updatedData = await updatedFacilitator.json();
    setFacilitator(updatedData);


    // Clear the success message after 5 seconds
  
  } catch (error) {
    // console.error('Error updating facilitator:', error);
    alert('Failed to update facilitator. Please try again.');
  }
};

const handleAddUpdateHours = async (entries) => {
  // console.log(entries)
  try {
    const response = await api.post(`/facilitators/${id}/hours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries }),
    });
    if (!response.ok) {
      setErrorMessage('Failed to add Hours');
      setTimeout(()=> setErrorMessage (''), 404);
      // throw new Error('Failed to add hours');
    }
    setSuccessMessage('Hours updated successfully');
    setTimeout(() => setSuccessMessage(''), 2000);
  } catch (error) {
    setErrorMessage('Error updating hours:');
    setTimeout(()=> setErrorMessage (''), 404);
    // console.error('Error updating hours:', error);
    setErrorMessage('Failed to update hours. Please try again.');
    setTimeout(()=> setErrorMessage (''), 404);
    // alert('Failed to update hours. Please try again.');
  }
};


  if (!facilitator) {
    return <div>Loading...</div>;
  }

    const handleshowUpdate = () => {
        setShowUpdate(true);
    };
    const handleshowDelete = () => {
        setShowUpdate(false);
    }
    // console.log(formData)
  return (
      <div className={styles.container}>
          <div className={styles.header}>
              <h1>Welcome {facilitator.firstName}</h1>
              <div>
                  <p>Today is a good day</p>
                  {/*<button className={styles.button}>Total Fee Paid</button>*/}
                  {/*<button className={styles.button}>Course Level</button>*/}
                  {/*<button className={styles.button}>Task</button>*/}
              </div>
          </div>

          <div className={styles.profile}>
              {/* Profile Section */}
              <div className={styles.card}>
                  <Image
                      className={styles.userImage}
                      src="/noavatar.png"
                      alt=""
                      width="50"
                      height="50"
                  />
                  <h3>{facilitator.firstName} {facilitator.lastName}</h3>
                  <p>{facilitator.idNo}</p>
              </div>

              {/* Details Section with Editable Fields */}
              <div className={styles.details}>
                  <div className={styles.detailsHeader}>
                      <h2>Personal Details</h2>
                      <button onClick={handleshowUpdate} className={styles.updateButton}>
                          Update
                      </button>
                  </div>
                      <p><strong>Full Name:</strong> {facilitator.firstName} {facilitator.lastName}</p>
                      <p><strong>Email:</strong> {facilitator.email}</p>
                      <p><strong>Phone:</strong> {facilitator.phoneNo}</p>
                      <p><strong>Id Number:</strong> {facilitator.idNo}</p>

                      {showUpdate && <UpdateFacilitator onClose={handleshowDelete}/>}
                  </div>
              </div>

              {/* <div className={styles.hoursButtons}>
             <button className={styles.button} onClick={() => setPopupType('addUpdate')}>Add Hours</button>
             <button className={styles.button} onClick={() => setPopupType('view')}>View Hours</button>
          </div> */}
{/* 
          {popupType === 'addUpdate' && (
             <AddUpdateHoursPopup facilitatorId={currentFacilitatorId} onClose={() => setPopupType(null)}
                               onSubmit={(entries) => handleAddUpdateHours(entries)}/>
        )}

          {popupType === 'view' && (
             <ViewHoursPopup facilitatorId={currentFacilitatorId} onClose={() => setPopupType(null)}/>
          )} */}
      </div>
  );
};

export default SingleFacilitatorPage;