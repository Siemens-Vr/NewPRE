
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/components/add/addComponent.module.css'; // Adjust the import to your CSS file
import ConditionPopUp from '@/app/components/condition/condition';
import UploadForm from '@/app/components/uploadForm/uploadForm' // Adjust the import to the correct path
import { config } from '/config';

const AddComponent = () => {
  const router = useRouter();
  const [componentTypes, setComponentTypes] = useState([]);
  const [disablePartNumber, setDisablePartNumber] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [formData, setFormData] = useState({
    componentName: '',
    componentType: '',
    modelNumber: '',
    partNumber: '',
    quantity: '',
    description: '',
    status: false,
    condition: true,
    conditionDetails: ''
  });

  useEffect(() => {
    const fetchComponentTypeData = async () => {
      try {
        const response = await fetch(`${config.baseURL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setComponentTypes(data);
        } else {
          console.log("Failed to fetch component types");
        }
      } catch (error) {
        console.log("Error fetching categories");
      }
    };
    fetchComponentTypeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      setDisablePartNumber(parseInt(value, 10) > 1);
    }

    setFormData({
      ...formData,
      [name]: name === 'status' ? value === 'Borrowed'
        : name === 'condition' ? value === 'Not Okay' ? false : true
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      partNumber: formData.partNumber.trim() || null,
      conditions // Add conditions array to the data to submit
    };

    try {
      console.log(dataToSubmit);
      const response = await fetch(`${config.baseURL}/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        alert("Component created Successfully");
        setFormData({
          componentName: '',
          componentType: '',
          partNumber: '',
          quantity: '',
          description: '',
          status: false,
          condition: true,
          conditionDetails: ''
        });
        router.push('/pages/equipment/dashboard/components');
      } else {
        const err = await response.json();
        alert('You have an error on the form: ' + err.message)
      }
    } catch (error) {
      console.log("error", error.message);
      alert('An error occurred while submitting the form.');
    }
  };
  const handleAddConditionClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowPopup(true);
  };

  return (
    <div className={styles.container}>
    
      <form onSubmit={handleSubmit} >
     <div className={styles.top}>
     <button onClick={handleAddConditionClick}>Add Condition Details</button>


      {/* <UploadForm />  */}

    </div>
      <div  className={styles.form} >
        <div className={styles.divInput}>
          <label htmlFor="componentType">Component Type</label>
          <select
            name="componentType"
            placeholder="Component Type"
            value={formData.componentType}
            onChange={handleChange}
          >
            <option value="">Select Component Type</option>
            {componentTypes.map((componentType, index) => (
              <option key={index} value={componentType.category}>
                {componentType.category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.divInput}>
          <label htmlFor="componentName">Component Name</label>
          <input
            type="text"
            name="componentName"
            placeholder="Ethernet Cables"
            value={formData.componentName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="modelNumber">Model Number </label>
          <input
            type="text"
            name="modelNumber"
            placeholder="U133345w"
            value={formData.modelNumber}
            onChange={handleChange}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="20"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="partNumber">Serial Number </label>
          <input
            type="text"
            name="partNumber"
            placeholder="11222  (Optional)"
            value={formData.partNumber}
            onChange={handleChange}
            disabled={disablePartNumber}
          />
        </div>
        <div className={styles.divInput}>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}>
          </textarea>
        </div>
        <input type="hidden" name="status" value={formData.status ? 'Borrowed' : 'Not Borrowed'} />
        <input type="hidden" name="condition" value={formData.condition ? 'Okay' : 'Not Okay'} />

        {!formData.condition && (
          <textarea
            name="conditionDetails"
            placeholder="Condition Details"
            value={formData.conditionDetails}
            onChange={handleChange}
          />
        )}

       
        <button type="submit">Submit</button>
        </div>
      </form>

      {showPopup && (
        <ConditionPopUp
          onClose={() => setShowPopup(false)}
          conditions={conditions}
          setConditions={setConditions}
        />
      )}

      {/* <UploadForm /> Add the UploadForm component here */}
    </div>
  );
};

export default AddComponent;
