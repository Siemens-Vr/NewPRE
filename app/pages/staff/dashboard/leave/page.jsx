"use client";

import { useState } from "react";
import LeaveTypes from "@/app/components/staff/leave/leaveType";
import LeaveHistory from "@/app/components/staff/leave/leaveHistory";
import ApplyLeaveModal from "@/app/components/staff/leave/applyLeave";
import styles from "@/app/styles/staff/staff.module.css"
import { useParams } from "next/navigation";

const LeavePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] =useState(false);
  const openModal = () => setIsOpen(true);
const closeModal = () => setIsOpen(false);
const params = useParams();
const { staffuuid } = params;

  return (
    <div className="p-8">
       <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.addButton}
        >
          Apply Leave
        </button>
      </div>

      {isModalOpen && (
        <ApplyLeaveModal
          staffUUID={staffuuid}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <h1 className="text-3xl font-bold color-blue"> Type of Leaves</h1>
      <LeaveTypes />
      {/* <LeaveHistory /> */}
      
      {/* <ApplyLeaveModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default LeavePage;
