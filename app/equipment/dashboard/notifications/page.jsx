"use client";
import React, { useState, useEffect } from "react";
import api from "@/app/lib/utils/axios";
import { config } from "/config";
import styles from "@/app/styles/notifications/notifications.module.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");     // all | unread | read
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);     // now an array of IDs
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`${config.baseURL}/notifications`);
        if (res.statusText === "OK") {
          setNotifications(res.data.rows);
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    })();
  }, []);

  // Apply filter + search
  const filtered = notifications.filter(n => {
    if (filter === "unread" && n.read) return false;
    if (filter === "read"   && !n.read) return false;
    return n.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Toggle all on current page
  const toggleSelectAll = () => {
    const allIds = pageItems.map(n => n.id);
    const allSelected = allIds.every(id => selected.includes(id));

    if (allSelected) {
      // remove this page's IDs from selection
      setSelected(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // add any missing IDs
      setSelected(prev => {
        const merged = [...prev, ...allIds];
        // dedupe
        return Array.from(new Set(merged));
      });
    }
  };

  // Toggle one checkbox
  const toggleSelectOne = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Mark all read & clear selection
  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    setSelected([]);
  };

  return (
    <div className={styles.notificationsCard}>
      <div className={styles.notificationsHeader}>
        <div className={styles.headerControls}>
          <div className={styles.filters}>
            <button
              className={filter === "all" ? styles.activeFilter : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "unread" ? styles.activeFilter : ""}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
            <button
              className={filter === "read" ? styles.activeFilter : ""}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
          <input
            type="search"
            placeholder="Search notifications…"
            className={styles.searchInput}
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          />
          <button className={styles.markAllBtn} onClick={markAllRead}>
            Mark all read
          </button>
        </div>
      </div>

      <ul className={styles.notificationList}>
        {/* Header row with select-all */}
        <li className={`${styles.notificationItem} ${styles.headerRow}`}>
          <input
            type="checkbox"
            checked={
              pageItems.length > 0 &&
              pageItems.every(n => selected.includes(n.id))
            }
            onChange={toggleSelectAll}
          />
          <span className={styles.colMessage}>Message</span>
          <span className={styles.colTime}>Time</span>
        </li>

        {pageItems.map(n => (
          <li
            key={n.id}
            className={`${styles.notificationItem} ${!n.read ? styles.unread : ""}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(n.id)}
              onChange={() => toggleSelectOne(n.id)}
            />
            <div className={styles.colMessage}>{n.message}</div>
            <time className={styles.colTime}>
              {new Date(n.createdAt).toLocaleString()}
            </time>
          </li>
        ))}

        {filtered.length === 0 && (
          <li className={styles.noResults}>No notifications found.</li>
        )}
      </ul>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <span>{page} / {pageCount}</span>
        <button
          onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
