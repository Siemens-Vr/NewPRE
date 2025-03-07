"use client";

import React, { useState } from "react";
import ProjectInfo from "@/app/components/project/projectInfo";
import styles from "@/app/styles/project/add/AddProjectModal.module.css";

const AddProjectModal = ({ isModalOpen, closeModal, addProject }) => {
    const [newProject, setNewProject] = useState({
        name: "",
        status: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    const validateProjectInfo = () => {
        const newErrors = {};
        if (!newProject.name) newErrors.name = "Project name is required";
        if (!newProject.startDate) newErrors.startDate = "Start date is required";
        if (!newProject.endDate) newErrors.endDate = "End date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateProjectInfo()) return;

        try {
            await addProject({
                name: newProject.name,
                description: newProject.description || "",
                startDate: newProject.startDate || "",
                endDate: newProject.endDate || "",
                status: newProject.status || "",
            });
        } catch (error) {
            console.error("Error adding project:", error);
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Project Info</h2>
                <ProjectInfo newProject={newProject} setNewProject={setNewProject} />
                <div className={styles.errorMessages}>
                    {errors.name && <p>{errors.name}</p>}
                    {errors.startDate && <p>{errors.startDate}</p>}
                    {errors.endDate && <p>{errors.endDate}</p>}
                </div>
                <div className={styles.modalButtons}>
    <button className={styles.cancelButton} >Cancel</button>
    <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
</div>

            </div>
        </div>
    );
};

export default AddProjectModal;
