"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/app/styles/navbar/navbar.module.css";
import Image from "next/image";
import { MdNotifications, MdSearch } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = {
    username: "cheldean",
    role: "Admin",
  };

  if (!user) {
    console.error("User data is not available.");
    return <div className={styles.container}>User data not available</div>;
  }

  return (
    <div className={styles.container1}>
      {/* Left side - Welcome Message */}
      <div className={styles.welcome}>
        <h3>Welcome, {user.username}!</h3>
      </div>

      {/* Right side - Search, Notifications & Menu */}
      <div className={styles.menu1}>

        <MdNotifications size={22} className={styles.notificationIcon} />

        {/* User Profile & Dropdown Menu */}
        <div className={styles.userMenu}>
          <div className={styles.user} onClick={() => setMenuOpen(!menuOpen)}>
            
            
            <FaBars size={20} className={styles.menuIcon} />
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                <li onClick={() => console.log("Edit Profile Clicked")}>Edit Profile</li>
                <li onClick={() => console.log("Reset Password Clicked")}>Reset Password</li>
                <li onClick={() => console.log("Logout Clicked")}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
