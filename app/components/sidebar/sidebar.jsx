"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

import styles from "@/app/styles/sidebar/sidebar.module.css";
import logo from "@/app/styles/Pictures/Virtual Mechatronics Lab Logo V2-01.png";
import {
   MdDashboard,
  MdAnalytics,
  MdPeople,
  MdLogout,
  MdSettings,
  MdBusiness,
  MdInventory,
  MdAssignment,
  MdNotifications,
  MdPerson,
  MdGroup,
  MdSchool
} from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  // Define menu items based on user role
  const getMenuItems = (userRole) => {
    const role = userRole?.toLowerCase();

    switch (role) {
      case 'admin':
        return [
          {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <MdDashboard className={styles.whiteIcon} />,
          },
          {
            title: "Staffs",
            path: "/admin/staff",
            icon: <MdPeople className={styles.whiteIcon} />,
          },
          {
            title: "Student",
            icon: <MdSchool className={styles.whiteIcon} />,
            subpages: [
              { title: "Cohorts", path: "/students/cohorts", icon: <MdGroup className={styles.whiteIcon} /> },
              { title: "Students", path: "/students/students", icon: <MdPeople className={styles.whiteIcon} /> },
              { title: "Instructors", path: "/students/facilitators", icon: <MdPerson className={styles.whiteIcon} /> },
            ],
          },
          {
            title: "Equipment",
            icon: <MdInventory className={styles.whiteIcon} />,
            subpages: [
              { title: "Products", path: "/equipments/components", icon: <MdInventory className={styles.whiteIcon} /> },
              { title: "Borrow", path: "/equipments/borrow", icon: <MdAssignment className={styles.whiteIcon} /> },
              { title: "Notifications", path: "/equipments/notifications", icon: <MdNotifications className={styles.whiteIcon} /> },
            ],
          },
          {
            title: "Projects",
            path: "/projects",
            icon: <MdBusiness className={styles.whiteIcon} />,
          },
          {
            title: "Users",
            path: "/admins/users",
            icon: <MdAnalytics className={styles.whiteIcon} />,
          },
        ];

      case 'equipment':
        return [
          {
            title: "Dashboard",
            path: "/equipment/dashboard",
            icon: <MdDashboard className={styles.whiteIcon} />,
          },
          {
            title: "Products",
            path: "/equipments/components",
            icon: <MdInventory className={styles.whiteIcon} />,
          },
          {
            title: "Borrowing",
            icon: <MdAssignment className={styles.whiteIcon} />,
            path: "/equipments/borrow",

          },
          {
            title: "Notifications",
            path: "/equipments/notifications",
            icon: <MdSettings className={styles.whiteIcon} />,
          },
        ];

      case 'staff':
        return [
          {
            title: "Dashboard",
            path: "/staff/",
            icon: <MdDashboard className={styles.whiteIcon} />,
          },
          {
            title: "Todo",
            path: "/staff/projects",
            icon: <MdBusiness className={styles.whiteIcon} />,
          },
          {
            title: "Equipment",
            icon: <MdInventory className={styles.whiteIcon} />,
            subpages: [
              { title: "Browse", path: "/employee/equipment/browse", icon: <MdInventory className={styles.whiteIcon} /> },
              { title: "My Requests", path: "/employee/equipment/requests", icon: <MdAssignment className={styles.whiteIcon} /> },
            ],
          },
        ];


      case 'user':
      default:
        return [
          {
            title: "Dashboard",
            path: "/user/dashboard",
            icon: <MdDashboard className={styles.whiteIcon} />,
          },
          {
            title: "My Profile",
            path: "/user/profile",
            icon: <MdPerson className={styles.whiteIcon} />,
          },
        ];
    }
  };

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  // Show loading or fallback if no user
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.user}>
          <Image
            className={styles.userImage}
            src={logo}
            alt="Virtual Mechatronics Lab Logo"
            width={60}
            height={60}
          />
        </div>
        <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      </div>
    );
  }

  // Use fallback user or actual user from context
  const currentUser = user || {
    username: "cheldean",
    role: "Admin",
  };

  // Get menu items based on user role
  const menuItems = getMenuItems(currentUser.role);

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

      <div className={styles.down}>
        {/* Logout button */}
        <div 
          className={`${styles.menuItem}`}
          onClick={handleLogout}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          <div className="flex items-center justify-center gap-2">
            <MdLogout className={styles.whiteIcon} />
            <span className={styles.whiteText}>Logout</span>
          </div>
        </div>

        <div className={`${styles.footer} ${styles.whiteTexts}`}>&copy; 2025 SIEMENS ERP</div>
      </div>
    </div>
  );
};

export default Sidebar;