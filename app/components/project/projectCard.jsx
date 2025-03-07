"use client";

import React from 'react';
import styles from '@/app/styles/project/projectInfo.module.css';

const ProjectCard = ({ title, status, startDate, endDate }) => {
    const statusClass = styles[status.toLowerCase()] || styles.todo; // Fallback class

    return (
        <div className={styles.projectCard}>
            <h3> Project Name - {title}</h3>
            <div className={styles.status}>
                <span className={statusClass}>Project Status - {status}</span>
            </div>
            <p className={styles.dates}>
                Start Date - {new Date(startDate).toLocaleDateString()}
            </p>
            <p className={styles.dates}>
                End Date - {new Date(endDate).toLocaleDateString()}
            </p>

        </div>
    );
};

export default ProjectCard;