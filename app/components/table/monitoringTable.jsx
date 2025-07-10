// File: app/components/table/Table.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styles from './monitoring.module.css';

/**
 * Generic Table component with sorting, missing data handling, and custom cell rendering.
 * Props:
 * - columns: [{ key, label, sortable, render? }]
 * - data: array of objects
 * - onSort: (key) => void
 * - sortKey: current sort column
 * - sortOrder: 'asc' | 'desc'
 */
export default function Table({ columns, data, onSort, sortKey, sortOrder }) {
  const handleSort = (key) => {
    if (onSort) onSort(key);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.stickyHeader}>
          <tr>
            {columns.map(col => (
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
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? styles.evenRow : ''}>
              {columns.map(col => (
                <td
                  key={col.key}
                  className={row[col.key] == null ? styles.missing : ''}
                >
                  {col.render ? col.render(row, idx) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
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
};

Table.defaultProps = {
  onSort: null,
  sortKey: null,
  sortOrder: 'asc',
};
