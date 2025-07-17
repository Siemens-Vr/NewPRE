"use client";

import { Bell, ClipboardList, User, Calendar as CalendarIcon, FolderKanban, Package } from "lucide-react";
import styles from "@/app/styles/staff/staffComponent.module.css";
import React, { useState, useEffect} from "react";
import { useParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import api, { setAccessToken } from "@/app/lib/utils/axios";
import { config } from "@/config";

const Card = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

const StaffCard = () => {
  const params = useParams()
  const uuid = params?.uuid;
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);

 
  // console.log(uuid)



  useEffect(() => {
    const fetchStaff = async () => {
      if (!uuid) return; // Don't fetch if UUID is missing

      setLoading(true);
      try {
        const response = await api.get(`/staffs/${uuid}`);
        const data = response.data
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [uuid]);

  if (loading) return <p>Loading...</p>;
  if (!staff) return <p>No staff found.</p>;

  return (
    <div className={styles.staffCard}>
      <User className="text-blue-500" size={64} />
      <div>
        <h3 className="text-2xl font-semibold">Staff Information</h3>
        <p className="text-lg text-gray-600">
          <strong>Name:</strong> {staff.fullName}
        </p>
        <p className="text-lg text-gray-600">
          <strong>Email:</strong> {staff.email}
        </p>
        <p className="text-lg text-gray-600">
          <strong>ID Number:</strong> {staff.idNumber}
        </p>
        <p className="text-lg text-gray-600">
          <strong>Gender:</strong> {staff.gender}
        </p>
        <p className="text-lg text-gray-600">
          <strong>Phone:</strong> {staff.phoneNumber}
        </p>
      </div>
    </div>
  );
};
  
  const CalendarCard = () => {
    const [date, setDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState({}); // Store dates & descriptions
    const [description, setDescription] = useState("");
  
    const handleDateClick = (selectedDate) => {
      const formattedDate = selectedDate.toDateString();
  
      if (markedDates[formattedDate]) {
        // If the date is already marked, remove it
        const updatedDates = { ...markedDates };
        delete updatedDates[formattedDate];
        setMarkedDates(updatedDates);
      } else {
        // Prompt for description
        const desc = prompt("Enter a description for this date:");
        if (desc) {
          setMarkedDates((prevDates) => ({ ...prevDates, [formattedDate]: desc }));
        }
      }
    };
  
    const tileClassName = ({ date }) => {
      return markedDates[date.toDateString()] ? styles.highlightedDate : "";
    };
  
    return (
      <div className={styles.calendarCard}>
        <h3 className={styles.calendarTitle}>Calendar</h3>
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
        />
        <div className={styles.markedDates}>
          <h4 className="text-white">Marked Dates:</h4>
          <ul className={styles.markedDateList}>
            {Object.keys(markedDates).length > 0 ? (
              Object.entries(markedDates).map(([date, desc], index) => (
                <li key={index} className={styles.markedDateItem}>
                  <strong>{date}:</strong> {desc}
                </li>
              ))
            ) : (
              <li>No important dates marked.</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const NotificationCard = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchNotification = async () => {
        setLoading(true);
        // console.log("Fetching notifications...");
        try {
          const response = await fetch(`${config.baseURL}/notifications`);
          const data = await response.json();
          // console.log("Data Received:", data);
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notification:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNotification();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      // console.log("Fetching leave types...");
      try {
        const response = await fetch(`${config.baseURL}/todos`);
        const data = await response.json();
        // console.log("Data Received:", data);
        setTodos(data);
      } catch (error) {
        console.error("Error fetching to-dos list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className={styles.notificationCard}>
      <ClipboardList className="text-yellow-500" size={64} />
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

const ProjectCard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      // console.log("Fetching projects...");
      // try {
      //   const response = await fetch(`${config.baseURL}/projects`);
      //   const data = await response.json();
      //   console.log("Data Received:", data);
      //   setProjects(data);
      // } catch (error) {
      //   console.error("Error fetching projects:", error);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchProject();
  }, []);

  return (
    <div className={styles.staffCard}>
      <FolderKanban className="text-blue-500" size={64} />
      <div>
        <h3 className="text-2xl font-semibold">Your project</h3>
        <ul className="text-lg text-gray-600">
          {projects.length > 0 ? (
            projects.map((project, index) => <li key={index}>{project}</li>
          )
            
          ) : (
            
            <li>No Projects available</li>
          )}
        </ul>
      </div>
    </div>
  );
};


const EquipmentCard = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      console.log("Fetching equipments...");
      try {
        const response = await fetch(`${config.baseURL}/equipments`);
        const data = await response.json();
        console.log("Data Received:", data);
        setEquipments(data);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <div className={styles.todoCard}>
      <Package className="text-green-500" size={64} />
      <div>
        <h3 className="text-2xl font-semibold">Your Set-Up List</h3>
        <ul className="text-lg text-gray-600">
          {equipments.length > 0 ? (
            equipments.map((equipment, index) => <li key={index}>{equipment}</li>)
          ) : (
            <li>No Equipment available</li>
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
    <ProjectCard />
    <EquipmentCard />
    
  </div>
);

export default StaffComponents;
