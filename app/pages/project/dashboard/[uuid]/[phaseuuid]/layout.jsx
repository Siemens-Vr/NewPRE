import React from 'react';
import styles from '@/app/styles/dashboards/project/dashboard.module.css';

export default function PhaseLayout({ children }) {
  // This sits under /projects/:uuid/:phaseuuid/*
  // The actual ProjectNavbar is already rendered by the [uuid] layout.
  return (
    <div className={styles.allContents}>
      {children}
    </div>
  );
}
