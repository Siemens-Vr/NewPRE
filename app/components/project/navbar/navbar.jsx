"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/styles/project/navbar/navbar.module.css';

/**
 * Reusable project navbar.
 * @param {{ items: { key: string, label: string, href: string }[] }} props
 */
export default function ProjectNavbar({ items }) {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {items.map(item => {
          const active = pathname === item.href;
          return (
            <li key={item.key} className={styles.navItem}>
              <Link
                href={item.href}
                className={active ? styles.activeLink : styles.link}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
