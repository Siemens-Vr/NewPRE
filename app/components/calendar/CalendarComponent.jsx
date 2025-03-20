"use client"; // Required for Next.js when using state

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "@/app/styles/calendar/calendar.module.css"; // Create this file for custom styles
const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className={styles.calendarContainer}>
            <h3 className={styles.calendarTitle}>Calendar</h3>
            <Calendar onChange={setDate} value={date} />
        </div>
    );
};

export default CalendarComponent;
