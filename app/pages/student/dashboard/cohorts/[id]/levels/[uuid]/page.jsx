"use client";
import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css'
import Search from '@/app/components/cohort/search'
import Pagination from '@/app/components/pagination/pagination'
import LevelEditPopup from '@/app/components/cohort/LevelEditPopup'
import { AddUpdateHoursPopup, ViewHoursPopup } from '@/app/components/facilitators/WorkHoursPopups'
import { config } from '/config';
import { pdf } from '@react-pdf/renderer';
import LevelDetailsPDF from '@/app/components/cohort/LevelDetailsPDF'
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import Link from 'next/link';



const LevelDetails = ({ searchParams }) => {
  
  const [levelData, setLevelData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [facilitators, setFacilitators] = useState([]);
  const [currentFacilitatorId, setCurrentFacilitatorId] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const params = useParams();
  // console.log(params)

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData  = async (req, res)=>{
    const response = await fetch(`${config.baseURL}/levels/${params.id}/levels/${params.uuid}`)
    const data = await response.json();
    console.log(data)
    setLevelData(data)
  }
  
  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await fetch(`${config.baseURL}/facilitators`);
        const data = await response.json();
        setFacilitators(data);
      } catch (error) {
        console.error('Error fetching facilitators:', error);
      }
    };

    fetchFacilitators();
  }, []);

  if (!levelData) {
    return <p>Loading...</p>;
  }

  // Calculate total pages
  const studentsPerPage = 10;
  const filteredStudents = levelData.students.filter(student =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get students for the current page
  const currentStudents = filteredStudents.slice(
    currentPage * studentsPerPage,
    (currentPage + 1) * studentsPerPage
  );

  // Count pass and fail
  const passCount = levelData.students.filter(student => student.examResults === 'pass').length;
  const failCount = levelData.students.filter(student => student.examResults === 'fail').length;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  // New function to handle level update
  const handleLevelUpdate = async (updatedData) => {
    try {
      const response = await fetch(`${config.baseURL}/levels/${levelData.uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedLevel = await response.json();
        setLevelData({ ...levelData, ...updatedLevel });
        alert("Level Information updated")
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update level:', errorData);
      }
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const handleAddUpdateHours = async (facilitatorId, entries) => {
    try {
      const response = await fetch(`${config.baseURL}/levels/${levelData.uuid}/facilitators/${facilitatorId}/hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries }),
      });
      if (!response.ok) {
        throw new Error('Failed to add hours');
      }
      setSuccessMessage('Hours updated successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('Error updating hours:', error);
      alert('Failed to update hours. Please try again.');
    }
  };

  const handleAddFacilitator = (newFacilitator) => {
    const updatedFacilitators = [...levelData.facilitators, newFacilitator];
    setLevelData({ ...levelData, facilitators: updatedFacilitators });
  };

  const handleRemoveFacilitator = (index) => {
    const updatedFacilitators = levelData.facilitators.filter((_, i) => i !== index);
    setLevelData({ ...levelData, facilitators: updatedFacilitators });
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (levelData) {
      const blob = await pdf(<LevelDetailsPDF levelData={levelData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      console.error('No level data available to download.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Start Date</td>
              <td>End Date</td>
              <td>Exam Date</td>
              <td>Exam Quotation Number</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{levelData.levelName}</td>
              <td>{new Date(levelData.startDate).toLocaleDateString()}</td>
              <td>{new Date(levelData.endDate).toLocaleDateString()}</td>
              <td>{new Date(levelData.examDates).toLocaleDateString()}</td>
              <td>{levelData.examQuotationNumber}</td>
              <td>
                <button onClick={() => setShowPopup(true)} className={styles.button}>Update</button>
                <button onClick={handleDownloadPDF} className={styles.button}>Download PDF</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.studentTable}>
        {filteredStudents.length > 0 ? (
          <>
            <div className={styles.tableTop}>
              <h3>Students</h3>
              <p>Count: {levelData.students.length}</p>
              <p>Pass: {passCount}</p>
              <p>Fail: {failCount}</p>
              <Search value={searchQuery} onChange={handleSearchChange} placeholder="Search" />
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <td>No.</td>
                  <td>Registration Number</td>
                  <td>Name</td>
                  <td>Exam Results</td>
                  <td>Phone</td>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{currentPage * studentsPerPage + index + 1}</td>
                    <td>{student.regNo}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.examResults}</td>
                    <td>{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p className={styles.nothing}>No students found.</p>
        )}
      </div>

      <div className={styles.instructorsTable}>
        {levelData.facilitators.length > 0 ? (
          <>
            <div className={styles.tableTop}>
              <h3>Instructors</h3>
              <p>Paid: 20</p>
              <p>Not Paid: 18</p>
              <Link href="/pages/student/dashboard/facilitators/add">
                <button className={styles.button}>Add New Instructor</button>
              </Link>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <td>No.</td>
                  <td>Name</td>
                  <td>Phone</td>
                  <td>Specification</td>
                  <td>Total Hours</td>
                </tr>
              </thead>
              <tbody>
                {levelData.facilitators.map((facilitator, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{facilitator.firstName} {facilitator.lastName}</td>
                    <td>{facilitator.phone}</td>
                    <td>{facilitator.specification}</td>
                    <td>
                      <div className={styles.hoursButtons}>
                        <button className={styles.button} onClick={() => { setCurrentFacilitatorId(facilitator.uuid); setPopupType('addUpdate'); }}>Add Hours</button>
                        <button className={styles.button} onClick={() => { setCurrentFacilitatorId(facilitator.uuid); setPopupType('view'); }}>View Hours</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className={styles.nothing}>No facilitators found.</p>
        )}
      </div>

      {showPopup && (
        <LevelEditPopup
          levelData={levelData}
          onClose={() => setShowPopup(false)}
          onUpdate={handleLevelUpdate}
        />
      )}

      {popupType === 'addUpdate' && (
        <AddUpdateHoursPopup
          facilitatorId={currentFacilitatorId}
          onClose={() => setPopupType(null)}
          onSubmit={(entries) => handleAddUpdateHours(currentFacilitatorId, entries)}
        />
      )}

      {popupType === 'view' && (
        <ViewHoursPopup
          facilitatorId={currentFacilitatorId}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
};

export default LevelDetails;
