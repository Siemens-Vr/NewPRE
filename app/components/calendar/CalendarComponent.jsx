"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "@/app/styles/calendar/calendar.module.css";
const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className={styles.calendarContainer}>
            <h3 className={styles.calendarTitle}>Calendar</h3>
            <Calendar onChange={setDate} value={date}  className={styles.calendar}  />
        </div>
    );
};

export default CalendarComponent;
