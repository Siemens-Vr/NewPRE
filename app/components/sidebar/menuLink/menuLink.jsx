"use client";

import Link from "next/link";
import styles from "@/app/styles/sidebar/menuLink/menuLink.module.css";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MenuLink = ({ item, isOpen, toggleMenu }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const hasSubpages = item.subpages && item.subpages.length > 0;

  return (
    <div className={styles.menuItem}>
      <div
        className={`${styles.container} ${isActive ? styles.active : ""}`}
        onClick={hasSubpages ? () => toggleMenu(item.title) : null}
        style={{ cursor: hasSubpages ? "pointer" : "default" }}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.title}>{item.title}</span>

        {hasSubpages && (
          <span className={styles.toggleIcon}>
            {isOpen ? (
              <FaChevronUp className={styles.whiteIcon} />
            ) : (
              <FaChevronDown className={styles.whiteIcon} />
            )}
          </span>
        )}
      </div>

      {/* Subpages */}
      {hasSubpages && isOpen && (
        <ul className={styles.submenu}>
          {item.subpages.map((sub) => (
            <li key={sub.title}>
              <Link
                href={sub.path}
                className={`${styles.subLink} ${
                  pathname === sub.path ? styles.activeSub : ""
                }`}
              >
                <span className={styles.icon}>{sub.icon}</span>
                {sub.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuLink;
