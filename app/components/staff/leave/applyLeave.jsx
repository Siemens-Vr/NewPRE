import { useState, useEffect } from "react";
import { config } from "@/config";
import { toast } from "react-toastify";
import styles from "@/app/styles/staff/leave/leave.module.css";

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
    <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
      {/* Close (X) Button */}
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
  
      <h2 className={styles.modalHeader}>Apply for Leave</h2>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div>
          <label className={styles.modalLabel}>Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className={styles.modalSelect}
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
  
        <div>
          <label className={styles.modalLabel}>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className={styles.modalInput}
          />
        </div>
  
        <div>
          <label className={styles.modalLabel}>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className={styles.modalInput}
          />
        </div>
  
        <div>
          <label className={styles.modalLabel}>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className={styles.modalTextarea}
            placeholder="Enter reason for leave"
          />
        </div>
  
        <div className={styles.modalButtons}>
          <button type="submit" className={styles.applyButton}>
            Apply
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default ApplyLeaveModal;
