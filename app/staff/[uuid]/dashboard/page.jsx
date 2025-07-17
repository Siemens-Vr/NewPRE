"use client";

import styles from "@/app/styles/staff/staff.module.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { Activity, Users, ClipboardList, FileText, Box } from "lucide-react";

import StaffComponents from "@/app/components/staff/staffComponents";

import Link from "next/link";
import { useParams } from "react-router-dom";

const Card = ({ children, className }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeStaff: 0, pendingRequests: 0 });
  const params = useParams()
  const {uuid} = params

  useEffect(() => {
    setStats({ totalUsers: 150, activeStaff: 75, pendingRequests: 5 });
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Staff Information, Notifications & To-do */}
      <div>
        <StaffComponents />
      </div>

      {/* Quick Links Section */}
      <div className={styles.quickActions}>
        <Link href={`/staffs/${uuid}/dashboard/projects`} className={styles.quickLink}>
          <Activity size={20} />
          <span> Your Projects</span>
        </Link>

        <Link href="/documentation" className={styles.quickLink}>
          <FileText size={20} />
          <span>Documentation</span>
        </Link>

        <Link href="/equipments" className={styles.quickLink}>
          <Box size={20} />
          <span>YourEquipments</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
