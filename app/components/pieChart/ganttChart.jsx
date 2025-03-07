"use client";

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const GanttChart = () => {
  const ganttRef = useRef(null);

  useEffect(() => {
    const loadGantt = async () => {
      // Dynamically import frappe-gantt
      const { default: Gantt } = await import('frappe-gantt');
      
      const tasks = [
        {
          id: 'Task 1',
          name: 'Electrical system',
          start: '2023-12-04',
          end: '2023-12-06',
          progress: 50,
          dependencies: ''
        },
        {
          id: 'Task 2',
          name: 'Plumbing (MEP)',
          start: '2023-12-05',
          end: '2023-12-07',
          progress: 20,
          dependencies: 'Task 1'
        },
        {
          id: 'Task 3',
          name: 'HVAC',
          start: '2023-12-06',
          end: '2023-12-08',
          progress: 75,
          dependencies: 'Task 2'
        },
        {
          id: 'Task 4',
          name: 'System testing',
          start: '2023-12-10',
          end: '2023-12-12',
          progress: 30,
          dependencies: 'Task 3'
        },
      ];

      const gantt = new Gantt(ganttRef.current, tasks, {
        view_mode: 'Day', // Can be Day, Week, Month
      });
    };

    loadGantt(); // Call the function to load the Gantt library
  }, []);

  return (
    <div>
      <h2>Project Timeline (Gantt Chart)</h2>
      <div ref={ganttRef}></div>
    </div>
  );
};

export default GanttChart;
