"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const ProjectCalendar = () => {
  const [events, setEvents] = useState([]);

  // Sample project and phase data
  const projects = [
    {
      id: 1,
      name: 'Project A',
      startDate: '2024-06-01',
      endDate: '2024-07-15',
      phases: [
        {
          name: 'Phase 1',
          startDate: '2024-06-01',
          endDate: '2024-06-15',
          deliverables: ['Design Specification', 'Wireframes'],
          status: 'completed'
        },
        {
          name: 'Phase 2',
          startDate: '2024-06-16',
          endDate: '2024-07-01',
          deliverables: ['Development', 'Initial Testing'],
          status: 'in-progress'
        },
        {
          name: 'Phase 3',
          startDate: '2024-07-02',
          endDate: '2024-07-15',
          deliverables: ['Final Testing', 'Deployment'],
          status: 'delayed'
        },
      ],
    },
  ];

  // Map status to color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'in-progress':
        return '#FFC107'; // Yellow
      case 'delayed':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  useEffect(() => {
    // Map the projects and phases to events
    const mappedEvents = projects.flatMap((project) => [
      // Background event for the entire project duration
      {
        title: project.name,
        start: project.startDate,
        end: project.endDate,
        backgroundColor: 'rgba(173, 216, 230, 0.5)', // Light blue with transparency for project duration
        classNames: ['project-duration'],
        display: 'background' // Background event
      },
      // Events for each phase with deliverables
      ...project.phases.map((phase) => ({
        title: `${project.name}: ${phase.name}`,
        start: phase.startDate,
        end: phase.endDate,
        backgroundColor: getStatusColor(phase.status),
        borderColor: getStatusColor(phase.status),
        textColor: 'white', // White text for contrast
        extendedProps: {
          deliverables: phase.deliverables.join(", "), // Display deliverables as a string
          status: phase.status
        }
      })),
    ]);

    console.log("Mapped Events: ", mappedEvents); // Debugging log for event data
    setEvents(mappedEvents);
  }, []);

  // Custom content rendering for events (phases)
  const renderEventContent = (eventInfo) => {
    if (eventInfo.event.display === 'background') {
      return null; // Do not render text for background events
    }

    // Render title and status for phase events
    return (
      <div style={{ padding: '2px', overflow: 'hidden' }}>
        <div style={{ fontWeight: 'bold', fontSize: '0.8em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {eventInfo.event.title} {/* Phase Name */}
        </div>
        <div style={{ fontSize: '0.7em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Status: {eventInfo.event.extendedProps.status} {/* Phase Status */}
        </div>
        <div style={{ fontSize: '0.7em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Deliverables: {eventInfo.event.extendedProps.deliverables} {/* Deliverables */}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Project Calendar</h2>
      <div style={{ height: '900px' }}> {/* Set a fixed height */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          // eventContent={renderEventContent} // Custom event rendering function
          editable={true}
          selectable={true}
          height="100%"
        />
      </div>
    </div>
  );
};

export default ProjectCalendar;
