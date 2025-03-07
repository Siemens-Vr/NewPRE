// WorkHoursPopups.js
"use client"

import { useState } from 'react';
import styles from '@/app/styles/students/singleStudent/singleStudent.module.css'
import { config } from "/config";


export const AddUpdateHoursPopup = ({ facilitatorId, onClose, onSubmit }) => {
  const [entries, setEntries] = useState([{ day: '', hours: '' }]);

  const handleEntryChange = (index, field, value) => {
    const newEntries = entries.map((entry, i) => {
      if (i === index) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { date: '', hours: '' }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(entries);
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Add/Update Hours</h2>
        <form onSubmit={handleSubmit}>
          {entries.map((entry, index) => (
            <div key={index} className={styles.entryRow}>
              <input
                type="date"
                value={entry.day}
                onChange={(e) => handleEntryChange(index, 'day', e.target.value)}
                required
              />
              <input
                type="number"
                value={entry.hours}
                onChange={(e) => handleEntryChange(index, 'hours', e.target.value)}
                required
                min="0"
                step="0.5"
                placeholder="Hours"
              />
              {entries.length > 1 && (
                <button type="button" onClick={() => removeEntry(index)} className={styles.removeEntryBtn}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addEntry} className={styles.addEntryBtn}>
            Add Another Day
          </button>
          <div className={styles.popupButtons}>
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};



export const ViewHoursPopup = ({ facilitatorId, onClose }) => {
  const [hoursData, setHoursData] = useState([]);

  useState(() => {
    // Fetch hours data for the facilitator
    const fetchHoursData = async () => {
      try {
        const response = await fetch(`${config.baseURL}/levels/${facilitatorId}/hours`);
        if (!response.ok) {
          throw new Error('Failed to fetch hours data');
        }
        const data = await response.json();
        setHoursData(data);
      } catch (error) {
        console.error('Error fetching hours data:', error);
      }
    };

    fetchHoursData();
  }, [facilitatorId]);
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Hours Worked</h2>
        {hoursData.length > 0 ? (
          <table className={styles.hoursTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {hoursData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.day}</td>
                  <td>{entry.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hours data available.</p>
        )}
        <div className={styles.popupButtons}>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};