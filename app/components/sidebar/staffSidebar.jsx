"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Down and Up arrows

// Menu Items Definition
const menuItems = [
  {
    title: "Dashboard",
    path: "/pages/staff/dashboard",
    icon: <MdDashboard className={styles.whiteIcon} />,
  },
  {
    title: "Profile",
    path: "/pages/staff/dashboard/profile",
    icon: <MdPeople className={styles.whiteIcon} />,
  },
  {
    title: "Leave",
    path: "/pages/staff/dashboard/leave",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },
  {
    title: "Todos",
    path: "/pages/staff/dashboard/todos",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },
  {
    title: "Notifications",
    path: "/pages/project/dashboard",
    icon: <MdAnalytics className={styles.whiteIcon} />,
  },

];

const Sidebar = () => {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

 

  return (
      <div className={styles.containers}>
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
            const isActive = router.pathname === item.path; // Check if menu item is active

            return (
                <li key={item.title}>
                  {item.subpages ? (
                      <div
                          className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                          onClick={() => toggleMenu(item.title)}
                      >
                        <div className={styles.menuItemContent}>
                          {item.icon}
                          <span className={styles.whiteText}>{item.title}</span>
                        </div>
                        <span className={styles.toggleIcon}>
                    {openMenus[item.title] ? <FaChevronUp className={styles.whiteIcon} /> : <FaChevronDown className={styles.whiteIcon} />}
                  </span>
                      </div>
                  ) : (
                      <MenuLink
                          item={{
                            ...item,
                            className: `${styles.whiteText} ${isActive ? styles.active : ""}`,
                          }}
                      />
                  )}

                  {/* Render submenus */}
                  {openMenus[item.title] && item.subpages && (
                      <ul className={styles.submenu}>
                        {item.subpages.map((sub) => {
                          const isSubActive = router.pathname === sub.path;
                          return (
                              <li key={sub.title}>
                                <MenuLink
                                    item={{
                                      ...sub,
                                      className: `${styles.whiteText} ${isSubActive ? styles.active : ""}`,
                                    }}
                                />
                              </li>
                          );
                        })}
                      </ul>
                  )}
                </li>
            );
          })}

          {/* Conditionally Render Admin Dashboard Link */}
          {/* {user.role.toLowerCase() === "admin" && (
              <li>
                <MenuLink
                    item={{
                      title: "Admin Dashboard",
                      path: "/pages/admin/dashboard",
                      icon: <MdDashboard className={styles.whiteIcon} />,
                      className: styles.whiteText,
                    }}
                />
              </li>
          )} */}
        </ul>

        <div className={styles.down}>

        {/* Logout Button */}
        <form>
          <button className={`${styles.logout} ${styles.blackText}`}>
            <MdLogout className={styles.blackIcon} />
            Logout
          </button>
        </form>

        {/* Settings */}
        <div className={styles.settings}>
          <MdSettings className={styles.whiteIcon} />
          <span className={styles.whiteText}>Settings</span>
        </div>

        <div className={`${styles.footer} ${styles.whiteText}`}>&copy; 2025 SIEMENS ERP</div>
      </div>
      </div>
  );
};

export default Sidebar;
