// CardComponent.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/card/cardComponent.module.css';

const CardComponent = ({
  title,
  details,
  href = null,
  onCardClick = null,
  onUpdate,
  onDelete,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (href) {
      router.push(href);
    } else if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer} onClick={handleCardClick}>
        <h3 className={styles.cardTitle}>{title}</h3>

        <div className={styles.cardDetails}>
          {Object.entries(details).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
              {value}
            </p>
          ))}
        </div>

        <div className={styles.cardActions}>
          {onUpdate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate();
              }}
              className={`${styles.actionButton} ${styles.editButton}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
  href: PropTypes.string,
  onCardClick: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CardComponent;
