import { useState, useEffect } from "react";
import { config } from "@/config";
import { toast } from "react-toastify";
import styles from "@/app/styles/staff/staff.module.css"

const ApplyLeaveModal = ({ staffUUID, onClose }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
  });

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);


  // Fetch leave types when the modal opens
  useEffect(() => {
    const fetchLeaveType = async () => {
      setLoading(true);
      console.log("Fetching leave types...");
      try {
        const response = await fetch(`${config.baseURL}/leaves`);
        const data = await response.json();
        console.log("Data Received:", data);
        setLeaveTypes(data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveType();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Leave Application:", { ...formData, staffUUID });
  
    // Find the corresponding leaveId based on selected leaveType
    const selectedLeave = leaveTypes.find((type) => type.name === formData.leaveType);
    if (!selectedLeave) {
      toast.error("Invalid leave type selected.");
      return;
    }
  
    const leaveData = {
      userId: staffUUID, // Backend expects userId, not staffUUID
      leaveId: selectedLeave.id, // Map leaveType to leaveId
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason, // Ensure reason is provided
    };
  
    try {
      const response = await fetch(`${config.baseURL}/leaveRequests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Leave application submitted successfully!");
        setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
        onClose(); // Close modal after success
      } else {
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach((err) => toast.error(err));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal on outside click
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-lg font-semibold mb-4">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Leave Type Dropdown */}
          <div>
            <label className="block text-sm font-medium">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Leave Type</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                leaveTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          {/* Reason */}
          {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Enter reason for leave"
              />
            </div>


          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={styles.addButton}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
