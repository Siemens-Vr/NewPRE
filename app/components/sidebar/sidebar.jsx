import React from 'react';
import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from '@/app/styles/sidebar/sidebar.module.css';
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
// import { auth, signOut } from "/app/auth";


const adminMenuItems = [
  {
    title: "Pages",
    list: [
      { title: "Dashboard", path: "/pages/admin/dashboard", icon: <MdDashboard /> },
      { title: "Staff", path: "/pages/admin/dashboard/staff", icon: <MdPeople /> },
      // { title: "Procurement", path: "/pages/admin/dashboard/suppliers", icon: <MdAnalytics /> },
      { title: "Student", path: "/pages/student/dashboard", icon: <MdAnalytics /> },
      { title: "Equipment", path: "/pages/equipment/dashboard", icon: <MdAnalytics /> },
      { title: "Projects", path: "/pages/project/dashboard", icon: <MdAnalytics /> },
      { title: "Users", path: "/pages/admin/dashboard/users", icon: <MdAnalytics /> },
    ],
  },
  {
    title: "User",
    list: [
      // Add more user-specific links if needed
    ],
  },
];

// Define both sets of menu items for different dashboards
const studentMenuItems = [
  {
    title: "Pages",
    list: [
      { title: "Dashboard", path: "/pages/student/dashboard", icon: <MdDashboard /> },
      { title: "Students", path: "/pages/student/dashboard/students", icon: <MdPeople /> },
      { title: "Cohorts", path: "/pages/student/dashboard/cohorts", icon: <MdAnalytics /> },
      { title: "Instructors", path: "/pages/student/dashboard/facilitators", icon: <MdAnalytics /> },
    ],
  },
  {
    title: "User",
    list: [
      // Add more user-specific links if needed
    ],
  },
];

const equipmentMenuItems = [
  {
    title: "Pages",
    list: [
      { title: "Dashboard", path: "/pages/equipment/dashboard", icon: <MdDashboard /> },
      { title: "Products", path: "/pages/equipment/dashboard/components", icon: <MdDashboard /> },
      { title: "Borrow", path: "/pages/equipment/dashboard/borrow", icon: <MdPeople /> },
      { title: "Notifications", path: "/pages/equipment/dashboard/notifications", icon: <MdPeople /> },
    ],
  },
  {
    title: "User",
    list: [
      // Add more user-specific links if needed
    ],
  },
];

// const projectsMenuItems = [
//   {
//     title: "Pages",
//     list: [
//       { title: "Dashboard", path: "/pages/project/dashboard", icon: <MdDashboard /> },
//       { title: "Projects", path: "/pages/project/dashboard/projects", icon: <MdPeople /> },
//       { title: "Tracking", path: "/pages/project/dashboard/tracking", icon: <MdAnalytics /> },
//       { title: "Calendar", path: "/pages/project/dashboard/calendar", icon: <MdAnalytics /> },
//       { title: "Notifications", path: "/pages/project/dashboard/notifications", icon: <MdAnalytics /> },
//     ],
//   },
//   {
//     title: "User",
//     list: [
//       // Add more user-specific links if needed
//     ],
//   },
// ];

// Sidebar component with a prop to determine which menu to display
const Sidebar = async ({ dashboardType }) => {
  // const result = await auth();
  // const user = result?.user;
  const user = {
    "username": "cheldean",
    "role" : "Admin"
  }

  if (!user) {
    console.error("User data is not available.");
    return <div className={styles.container}>User data not available</div>;
  }

  // Choose the menu items based on the dashboardType prop
  let menuItems;
  switch (dashboardType) {
    case 'admin':
      menuItems = adminMenuItems;
      break;
    case 'student':
      menuItems = studentMenuItems;
      break;
    case 'equipment':
      menuItems = equipmentMenuItems;
      break;
    case 'project':
      menuItems = adminMenuItems;
      break;
   
    default:
      menuItems = adminMenuItems; // Default to studentMenuItems if dashboardType is not recognized
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user ? user.username.toUpperCase() : "Jane" }</span>
          <span className={styles.userTitle}>{user? user.role.toUpperCase(): "Admin"}</span>
        </div>
      </div>

      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}

        {/* Conditionally render the Admin Dashboard link */}
        {user.role === 'admin' && (
          <li>
            <MenuLink item={{ title: "Admin Dashboard", path: "/pages/admin/dashboard", icon: <MdDashboard /> }} />
          </li>
        )}
      </ul>

      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
