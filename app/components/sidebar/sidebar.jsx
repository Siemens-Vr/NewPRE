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
    path: "/admins",
    icon: <MdDashboard className={styles.whiteIcon} />,
  },
  {
    title: "Staff",
    path: "/admin/staffs",
    icon: <MdPeople className={styles.whiteIcon} />,
  },
  {
    title: "Student",
    // path: "/student/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
    subpages: [
      { title: "Dashboard", path: "/students", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Students", path: "/students/students", icon: <MdPeople className={styles.whiteIcon} /> },
      { title: "Cohorts", path: "/students/cohorts", icon: <MdAnalytics className={styles.whiteIcon} /> },
      { title: "Instructors", path: "/students/facilitators", icon: <MdAnalytics className={styles.whiteIcon} /> },
    ],
  },
  {
    title: "Equipment",
    // path: "/equipment/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
    subpages: [
      { title: "Dashboard", path: "/equipments", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Products", path: "/equipments/components", icon: <MdDashboard className={styles.whiteIcon} /> },
      { title: "Borrow", path: "/equipments/borrow", icon: <MdPeople className={styles.whiteIcon} /> },
      { title: "Notifications", path: "/equipments/notifications", icon: <MdPeople className={styles.whiteIcon} /> },
    ],
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },
  {
    title: "Users",
    path: "/admin/users",
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
