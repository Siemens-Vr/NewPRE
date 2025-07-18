"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import styles from "@/app/styles/sidebar/sidebar.module.css";
import logo from "@/app/styles/Pictures/Virtual Mechatronics Lab Logo V2-01.png";
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdLogout,
  MdSettings,
} from "react-icons/md";
import { AuthContext } from "@/app/context/AuthContext";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const [activeUuid, setActiveUuid] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Extract UUID from the current pathname
    const pathSegments = pathname.split('/');
    const uuidIndex = pathSegments.indexOf('staff') + 1;
    
    if (uuidIndex > 0 && uuidIndex < pathSegments.length) {
      const pathUuid = pathSegments[uuidIndex];
      setActiveUuid(pathUuid);
      
      // Check if admin is viewing another user's profile
      if (user && pathUuid !== user.uuid) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    } else {
      // If no UUID in path, default to logged-in user
      setActiveUuid(user?.uuid);
      setIsAdminView(false);
    }
  }, [pathname, user]);

  if (!user) return null; // or a loader/spinner
  if (!activeUuid) return null; // don't render until we have a UUID

  // Menu Items using the activeUuid (either from path or logged-in user)
  const menuItems = [
    {
      title: "Dashboard",
      path: `/staff/${activeUuid}/dashboard`,
      icon: <MdDashboard className={styles.whiteIcon} />,
    },
    {
      title: "Profile",
      path: `/staff/${activeUuid}/dashboard/profile`,
      icon: <MdPeople className={styles.whiteIcon} />,
    },
    {
      title: "Leave",
      path: `/staff/${activeUuid}/dashboard/leave`,
      icon: <MdAnalytics className={styles.whiteIcon} />,
    },
    {
      title: "Todos",
      path: `/staff/${activeUuid}/dashboard/todos`,
      icon: <MdAnalytics className={styles.whiteIcon} />,
    },
    {
      title: "Notifications",
      path: `/staff/${activeUuid}/dashboard/notifications`,
      icon: <MdAnalytics className={styles.whiteIcon} />,
    },
  ];
console.log(activeUuid)
  return (
    <div className={styles.container}>
      {/* User Info */}
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={logo}
          alt="Virtual Mechatronics Lab Logo"
          width={60}
          height={60}
        />
        {isAdminView && (
          <div className={styles.adminBadge}>
            Admin View
            <button 
              className={styles.returnButton}
              onClick={() => router.push(`/pages/staff/${user.uuid}/dashboard`)}
            >
              Return to My Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Menu */}
      <ul className={styles.list}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.title}>
              <div
                className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                onClick={() => router.push(item.path)}
              >
                <div className={styles.menuItemContent}>
                  <div className="flex items-center text-black justify-center gap-2">
                    {item.icon}
                    <span className={styles.whiteText}>{item.title}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.down}>
        {/* Show Return to Admin Dashboard button when viewing another user */}
        {isAdminView && (
          <button
            type="button"
            onClick={() => router.push('/pages/admin/dashboard/staff')}
            className={`${styles.adminReturn}`}
          >
            Return to Staff List
          </button>
        )}
        
        {/* Logout Button - only show if viewing own dashboard */}
        {!isAdminView && (
          <form>
            <button
              type="button"
              onClick={logout}
              className={`${styles.logout} ${styles.blackText}`}
            >
              <MdLogout className={styles.blackIcon} />
              Logout
            </button>
          </form>
        )}

        {/* Settings */}
        <div className={styles.settings}>
          <MdSettings className={styles.whiteIcon} />
          <span className={styles.whiteText}>Settings</span>
        </div>

        <div className={`${styles.footer} ${styles.whiteText}`}>
          &copy; 2025 SIEMENS ERP
        </div>
      </div>
    </div>
  );
};

export default Sidebar;