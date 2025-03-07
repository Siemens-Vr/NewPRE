"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CohortEditPopup from '@/app/components/cohort/CohortEditPopup';
import styles from '@/app/styles/students/students.module.css';
import Swal from 'sweetalert2';
import { config } from '/config';

const CohortsPage = () => {
  const [cohorts, setCohorts] = useState([]);
  const [filteredCohorts, setFilteredCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCohorts();
  }, []);

  useEffect(() => {
    // Filter cohorts whenever the search query changes
    if (searchQuery) {
      const filtered = cohorts.filter(cohort =>
        cohort.cohortName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCohorts(filtered);
    } else {
      setFilteredCohorts(cohorts); // Reset to all cohorts if the search query is empty
    }
  }, [searchQuery, cohorts]);

  const fetchCohorts = async () => {
    try {
      const response = await fetch(`${config.baseURL}/cohorts`);
      const data = await response.json();
      setCohorts(data);
      setFilteredCohorts(data); // Initialize filtered cohorts with all cohorts
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3085d6',
    });
  };

  const handleDeleteCohort = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete all the cohorts information`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.baseURL}/cohorts/${id}/delete`, {
          method: 'GET',
        });

        if (response.ok) {
          await fetchCohorts();
          Swal.fire({
            title: 'Deleted!',
            text: 'Cohort has been successfully deleted.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } else {
          const errorData = await response.json();
          console.log(errorData);
          showErrorAlert(errorData.error || 'Failed to delete Cohort.');
        }
      } catch (error) {
        console.error('Error deleting cohort:', error);
        showErrorAlert('An error occurred while trying to delete the cohort.');
      }
    }
  };

  const handleEditCohort = (cohort) => {
    setSelectedCohort(cohort);
    setIsEditPopupOpen(true);
  };

  const handleUpdateCohort = async (updatedCohortData) => {
    try {
      const response = await fetch(`${config.baseURL}/cohorts/${selectedCohort.uuid}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCohortData),
      });

      if (response.ok) {
        setCohorts(cohorts.map(cohort => (cohort.id === selectedCohort.id ? updatedCohortData : cohort)));
        console.log('Cohort updated successfully');
      } else {
        console.error('Failed to update cohort');
      }
    } catch (error) {
      console.error('Error updating cohort:', error);
    }
    setIsEditPopupOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Link href="/pages/student/dashboard/cohorts/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
        <input
          type="text"
          placeholder="Search Cohorts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput} // Add appropriate styles here
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Cohort Name</td>
            <td>Start Date</td>
            <td>End Date</td>
            <td>Cohort Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {filteredCohorts.map((cohort) => (
            <tr key={cohort.id}>
              <td>{cohort.cohortName}</td>
              <td>{cohort.startDate}</td>
              <td>{cohort.endDate}</td>
              <td>
                <span className={`${styles.status} ${cohort.status === 'Ongoing' ? styles.ongoing : styles.completed}`}>
                  {cohort.status}
                </span>
              </td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/pages/student/dashboard/cohorts/${cohort.uuid}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <button
                    className={`${styles.button} ${styles.view}`}
                    onClick={() => handleEditCohort(cohort)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.button} ${styles.delete}`}
                    onClick={() => handleDeleteCohort(cohort.uuid)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditPopupOpen && (
        <CohortEditPopup
          cohortData={selectedCohort}
          onClose={() => setIsEditPopupOpen(false)}
          onUpdate={handleUpdateCohort}
        />
      )}
    </div>
  );
};

export default CohortsPage;
