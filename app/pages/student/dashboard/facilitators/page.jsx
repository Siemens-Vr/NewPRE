"use client"; 

import { useState, useEffect } from 'react';
import Pagination from '@/app/components/pagination/pagination';
import Search from '@/app/components/search/search';
import styles from '@/app/styles/students/addStudent/facilitators.module.css';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { config } from '/config';
import AddFacilitatorPage from "@/app/pages/student/dashboard/facilitators/add/page";
// import AddStudentPage from "@/app/pages/student/dashboard/students/add/page";

const FacilitatorsPage = () => {
  const [facilitators, setFacilitators] = useState([]);
  const searchParams = useSearchParams();
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);
  const q = searchParams.get('q') || '';

  useEffect(() => {  
    const fetchFacilitators = async () => {
      try {
        const response = await fetch(`${config.baseURL}/facilitators${q ? `?q=${q}` : ''}`);
        const data = await response.json();
        setFacilitators(data);
      } catch (error) {
        console.error('Error fetching facilitators:', error);
      }
    };

    fetchFacilitators();
  }, [q]);

  // console.log(facilitators)
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3085d6',
    });
  };

  const handleAddNewClick = () => {
    setShowAddNewPopup(true);
  };

  // Close the "Add New" student popup
  const handleClosePopup = () => {
    setShowAddNewPopup(false);
  };

  const handleDeleteFacilitator = async (uuid, fullName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${fullName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.baseURL}/facilitators/${uuid}/delete`, {
          method: 'GET',
        });

        if (response.ok) {
          setFacilitators(facilitators.filter((facilitator) => facilitator.uuid !== uuid));
          Swal.fire({
            title: 'Deleted!',
            text: `${fullName} has been successfully deleted.`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } else {
          const errorData = await response.json();
          // console.log(errorData)
          showErrorAlert(errorData.error || 'Failed to delete facilitator.');
        }
      } catch (error) {
        console.error('Error deleting facilitator:', error);
        showErrorAlert('An error occurred while trying to delete the facilitator.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a facilitator..."  />
        <button onClick={handleAddNewClick} className={styles.addButton}>
          Add New
        </button>

        {/* Conditionally render the Add New Student Popup */}
        {showAddNewPopup && (
            <AddFacilitatorPage onClose={handleClosePopup} />
        )}
      </div>
      {facilitators.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Gender</td>
              <td>ID No</td>
              <td>Phone</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {facilitators.map((facilitator) => {
              const fullName = `${facilitator.firstName} ${facilitator.lastName}`;
              return (
                <tr key={facilitator.id}>
                  <td>
                    <div className={styles.facilitator}>
                      {fullName}
                    </div>
                  </td>
                  <td>{facilitator.email}</td>
                  <td>{facilitator.gender}</td>
                  <td>{facilitator.idNo}</td>
                  <td>{facilitator.phoneNo}</td>
                  <td>
                    <div className={styles.buttons}>
                      <Link href={`/pages/student/dashboard/facilitators/${facilitator.uuid}`}>
                        <button className={`${styles.button} ${styles.view}`}>
                          View
                        </button>
                      </Link>
                      <button
                        className={`${styles.button} ${styles.delete}`}
                        onClick={() => handleDeleteFacilitator(facilitator.uuid, fullName)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className={styles.noStudents}>No facilitators available</p>
      )}
      <Pagination count="" />
    </div>
  );
};

export default FacilitatorsPage;