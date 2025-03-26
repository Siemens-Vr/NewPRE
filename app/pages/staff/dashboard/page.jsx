'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Activity, Users, ClipboardList } from "lucide-react";
import StaffComponents from "@/app/components/staff/staffComponents";

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeStaff: 0, pendingRequests: 0 });
  const [activityLogs, setActivityLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch statistics, logs, and chart data from API (dummy data for now)
    setStats({ totalUsers: 150, activeStaff: 75, pendingRequests: 5 });
    
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* Staff Information, Notifications & To-do */}
      <div>
        <StaffComponents />
      </div>
      
      {/* Quick Actions */}
      <div className="flex space-x-4">
       
      </div>
    </div>
  );
};

export default Dashboard;