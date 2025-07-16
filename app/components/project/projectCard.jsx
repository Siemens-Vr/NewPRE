"use client";

import React from 'react';
import styles from '@/app/styles/dashboards/project/dashboard.module.css';

export default function ProjectCard({
  title,
  implementation_startDate,
  implementation_endDate
}) {
     const start = implementation_startDate?.split('T')[0] || '';
  const end   = implementation_endDate  ?.split('T')[0] || '';
  return (
    <div>
      <h3>{title}</h3>

     
      <div className={styles.details}>
        <p>Start Date: {start}</p>
        <p>End Date: {end}</p>
      </div>
    </div>
  );
}