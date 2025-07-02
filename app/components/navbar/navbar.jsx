"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
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
    // Build breadcrumb array
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { href: "/", label: "Home" },
    ...segments.map((seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      // Capitalize and replace hyphens
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      return { href, label };
    }),
  ];

  // Current page title = last breadcrumb label
  const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

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


          {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        {breadcrumbs.map((bc, idx) => (
          <React.Fragment key={bc.href}>
            <Link href={bc.href} className={styles.breadcrumbLink}>
              {bc.label}
            </Link>
            {idx < breadcrumbs.length - 1 && (
              <span className={styles.breadcrumbSeparator}>/</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Page Title */}
      <div className={styles.titleContainer}>
        <h1 className={styles.pageTitle}>{currentTitle}</h1>
      </div>
    </div>
  );
};

export default Navbar;
