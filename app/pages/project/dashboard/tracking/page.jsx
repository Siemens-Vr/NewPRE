"use client"
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


// Mock data for demonstration
const projects = [
  {
    id: 1,
    name: 'Project Alpha',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    phases: [
      {
        id: 1,
        name: 'Phase 1',
        startDate: '2024-09-01',
        endDate: '2024-10-15',
        deliverables: ['Requirements Document', 'Design Specs']
      },
      {
        id: 2,
        name: 'Phase 2',
        startDate: '2024-10-16',
        endDate: '2024-12-31',
        deliverables: ['MVP', 'User Testing Results']
      }
    ]
  },
  {
    id: 1,
    name: 'Project cat', 
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    phases: [
      {
        id: 1,
        name: 'Phase 1',
        startDate: '2024-09-01',
        endDate: '2024-10-15',
        deliverables: ['Requirements Document', 'Design Specs']
      },
      {
        id: 2,
        name: 'Phase 2',
        startDate: '2024-10-16',
        endDate: '2024-12-31',
        deliverables: ['MVP', 'User Testing Results']
      }
    ]
  },
  // Add more projects as needed
];


const ProjectCalendar = () => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = projects.flatMap(project => [
    {
      id: `project-${project.id}`,
      title: project.name,
      start: project.startDate,
      end: project.endDate,
      color: '#3788d8',
      extendedProps: { type: 'project' }
    },
    ...project.phases.map(phase => ({
      id: `phase-${phase.id}`,
      title: `${project.name}: ${phase.name}`,
      start: phase.startDate,
      end: phase.endDate,
      color: '#4caf50',
      extendedProps: { type: 'phase', deliverables: phase.deliverables }
    }))
  ]);

  

  return (
    <div className="p-4">

      <div className="grid grid-cols-7 gap-2">{}</div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}

      />
    </div>
  );
};

export default ProjectCalendar;