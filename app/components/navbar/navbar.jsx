"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdNotifications, MdOutlineChat } from "react-icons/md";
import { AuthContext } from "@/app/context/AuthContext";
import styles from "@/app/styles/navbar/navbar.module.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, socket } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

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

  // Increment unreadCount on incoming NOTIFICATION messages
  useEffect(() => {
    if (!isAuthenticated || !socket) return;
    const handler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "NOTIFICATION") {
          setUnreadCount((c) => c + 1);
        }
      } catch {}
    };
    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [isAuthenticated, socket]);

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
          <span className={styles.username}>{user?.username?.toUpperCase() || ""}</span>
          <span className={styles.userTitle}>{user?.role?.toUpperCase() || ""}</span>
        </div>

        <div className={styles.right}>
          <MdOutlineChat size={20} />

          <div
            className={styles.notificationWrapper}
            onClick={() => {
              setUnreadCount(0);
              router.push(`staff/${uuid}/dashboard/notifications`);
            }}
          >
            <MdNotifications size={20} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </div>

          <div className={styles.userMenu} ref={dropdownRef}>
            <div className={styles.user} onClick={() => setDropdownOpen((o) => !o)}>
              <Image
                className={styles.userImage}
                src="/noavatar.png"
                alt="avatar"
                width={40}
                height={40}
              />
              <div className={styles.userDetail}>
                <span className={styles.username}>
                  {user?.username?.toUpperCase() || ""}
                </span>
                <span className={styles.userTitle}>
                  {user?.role?.toUpperCase() || ""}
                </span>
              </div>
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li>
                    <Link href="/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li onClick={() => router.push("/archive")}>Archive</li>
                  <li onClick={() => router.push("/logout")}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Navbar;
