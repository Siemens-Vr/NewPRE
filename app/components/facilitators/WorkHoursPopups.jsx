"use client";

import { useState, useEffect } from 'react';
import FormModal from '@/app/components/Form/FormModal';
import api from '@/app/lib/utils/axios';

// Add or Update Hours Popup
export const AddUpdateHoursPopup = ({ facilitatorId, onClose, onSubmit }) => {
  const [entries, setEntries] = useState([
    { date: '', hours: '' }
  ]);

  const handleFieldChange = (idx, field, value) => {
    setEntries(prev =>
      prev.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () =>
    setEntries(prev => [...prev, { date: '', hours: '' }]);

  const removeRow = idx =>
    setEntries(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    // Optionally validate here (e.g. all dates filled, hours ≥ 0)
    onSubmit(entries);
    onClose();
  };

  // Build the fields array for FormModal
  const fields = entries.flatMap((row, idx) => [
    {
      name: `date-${idx}`,
      label: 'Work Date',
      type: 'date',
      value: row.date,
      onChange: v => handleFieldChange(idx, 'date', v),
    },
    {
      name: `hours-${idx}`,
      label: 'Hours Worked',
      type: 'number',
      value: row.hours,
      min: 0,
      step: 0.5,
      placeholder: 'e.g. 7.5',
      onChange: v => handleFieldChange(idx, 'hours', v),
    },
    {
      name: `remove-${idx}`,
      type: 'custom',
      render: () =>
        entries.length > 1 && (
          <button
            type="button"
            onClick={() => removeRow(idx)}
            className="text-sm text-red-600 underline mt-1"
          >
            Remove
          </button>
        )
    }
  ]);

  return (
    <FormModal
      title="Add / Update Work Hours"
      fields={[
        ...fields,
        {
          name: 'add-more',
          type: 'custom',
          render: () => (
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-blue-600 underline mb-4"
            >
              + Add Another Day
            </button>
          )
        }
      ]}
      onSubmit={handleSubmit}
      onClose={onClose}
      initialValues={{}}  // we're controlling via local state
    />
  );
};


// View Hours Popup (readonly)
export const ViewHoursPopup = ({ facilitatorId, onClose }) => {
  const [hoursData, setHoursData] = useState([]);

// inside ViewHoursPopup…
useEffect(() => {
  const load = async () => {
    try {
      const { data } = await api.get(`/levels/${facilitatorId}/hours`);
      setHoursData(data);
    } catch (err) {
      console.error("Failed to load hours:", err);
    }
  };
  load();
}, [facilitatorId]);

  return (
    <FormModal
      title="Hours Worked"
      onClose={onClose}
      fields={[
        {
          name: "readonlyTable",
          type: "custom",
          render: () => (
            hoursData.length > 0 ? (
              <table className="w-full border text-sm mt-2">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {hoursData.map((entry, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{entry.day}</td>
                      <td className="p-2 border">{entry.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 mt-2">No hours data available.</p>
            )
          )
        }
      ]}
      onSubmit={() => onClose()}
    />
  );
};
