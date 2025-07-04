'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Search from '@/app/components/search/search';
import styles from './Toolbar.module.css';

export default function Toolbar({ 
  placeholder = 'Search...',
  buttons = []
 }) {
  return (
    <div className={styles.toolbar}>
      {/* 1) Your existing Search box */}
      <Search placeholder={placeholder} />

      {/* 2) Dynamically render as many buttons as you passed in */}
      <div className={styles.buttonGroup}>
        {buttons.map(({ label, onClick, variant, icon: Icon }) => (
          <button
            key={label}
            onClick={onClick}
            className={
              variant === 'primary'
                ? styles.primaryButton
                : styles.secondaryButton
            }
          >
            {Icon && <Icon className={styles.buttonIcon} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  placeholder: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.oneOf(['primary', 'secondary']),
      icon: PropTypes.elementType,
    })
  ),
};


