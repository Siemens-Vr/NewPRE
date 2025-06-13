// app/components/calendar/CalendarComponent.jsx
'use client';

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import styles from '@/app/styles/calendar/calendar.module.css';

const localizer = momentLocalizer(moment);

export default function CalendarComponent() {
  // Example events; replace with your real data if needed
  const events = [
    {
      title: 'New User Registered',
      start: new Date(),
      end:   new Date(),
    }
  ];

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        toolbar={true}
        views={['month', 'week', 'day']}
      />
    </div>
  );
}
