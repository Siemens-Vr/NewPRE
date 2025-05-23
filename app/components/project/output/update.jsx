"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';
import { config } from "/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import style from "@/app/styles/project/project/milestone.module.css"
import api from '@/app/lib/utils/axios';

const UpdateOutputPopup = ({ output, onClose, onSave }) => {
const params = useParams();
  const {phaseuuid, outputuuid } = params;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        completionDate:'',
        status :'',
       
    });

    useEffect(() => {
        if (output) {
            setFormData({
                name: output.name || '',
                description: output.description || '',
                completionDate: output.completionDate
                    ? new Date(output.completionDate).toISOString().slice(0, 16)
                    : '',
                status: output.status || '',
                
            });
        }
    }, [output]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    
    const handleSave = async () => {
        const updatedData = { ...formData }; // Clone formData to avoid mutation
    
        try {
            const url = `/outputs/${phaseuuid}/${output.uuid}`;
            // console.log('Update URL:', url);
            // console.log('Data being sent:', updatedData);
        
            const response = await api.put(url, updatedData, {
                headers: {
                    "Content-Type": "application/json",  // Ensure backend sees it as JSON
                }
                
            });
    
            const responseData = response.data;
            // console.log('Update Response:', responseData);
    
            if (response.statusText === 'OK') {
                alert('Output updated successfully!');
                await onSave(true);
            } else {
                // console.error('Failed to update output', responseData);
                alert(responseData.message || 'Failed to update the output!');
                onSave(false);
            }
        } catch (error) {
            // console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
            onSave(false);
        }
    };
    
    
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                    <h2>Update Output</h2>
                </div>
                <ToastContainer position="top-center" autoClose={3000} />
                <form>
                <div className={styles.inputGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="description"> Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                   
                    <div className={styles.inputGroup}>
                        <label htmlFor="completionDate">Completion Date</label>
                        <input
                            type="datetime-local"
                            id="completionDate"
                            name="completionDate"
                            value={formData.completionDate}
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            
                        >
                            <option value="">Select Status</option>
                            <option value="To-do">To-do</option>
                            <option value="Progress">Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>


                    <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
                        <button type="button" className={style.addButton1} onClick={handleSave}>Update</button>
                        <button type="button" className={style.closeButton1} onClick={onClose}>X</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateOutputPopup;