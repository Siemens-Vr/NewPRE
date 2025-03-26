import { useEffect, useState } from "react";
import { config } from "@/config";
import styles from "@/app/styles/staff/leave/leave.module.css";

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = ["#c6e7e7", "#ff7211", "#c6e7e7", "#ff7211"];
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

  return (
    <div className={styles.leaveContainer}>
    {leaveTypes.length > 0 ? (
      leaveTypes.map((leaves, index) => (
        <div
          key={leaves.id}
          className={styles.leaveCard}
          style={{ backgroundColor: colors[index % colors.length] }} 
        >
          <h3 className={styles.leaveTitle}>{leaves.name}</h3>
          <p className={styles.leaveDescription}>{leaves.description}</p>
          <p className={styles.leaveDays}>Days: {leaves.days}</p>
        </div>
      ))
    ) : (
      <p className={styles.loadingText}>Loading leave types...</p>
    )}
  </div>
  );
};

export default LeaveTypes;
