import React from 'react';
import styles from '@/app/styles/pagination/pagination.module.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null; // Hide pagination if there is only one page or none

  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  const handleChangePage = (direction) => {
    if (direction === "prev" && hasPrev) {
      onPageChange(currentPage - 1);
    } else if (direction === "next" && hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => handleChangePage("prev")}
      >
        Previous
      </button>
      <button
        className={styles.button}
        disabled={!hasNext}
        onClick={() => handleChangePage("next")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
