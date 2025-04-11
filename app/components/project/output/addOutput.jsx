"use client";

import React, { useState } from "react";
import styles from "@/app/styles/project/project/output/output.module.css";

const AddOutputModal = ({ isModalOpen, closeModal, addOutput }) => {
    const [newOutput, setNewOutput] = useState({
        name: "",
        status: "",
        completionDate: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    const validateOutputInfo = () => {
        const newErrors = {};
        if (!newOutput.name) newErrors.name = "Output name is required";
        if (!newOutput.completionDate) newErrors.completionDate = "Completion date is required";
        if (!newOutput.status) newErrors.status = "Status is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setNewOutput({ ...newOutput, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!validateOutputInfo()) return;

        try {
            await addOutput(newOutput);
            closeModal(); // Close modal after submission
        } catch (error) {
            console.error("Error adding output:", error);
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Add New Output</h2>

                <div className={styles.inputGroup}>
                    <label>Output Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newOutput.name}
                        onChange={handleChange}
                        placeholder="name"
                    />
                    {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={newOutput.description}
                        onChange={handleChange}
                        placeholder="Enter output description"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Status:</label>
                    <select name="status" value={newOutput.status} onChange={handleChange}>
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Completion Date:</label>
                    <input
                        type="date"
                        name="completionDate"
                        value={newOutput.completionDate}
                        onChange={handleChange}
                    />
                    {errors.completionDate && <p className={styles.error}>{errors.completionDate}</p>}
                </div>

                <div className={styles.modalButtons}>
                    <button className={styles.cancelButton} onClick={closeModal}>Cancel</button>
                    <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddOutputModal;
