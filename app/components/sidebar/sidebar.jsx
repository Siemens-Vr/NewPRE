"use client";

import React, { useState } from "react";
import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "@/app/styles/sidebar/sidebar.module.css";
import logo from "@/app/styles/Pictures/Virtual Mechatronics Lab Logo V2-01.png";
import {
  MdDashboard,
  MdAnalytics,
  MdPeople,
  MdLogout,
} from "react-icons/md";

// Menu Items Definition
const menuItems = [
  {
    title: "Dashboard",
    path: "/pages/admin/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Staff",
    path: "/pages/admin/dashboard/staff",
    icon: <MdPeople />,
  },
  {
    title: "Student",
    icon: <MdAnalytics />,
    subpages: [
      { title: "Cohorts", path: "/pages/student/dashboard/cohorts", icon: <MdAnalytics /> },
      { title: "Instructors", path: "/pages/student/dashboard/facilitators", icon: <MdAnalytics /> },
    ],
  },
  {
    title: "Equipment",
    icon: <MdAnalytics />,
    subpages: [
      { title: "Products", path: "/pages/equipment/dashboard/components", icon: <MdDashboard /> },
      { title: "Borrow Equipment", path: "/pages/equipment/dashboard/borrow", icon: <MdPeople /> },
      { title: "Notifications", path: "/pages/equipment/dashboard/notifications", icon: <MdPeople /> },
    ],
  },
  {
    title: "Projects",
    path: "/pages/project/dashboard/dashboard",
    icon: <MdAnalytics/>
  },
  {
    title: "Users",
    path:"/pages/dashboard/users",
  icon: <MdAnalytics />
  },
];

const Sidebar = () => {
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
          <div className={styles.userDetail}>
            <span className={styles.username}>{user.username.toUpperCase()}</span>
            <span className={styles.userTitle}>{user.role.toUpperCase()}</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <ul className={styles.list}>
          {menuItems.map((item) => (
              <li key={item.title}>
                {/* Ensure ALL items use MenuLink for navigation */}
                {item.path ? (
                    <MenuLink item={item} />
                ) : (
                    <div className={styles.menuItem} onClick={() => toggleMenu(item.title)}>
                      {item.icon} {item.title}
                      {item.subpages?.length > 0 && (
                          <span className={styles.toggleIcon}>{openMenus[item.title] ? "➖" : "➕"}</span>
                      )}
                    </div>
                )}

                {/* Render submenus for expandable sections */}
                {openMenus[item.title] && item.subpages?.length > 0 && (
                    <ul className={styles.submenu}>
                      {item.subpages.map((sub) => (
                          <li key={sub.title}>
                            <MenuLink item={sub} />
                          </li>
                      ))}
                    </ul>
                )}
              </li>
          ))}

          {/* Conditionally Render Admin Dashboard Link */}
          {user.role.toLowerCase() === "admin" && (
              <li>
                <MenuLink
                    item={{
                      title: "Admin Dashboard",
                      path: "/pages/admin/dashboard",
                      icon: <MdDashboard />,
                    }}
                />
              </li>
          )}
        </ul>

        {/* Logout Button */}
        <form>
          <button className={styles.logout}>
            <MdLogout />
            Logout
          </button>
        </form>
      </div>
  );
};

export default Sidebar;
