"use client";

import { useState, useContext } from "react";
import LeaveTypes from "@/app/components/staff/leave/leaveType";
import ApplyLeaveModal from "@/app/components/staff/leave/applyLeave";
import styles from "@/app/styles/staff/leave/leave.module.css";
import { AuthContext } from "@/app/context/AuthContext";
import LeaveHistory from "@/app/components/staff/leave/leaveHistory";

const LeavePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const context = useContext(AuthContext);
 const staffuuid = context?.user?.uuid;

  return (
    <div className={`${styles.pageContainer} ${isModalOpen ? styles.blurred : ""}`}>
      <div className="flex justify-end">
        <button onClick={() => setIsModalOpen(true)} className={styles.applyButton}>
          Apply Leave
        </button>
      </div>

      {isModalOpen && (
        <ApplyLeaveModal staffUUID={staffuuid} onClose={() => setIsModalOpen(false)} />
      )}

      <h1 className="text-3xl font-bold color-blue">Type of Leaves</h1>
      <LeaveTypes />
      <LeaveHistory staffUUID={staffuuid} />
    </div>
  );
};

export default LeavePage;
