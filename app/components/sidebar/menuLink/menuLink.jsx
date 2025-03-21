"use client";

import Link from "next/link";
import styles from "@/app/styles/sidebar/menuLink/menuLink.module.css";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }) => {
    const pathname = usePathname();
    const isActive = pathname === item.path; // Check if the current path matches

    return (
        <Link href={item.path} className={`${styles.container} ${isActive ? styles.active : ""}`}>
      <span className={`${isActive ? styles.activeIcon : ""}`}>
        {item.icon}
      </span>
            {item.title}
        </Link>
    );
};

export default MenuLink;
