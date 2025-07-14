"use client";

import React from "react";
import styles from "./Timeline.module.css";

export default function Timeline({ dates, selectedDate, onDateClick }) {
  if (!dates.length) return null;

  // Remove duplicates and sort dates
  const uniqueDates = [...new Set(dates)]; // Remove duplicates
  const sorted = uniqueDates
    .map((d) => new Date(d))
    .sort((a, b) => a - b);
  const min = sorted[0].getTime();
  const max = sorted[sorted.length - 1].getTime();
  const range = max - min || 1;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {sorted.map((dt, i) => {
          const time = dt.getTime();
          const pct = ((time - min) / range) * 100;
          const dateStr = dt.toLocaleDateString();
          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={i}
              className={styles.dotWrapper}
              style={{ left: `${pct}%` }}
            >
              <div
                className={`${styles.dot} ${
                  isSelected ? styles.selected : ""
                }`}
                title={dateStr}
                onClick={() => onDateClick && onDateClick(dateStr)}
              />
              {/* Show date label only for first and last dots */}
              {(i === 0 || i === sorted.length - 1) && (
                <div className={`${styles.dateLabel} ${isSelected ? styles.selectedDateLabel : ''}`}>
                  {dateStr}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}