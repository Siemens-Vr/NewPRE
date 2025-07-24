// AddUpdateHoursPopup.jsx
"use client";

import { useState } from "react";
import FormModal from "@/app/components/Form/FormModal";

export const AddUpdateHoursPopup = ({ facilitatorId, onClose, onSubmit }) => {
  const [entries, setEntries] = useState([{ date: "", hours: "" }]);

  const handleFieldChange = (idx, field, value) => {
    setEntries((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () =>
    setEntries((prev) => [...prev, { date: "", hours: "" }]);

  const removeRow = (idx) =>
    setEntries((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    // validate
    if (entries.some((e) => !e.date || !e.hours)) return;
    onSubmit(entries);
    onClose();
  };

  // Build fields array
  const fields = entries.flatMap((row, idx) => [
    {
      name: `date-${idx}`,
      label: "Work Date",
      type: "date",
      value: row.date,
      onChange: (v) => handleFieldChange(idx, "date", v),
    },
    {
      name: `hours-${idx}`,
      label: "Hours Worked",
      type: "number",
      value: row.hours,
      min: 0,
      step: 0.5,
      placeholder: "e.g. 7.5",
      onChange: (v) => handleFieldChange(idx, "hours", v),
    },
    {
      name: `remove-${idx}`,
      type: "custom",
      render: () =>
        entries.length > 1 && (
          <button
            type="button"
            onClick={() => removeRow(idx)}
            className="text-sm text-red-600 underline mt-1"
          >
            Remove
          </button>
        ),
    },
  ]);

  return (
    <FormModal
      title="Add / Update Work Hours"
      fields={[
        ...fields,
        {
          name: "add-more",
          type: "custom",
          render: () => (
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-blue-600 underline mb-4"
            >
              + Add Another Day
            </button>
          ),
        },
      ]}
      onSubmit={handleSubmit}
      onClose={onClose}
      initialValues={{}} // ignoring FormModal's built-in state
    />
  );
};
