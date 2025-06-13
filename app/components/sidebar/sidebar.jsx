"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "@/app/styles/sidebar/sidebar.module.css";
import logo from "@/app/styles/Pictures/Virtual Mechatronics Lab Logo V2-01.png";
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdLogout,
  MdSettings
} from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const menuItems = [
  {
    title: "Dashboard",
    path: "/pages/admin/dashboard",
    icon: <MdDashboard className={styles.whiteIcon} />,
  },
  {
    title: "Staff",
    path: "/pages/admin/dashboard/staff",
    icon: <MdPeople className={styles.whiteIcon} />,
  },
  {
    title: "Student",
    path: "/pages/student/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
    subpages: [
      { title: "Dashboard", path: "/pages/student/dashboard", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Students", path: "/pages/student/dashboard/students", icon: <MdPeople className={styles.whiteIcon} /> },
      { title: "Cohorts", path: "/pages/student/dashboard/cohorts", icon: <MdAnalytics className={styles.whiteIcon} /> },
      { title: "Instructors", path: "/pages/student/dashboard/facilitators", icon: <MdAnalytics className={styles.whiteIcon} /> },
    ],
  },
  {
    title: "Equipment",
    path: "/pages/equipment/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
    subpages: [
      { title: "Dashboard", path: "/pages/equipment/dashboard", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Products", path: "/pages/equipment/dashboard/components", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Borrow", path: "/pages/equipment/dashboard/borrow", icon: <MdPeople className={styles.whiteIcon} /> },
      { title: "Notifications", path: "/pages/equipment/dashboard/notifications", icon: <MdPeople className={styles.whiteIcon} /> },
    ],
  },
  {
    title: "Projects",
    path: "/pages/project/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },
  {
    title: "Users",
    path: "/pages/admin/dashboard/users",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const user = {
    username: "cheldean",
    role: "Admin",
  };

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
      </div>

      {/* Sidebar Menu */}
      <ul className={styles.list}>
  {menuItems.map((item) => {
    const isActive = pathname === item.path;

    return (
      <li key={item.title}>
        <div
          className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
          onClick={() => !item.subpages && router.push(item.path)}
        >
          <div className={styles.menuItemContent}>
            <div className="flex items-center justify-center gap-2">
              {item.icon}
              <span className={styles.whiteText}>{item.title}</span>
            </div>
          </div>
        </div>

        {/* Always show subpages if they exist */}
        {item.subpages && (
          <ul className={styles.submenu}>
            {item.subpages.map((sub) => {
              const isSubActive = pathname === sub.path;
              return (
                <li key={sub.title}>
                  <div
                    className={`${styles.submenuItem} ${isSubActive ? styles.active : ""}`}
                    onClick={() => router.push(sub.path)}
                    style={{ cursor: "pointer", padding: "8px" }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {sub.icon}
                      <span className={styles.whiteText}>{sub.title}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  })}
</ul>

      {/* <ul className={styles.list}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.title}>
              <div
                className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                onClick={() => item.subpages ? toggleMenu(item.title) : router.push(item.path)}
              >
                <div className={styles.menuItemContent}>
                  <div className="flex items-center justify-center gap-2">
                  {item.icon}
                  <span className={styles.whiteText}>{item.title}</span>
                  </div>
               <div>
               {item.subpages && (
                    openMenus[item.title] ? <FaChevronUp className={styles.arrow} /> : <FaChevronDown className={styles.arrow} />
                  )}
               </div>
                 
                </div>
              </div>

              {openMenus[item.title] && item.subpages && (
                <ul className={styles.submenu}>
                  {item.subpages.map((sub) => {
                    const isSubActive = pathname === sub.path;
                    return (
                      <li key={sub.title}>
                        <div
                          className={`${styles.submenuItem} ${isSubActive ? styles.active : ""}`}
                          onClick={() => router.push(sub.path)}
                          style={{ cursor: "pointer", padding: "8px " }}
                          >
                          <div className="flex items-center justify-center gap-2">
                            
                          {sub.icon}
                          <span className={styles.whiteText}>{sub.title}</span>
                          </div>
                          </div>

                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul> */}

      <div className={styles.down}>
       

        <div className={`${styles.footer} ${styles.whiteTexts}`}>&copy; 2025 SIEMENS ERP</div>
      </div>
    </div>
  );
};

export default Sidebar;
