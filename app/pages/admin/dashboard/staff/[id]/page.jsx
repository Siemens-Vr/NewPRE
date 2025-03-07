
"use client";
import styles from '@/app/styles/staff/singleStaff/singleStaff.module.css'

import { useState, useEffect } from "react";
import {config} from "/config";


const SingleStaffPage = ({ params }) => {
  const [staff, setStaff] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    project: '',
    idNo: '',
    startDate: '',
    leaveDays: 0
  });
  const [leaveData, setLeaveData] = useState({
    leaveDaysLeft: 0,
    newLeaveDate: '',
    leaveDates: [], // Array to store leave dates
  });

  const { id } = params;

  useEffect(() => {
  const fetchStaff = async () => {
    try {
      const response = await fetch(`${config.baseURL}/staffs/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStaff(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        gender: data.gender,
        project: data.project,
        idNo: data.idNo,
        startDate: data.startDate || '',
        leaveDays: data.leaveDays || 0,
      });
      setLeaveData({
        leaveDaysLeft: data.leaveDays || 0,
        newLeaveDate: '',
        leaveDates: data.leaveDaysTaken ? data.leaveDaysTaken.map(leave => leave.days) : [],
      });
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  fetchStaff();
}, [id]);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLeaveChange = (e) => {
    setLeaveData({
      ...leaveData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/staffs/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);

      const updatedStaff = await fetch(`${config.baseURL}/staffs/${id}`);
      const updatedData = await updatedStaff.json();
      setStaff(updatedData);
    } catch (error) {
      alert('Failed to update staff. Please try again.');
    }
  };
const handleLeaveSubmit = async (e) => {
  e.preventDefault();
  try {
    const formattedDate = new Date(leaveData.newLeaveDate).toISOString().split('T')[0];

    const response = await fetch(`${config.baseURL}/staffs/${id}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days: formattedDate }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add leave day');
    }

    setSuccessMessage("Leave day added successfully");
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);

    // Update local state
    setLeaveData(prevData => ({
      ...prevData,
      leaveDates: [...prevData.leaveDates, formattedDate],
      leaveDaysLeft: Math.max(0, prevData.leaveDaysLeft - 1),
      newLeaveDate: '',
    }));

    // Fetch updated staff data
    const updatedStaffResponse = await fetch(`${config.baseURL}/staffs/${id}`);
    const updatedStaffData = await updatedStaffResponse.json();
    setStaff(updatedStaffData);
    
    setFormData(prevData => ({
      ...prevData,
      leaveDays: updatedStaffData.leaveDays
    }));

  } catch (error) {
    setSuccessMessage(`Error: ${error.message}`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  }
};

const handleDeleteLeaveDate = async (index, date) => {
  try {
    const response = await fetch(`${config.baseURL}/staffs/${id}/leave`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day: date }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    setSuccessMessage(data.message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);

    // Update local state
    setLeaveData(prevData => ({
      ...prevData,
      leaveDates: prevData.leaveDates.filter((_, i) => i !== index),
      leaveDaysLeft: (prevData.leaveDaysLeft + 1) || 0,
    }));

  } catch (error) {
    alert('Failed to delete leave day. Please try again.');
  }
};
  if (!staff) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{staff.firstName} {staff.lastName}</h1>
      </div>
    {successMessage && (
  <div className={successMessage.includes('error') ? styles.errorMessage : styles.successMessage}>
    {successMessage}
  </div>
)}

      <div className={styles.formsWrapper}>
        <div className={styles.formContainer}>
          <h2>Staff Details</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label>Gender</label>
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
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <label>Project</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            />
            <label>ID Number</label>
            <input
              type="text"
              name="idNo"
              value={formData.idNo}
              onChange={handleChange}
              required
            />
            <label>Start Date</label>
            <input
              type="text"
              placeholder={staff.startDate}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <label>Leave Days</label>
            <input
              type="number"
              name="leaveDays"
              value={formData.leaveDays}
              onChange={handleChange}
              required
            />
            <button type="submit">Update</button>
          </form>
        </div>

        <div className={styles.formContainer}>
          <h2>Leave Management</h2>
          <div className={styles.leaveInfo}>
            <p>Leave Days Left: {leaveData.leaveDaysLeft}</p>
          </div>
          <form className={styles.form} onSubmit={handleLeaveSubmit}>
            <label>Add Leave Day</label>
            <input
              type="date"
              name="newLeaveDate"
              value={leaveData.newLeaveDate}
              onChange={handleLeaveChange}
              required
            />
            <button type="submit">Add Leave Day</button>
          </form>
                <div className={styles.leaveDates}>
                  <h3>Requested Leave Dates:</h3>
                  <ul>
                    {leaveData.leaveDates.map((date, index) => (
                      <li key={index} className={styles.leaveDateItem}>
                        {new Date(date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
    </div>
  );
};

export default SingleStaffPage;
