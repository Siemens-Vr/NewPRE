"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import styles from '@/app/styles/navbar/navbar.module.css';
import Image from "next/image";
import {
  MdNotifications,
  MdOutlineChat,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log(pathname)

  const user = {
    username: "cheldean",
    role: "Admin"
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Convert pathname (e.g., "/staff") to "Staff"
  const pageTitle = pathname?.split("/").filter(Boolean).pop() || "Dashboard";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <div className={styles.container}>
    <div className={styles.container1}>
      <div className={styles.left}>
        <span className={styles.welcome}>Welcome, <strong>{user.username}</strong> 👋</span>
      </div>

      <div className={styles.right}>
        <MdOutlineChat size={20} />
        <MdNotifications size={20} />
        <div className={styles.userMenu} ref={dropdownRef}>
          <div className={styles.user} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Image
              className={styles.userImage}
              src="/noavatar.png"
              alt=""
              width="40"
              height="40"
            />
            <div className={styles.userDetail}>
              <span className={styles.username}>{user.username.toUpperCase()}</span>
              <span className={styles.userTitle}>{user.role.toUpperCase()}</span>
            </div>
          </div>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>


      {/* Dynamic breadcrumb-style page title */}
      <div style={{ padding: "10px 20px" }}>
        <h1 className={styles.component}>{formattedTitle}</h1>
      </div>
    </div>
  );
};

export default Navbar;
