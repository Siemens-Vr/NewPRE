// File: app/components/table/Table.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.module.css';

/**
 * Generic Table component with sorting, missing data handling, custom cell rendering, and row click support.
 * Props:
 * - columns: [{ key, label, sortable, render? }]
 * - data: array of objects
 * - onSort: (key) => void
 * - sortKey: current sort column
 * - sortOrder: 'asc' | 'desc'
 * - onRowClick: (row, id) => void (optional)
 *    Passes the full row object and its identifier (row.uuid or row.id) back to parent.
 */
export default function Table({
  columns,
  data,
  onSort = () => {},
  sortKey = null,
  sortOrder = 'asc',
  onRowClick = null,
}) {
  const handleSort = (key) => {
    onSort(key);
  };

  const handleClick = (row) => {
    if (onRowClick) {
      const id = row.uuid ?? row.id ?? null;
      // console.log('Row clicked:', row, 'ID:', id);
      onRowClick(row, id);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.stickyHeader}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? styles.sortable : ''}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const rowClasses = [
              idx % 2 === 0 ? styles.evenRow : '',
              onRowClick ? styles.clickableRow : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <tr
                key={row.uuid || idx}
                className={rowClasses}
                style={onRowClick ? { cursor: 'pointer' } : {}}
                onClick={() => handleClick(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={row[col.key] == null ? styles.missing : ''}
                  >
                    {col.render ? col.render(row, idx) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.oneOf(['asc', 'desc']),
  onRowClick: PropTypes.func, // signature: (row, id) => void
};
