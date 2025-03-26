import { useEffect, useState } from "react";
import { config } from "@/config";
import styles from "@/app/styles/staff/staff.module.css"

const LeaveHistory = () => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
  
    useEffect(() => {
        const fetchLeaveHistory = async () => {
          try {
            const response = await fetch(`${config.baseURL}/leaves`);
            const data = await response.json();
            console.log("Leave history:", data);
          } catch (error) {
            console.error("Error fetching leave history:", error);
          }
        };
    
        fetchLeaveHistory();
    }, []);
    

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold"> Your Leave History</h2>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className={styles.tables}>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Start Date</th>
            <th className="p-3 text-left">End Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((leave) => (
              <tr key={leave.id} className="border-t">
                <td className="p-3">{leave.type}</td>
                <td className="p-3">{leave.startDate}</td>
                <td className="p-3">{leave.endDate}</td>
                <td className={`p-3 font-semibold ${leave.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                  {leave.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">No leave history available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
