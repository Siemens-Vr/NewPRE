// ViewHoursPopup.jsx
"use client";

import { useState, useEffect } from "react";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";

export const ViewHoursPopup = ({ facilitatorId, onClose }) => {
  const [hoursData, setHoursData] = useState([]);

  useEffect(() => {
    api
      .get(`/levels/${facilitatorId}/hours`)
      .then((res) => setHoursData(res.data))
      .catch((err) => console.error("Failed to load hours:", err));
  }, [facilitatorId]);

  return (
    <FormModal
      title="Hours Worked"
      onClose={onClose}
      fields={[
        {
          name: "readonlyTable",
          type: "custom",
          render: () =>
            hoursData.length > 0 ? (
              <table className="w-full border text-sm mt-2">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {hoursData.map((entry, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{entry.day}</td>
                      <td className="p-2 border">{entry.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 mt-2">No hours data available.</p>
            ),
        },
      ]}
      // no real "submit", just close
      onSubmit={onClose}
    />
  );
};
