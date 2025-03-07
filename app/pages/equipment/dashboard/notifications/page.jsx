"use client";
import React, { useEffect, useState } from 'react';
import styles from  '@/app/styles/notifications/notifications.module.css'
import Search from '@/app/components/search/search'

import { config } from '/config';


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${config.baseURL}/notifications`);
        if (response.ok) {
          const data = await response.json();
          const formattedNotifications = data.rows.map(notification => ({
            ...notification,
            createdAt: new Date(notification.createdAt), // Convert createdAt to Date object
          }));
          setNotifications(formattedNotifications); // Set notifications state with fetched data
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('An error occurred when fetching notifications:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator if data is being fetched
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search in " />
      </div>
      <div className={styles.notificationsList}>
        {notifications.map(notification => (
         
          <div key={notification.id} className={styles.notificationItem}>
            <div className={styles.notificationHeader}>
              <div className={styles.header}>
                <input type="checkbox" id="tealing"/>
                <p className={styles.notificationContent}>{notification.message}</p>
              </div>
              
              <div className={styles.dateTime}>
                <span className={styles.notificationDate}>
                  {new Date(notification.createdAt).toLocaleDateString()} 
                </span>
                <span className={styles.notificationDate}> 
                {new Date(notification.createdAt).toLocaleTimeString()}
              </span>

              </div>
              
            </div>
            <div className={styles.notificationContent}>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
