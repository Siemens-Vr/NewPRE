import { Bell, ClipboardList, User, Calendar as CalendarIcon  } from "lucide-react";
import styles from "@/app/styles/staff/staffComponent.module.css";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import { useSearchParams } from 'next/navigation';
import { config } from "@/config";

const Card = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

const StaffCard = () => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    
    useEffect(() => {
        const fetchStaff = async () => {
          setLoading(true);
          try {
            const response = await fetch(`${config.baseURL}/staffs${q ? `?q=${q}` : ''}`);
            const data = await response.json();
            console.log(data)
            setStaff(data);
          } catch (error) {
            console.error('Error fetching staff:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchStaff();
      }, [q])
  
    if (!staff) return <p>Loading...</p>;
  
    return (
      <div className={styles.staffCard}>
        <User className="text-blue-500" size={64} />
        <div>
          <h3 className="text-2xl font-semibold">Staff Information</h3>
          <p className="text-lg text-gray-600"><strong>Name:</strong> {staff.fullName}</p>
          <p className="text-lg text-gray-600"><strong>Email:</strong> {staff.email}</p>
          <p className="text-lg text-gray-600"><strong>ID Number:</strong> {staff.idNumber}</p>
          <p className="text-lg text-gray-600"><strong>Gender:</strong> {staff.gender}</p>
          <p className="text-lg text-gray-600"><strong>Phone:</strong> {staff.phoneNumber}</p>
        </div>
      </div>
    );
  };
  
const CalendarCard = () => {
    const [date, setDate] = useState(new Date());
  
    return (
      <div className={styles.card}>
        {/* <CalendarIcon className="text-red-500" size={64} /> */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold mb-2">Calendar</h3>
          <Calendar onChange={setDate} value={date} className="w-full" />
        </div>
      </div>
    );
  };
  const NotificationCard = () => {
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/notifications")
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error("Error fetching notifications:", err));
    }, []);
  
    return (
      <div className={styles.notificationCard}>
        <Bell className="text-yellow-500" size={64} />
        <div>
          <h3 className="text-2xl font-semibold">Notifications</h3>
          <ul className="text-lg text-gray-600">
            {notifications.length > 0 ? (
              notifications.map((note, index) => <li key={index}>{note}</li>)
            ) : (
              <li>No notifications available</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

const TodoCard = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  return (
    <div className={styles.todoCard}>
      <ClipboardList className="text-green-500" size={64} />
      <div>
        <h3 className="text-2xl font-semibold">To-Do List</h3>
        <ul className="text-lg text-gray-600">
          {todos.length > 0 ? (
            todos.map((todo, index) => <li key={index}>{todo}</li>)
          ) : (
            <li>No tasks available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const StaffComponents = () => (
  <div className={styles.container}>
    <StaffCard />
    <CalendarCard />
    <NotificationCard />
    <TodoCard />
  </div>
);

export default StaffComponents;
