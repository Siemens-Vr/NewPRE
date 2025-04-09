"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/components/add/addComponent.module.css';
import ConditionPopUp from '@/app/components/condition/condition';
import { config } from '/config';

const AddComponent = ({onClose}) => {
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
                    console.error("Failed to fetch component types");
                }
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchComponentTypeData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity') {
            setDisablePartNumber(parseInt(value, 10) > 1);
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === 'status' ? value === 'Borrowed' :
                   name === 'condition' ? value === 'Not Okay' ? false : true :
                   value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            partNumber: formData.partNumber.trim() || null,
            conditions
        };

        try {
            const response = await fetch(`${config.baseURL}/components`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (response.ok) {
                alert("Component created successfully");
                setFormData({
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
                router.push('/pages/equipment/dashboard/components');
            } else {
                const err = await response.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error("Error submitting form", error);
            alert('An error occurred while submitting the form.');
        }
    };

    const handleAddConditionClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    return (
        <>

        <div className={styles.overlay}></div>

        <div className={styles.container}>
 
             <form onSubmit={handleSubmit}>
                <div className={styles.top}></div>
                  
                 <div className={styles.form}>

                  <button type="button" onClick={onClose} className={styles.btn}>X</button>


                    <div className={styles.divInput}>
                        <label htmlFor="componentType">Component Type</label>
                        <select
                            name="componentType"
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
                        <label htmlFor="modelNumber">Model Number</label>
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
                        <label htmlFor="partNumber">Serial Number</label>
                        <input
                            type="text"
                            name="partNumber"
                            placeholder="11222 (Optional)"
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
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {!formData.condition && (
                        <textarea
                            name="conditionDetails"
                            placeholder="Condition Details"
                            value={formData.conditionDetails}
                            onChange={handleChange}
                        />
                    )}

                    <button onClick={handleAddConditionClick} className={styles.add}>Add Condition</button>
                    <button type="submit" className={styles.submit1}>Submit</button>
 
                </div>
            </form>

            {showPopup && (
                <ConditionPopUp
                    onClose={() => setShowPopup(false)}
                    conditions={conditions}
                    setConditions={setConditions}
                />
            )}
        </div>
        </>
    );
};

export default AddComponent;