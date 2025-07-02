'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { FaEllipsisV } from 'react-icons/fa';
import styles from '@/app/styles/card/cardComponent.module.css';

const CardComponent = ({
  title,
  details,
  href = null, 
  onCardClick = null,  
  onUpdate,
  onDelete,
  showDropdown = true, 
}) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCardClick = () => {
    if (href) router.push(href);
    else if (onCardClick) onCardClick();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer} onClick={handleCardClick}>
        <div className={styles.cardHeader}>
          <h3>{title}</h3>

          {showDropdown && (
            <div style={{ position: 'relative' }}>
              <button onClick={toggleDropdown} className={styles.menuButton}>
                <FaEllipsisV />
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {onUpdate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate();
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      Update
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Always-visible details */}
        <div className={styles.cardDetails}>
          {Object.entries(details).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
              {value}
            </p>
          ))}
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
  showDropdown: PropTypes.bool,
};

export default CardComponent;
