"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Use useSearchParams for query parameters
import styles from '@/app/styles/borrow/add/borrowForm.module.css';
import { config } from '/config';

const BorrowForm = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get the 'id' from the query parameters
  // console.log(id); // Check if 'id' is being captured correctly

  const [components, setComponents] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    componentUUID: "",
    fullName: "",
    borrowerContact: "",
    borrowerID: "",
    departmentName: "",
    quantity: "",
    dateOfIssue: getCurrentDate(),
    expectedReturnDate: "",
    purpose: "",
    reasonForBorrowing: ""
  });

  const departments = ['Human Resources', 'Finance', 'Engineering', 'Marketing', 'Sales'];

  useEffect(() => {
    if (id) {
      setFormData(prevState => ({
        ...prevState,
        componentUUID: id
      }));
    }
  }, [id]);

  useEffect(() => {
    const fetchComponentTypes = async () => {
      try {
        const response = await fetch(`${config.baseURL}/components`);
        if (response.ok) {
          const data = await response.json();
          setComponentTypes(data);
        } else {
          console.log("Could not fetch data");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComponentTypes();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      if (!formData.componentType) return;

      try {
        const response = await fetch(`${config.baseURL}/components/components/${formData.componentType}`);
        if (response.ok) {
          const data = await response.json();
          setComponents(data.rows);
        } else {
          console.log("Error fetching data");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchComponents();
  }, [formData.componentType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);

    try{
      const response = await fetch(`${config.baseURL}/borrow`, {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      });
      if(response.ok){
        alert('Borrower added successfully');
        setFormData({
          componentUUID: id || "",
          fullName: "",
          borrowerContact: "",
          borrowerID: "",
          quantity: "",
          departmentName: "",
          dateOfIssue: getCurrentDate(),
          expectedReturnDate: "",
          purpose: "",
          reasonForBorrowing: ""
        });
      }
    }catch(error){
      console.log(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {!id && (
          <>
            <select 
              name="componentType" 
              value={formData.componentType}
              onChange={handleChange}
            >
              <option value="">Select Component Type</option>
              {componentTypes.map((componentType, index) => (
                <option key={index} value={componentType.componentType}>
                  {componentType.componentType}
                </option>
              ))}
            </select>

            <select 
              name="componentUUID" 
              value={formData.componentUUID}
              onChange={handleChange}
            >
              <option value="">Select the Component</option>
              {components.map((component, index) => (
                <option key={index} value={component.uuid}>
                  {component.componentName}
                </option>
              ))}
            </select>
          </>
        )}
        
            <input 
          type="number" 
          name="quantity" 
          value={formData.quantity} 
          onChange={handleChange} 
          placeholder="quantity" 
        />

        <input 
          type="text" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleChange} 
          placeholder="Full Name" 
        />
        <input 
          type="text" 
          name="borrowerContact" 
          value={formData.borrowerContact} 
          onChange={handleChange} 
          placeholder="Contact" 
        />
        <input 
          type="text" 
          name="borrowerID" 
          value={formData.borrowerID} 
          onChange={handleChange} 
          placeholder="ID/Registration Number" 
        />

        <select 
          name="departmentName" 
          value={formData.departmentName} 
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
        
        <input 
          type="date" 
          name="expectedReturnDate" 
          value={formData.expectedReturnDate} 
          onChange={handleChange} 
          placeholder="Expected Return Date" 
        />
       
        <textarea 
          name="purpose" 
          value={formData.purpose} 
          onChange={handleChange} 
          placeholder="Purpose"
        />
        <textarea 
          name="reasonForBorrowing" 
          value={formData.reasonForBorrowing} 
          onChange={handleChange} 
          placeholder="Reason for Borrowing"
        />

        <button type="submit">Submit</button>
      </form>
      
    </div>
  );
}

export default BorrowForm;
