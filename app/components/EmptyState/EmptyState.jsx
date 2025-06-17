// app/components/emptyState/EmptyState.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';
import { MdSearchOff } from 'react-icons/md';

/**
 * EmptyState
 * A reusable component to display when no data is available.
 * Props:
 * - message: string - main message
 * - details: string - secondary details text
 * - actionLabel: string - label for action button
 * - onAction: function - click handler for action button
 * - illustration: string - optional URL for custom illustration
 */
export default function EmptyState({
  message = 'Nothing to display here.',
  details = '',
  actionLabel = '',
  onAction = null,
  illustration = ''
}) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      {illustration ? (
        <img src={illustration} alt="" className={styles.illustration} />
      ) : (
        <MdSearchOff className={styles.icon} aria-hidden="true" />
      )}

      <h3 className={styles.message}>{message}</h3>
      {details && <p className={styles.details}>{details}</p>}
      {actionLabel && onAction && (
        <button className={styles.button} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
  details: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  illustration: PropTypes.string,
};
