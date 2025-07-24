"use client";

import styles from '@/app/styles/cohorts/viewCohort/viewLevel.module.css'
import Pagination from '@/app/components/pagination/pagination'
import LevelEditPopup from '@/app/components/cohort/LevelEditPopup'
import { AddUpdateHoursPopup } from '@/app/components/facilitators/WorkHoursPopups';
import { ViewHoursPopup }  from '@/app/components/facilitators/viewWorkHours';
import { pdf } from '@react-pdf/renderer';
import LevelDetailsPDF from '@/app/components/cohort/LevelDetailsPDF'
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import api from '@/app/lib/utils/axios';
import Table from '@/app/components/table/Table';
import Loading from '@/app/components/Loading/Loading';
import FacilitatorSelectPopup from '@/app/components/cohort/FacilitatorsSelect';
import { toast } from 'react-toastify';



const ROWS_PER_PAGE = 10;
const LevelDetails = ({ searchParams }) => {
  const [levelData, setLevelData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [facilitators, setFacilitators] = useState([]);
  const [currentFacilitatorId, setCurrentFacilitatorId] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddNewPopup, setShowAddNewPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
    const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
  const [showSelectFacPopup, setShowSelectFacPopup] = useState(false);

  const params = useParams();

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
       setLoading(true);
    try {
      const response = await api.get(`/levels/${params.id}/levels/${params.uuid}`);
      const data = response.data;
      setLevelData(data);
      console.log("Fetched level data:", data);
    } catch (error) {
      console.error("Error fetching level data:", error);
  
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        const response = await api.get('/facilitators');
        const data = response.data;
        setFacilitators(data);
      } catch (error) {
        console.error('Error fetching facilitators:', error);
      }
    };

    fetchFacilitators();
  }, []);
   const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

 const handleSelectFacilitator = async (facUuid) => {
    try {
      await api.post(
        `/levels/${levelData.uuid}/facilitators`,
        { facilitatorId: facUuid }
      );
      // re-fetch so the table updates with the newly added facilitator
      await fetchData();
    } catch (err) {
      console.error('Error attaching facilitator:', err);
      alert('Could not add facilitator.');
    } finally {
      setShowSelectFacPopup(false);
    }
  };

 if (loading) {
    return <Loading text="Loading level details..." />;
  }

  if (!levelData) {
    return <p className="text-center">No level data available.</p>;
  }
 

  const studentsPerPage = 10;
  const filteredStudents = levelData.students.filter(student =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(
    currentPage * studentsPerPage,
    (currentPage + 1) * studentsPerPage
  );
  const passCount = levelData.students.filter(student => student.examResults === 'pass').length;
  const failCount = levelData.students.filter(student => student.examResults === 'fail').length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0);
  };

  const handleLevelUpdate = async (updatedData) => {
    try {
      const response = await api.patch(`/levels/${levelData.uuid}`, updatedData);
      const updatedLevel = response.data;
      setLevelData({ ...levelData, ...updatedLevel });
      toast.success("Level Information updated");
      await fetchData(); // re-fetch to get the latest data
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const handleAddUpdateHours = async (facilitatorId, entries) => {
    try {
      await api.post(`/levels/${levelData.uuid}/facilitators/${facilitatorId}/hours`, { entries });
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

  const handleDownloadPDF = async () => {
    if (levelData) {
      const blob = await pdf(<LevelDetailsPDF levelData={levelData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      console.error('No level data available to download.');
    }
  };

  const handleAddNewClick = () => {
    setShowAddNewPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddNewPopup(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.top}>
          <Table
          columns={[
            { key: 'levelName', label: 'Name' },
            { key: 'startDate', label: 'Start Date', render: row => new Date(row.startDate).toLocaleDateString() },
            { key: 'endDate', label: 'End Date', render: row => new Date(row.endDate).toLocaleDateString() },
            { key: 'examDates', label: 'Exam Date', render: row => new Date(row.examDates).toLocaleDateString() },
            { key: 'examQuotationNumber', label: 'Exam Quotation Number' },
            {
              key: 'actions',
              label: 'Action',
              render: () => (
                <div className={styles.actionMenu}>
                  <button className={styles.dotsButton} onClick={() => setShowMenu(!showMenu)}>⋮</button>
                  {showMenu && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={() => setShowPopup(true)}>Update</button>
                      <button onClick={handleDownloadPDF}>Download PDF</button>
                    </div>
                  )}
                </div>
              )
            }
          ]}
          data={[levelData]}
        />

        </div>
      </div>

      <div className={`${styles.studentTable} ${filteredStudents.length > 0 ? styles.filled : styles.empty}`}>
        {filteredStudents.length > 0 ? (
          <>
            <div className={styles.tableTop}>
              <h3>Students</h3>
              <p>Count: {levelData.students.length}</p>
              <p>Pass: {passCount}</p>
              <p>Fail: {failCount}</p>
            </div>

            <Table
            columns={[
              {
                key: 'no',
                label: 'No.',
                render: (_row, idx) => currentPage * studentsPerPage + idx + 1,
              },
              { key: 'regNo', label: 'Registration Number' },
              {
                key: 'name',
                label: 'Name',
                render: row => `${row.firstName} ${row.lastName}`,
              },
              { key: 'examResults', label: 'Exam Results' },
              { key: 'phone', label: 'Phone' }
            ]}
            data={currentStudents}
          />

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </>
        ) : (
          <p className={styles.nothing}>No students found.</p>
        )}
      </div>

      <div className={styles.instructorsTable}>
        <div className={styles.tableTop}>
    <h3>Instructors</h3>
          <button
           onClick={() => setShowSelectFacPopup(true)}
           className={styles.addButton}
           >
           + Add Existing Instructor
         </button>
        {showSelectFacPopup && (
          <FacilitatorSelectPopup
            allFacilitators={facilitators}
            currentLevelFacilitators={levelData.facilitators}
            onClose={() => setShowSelectFacPopup(false)}
            onSelect={({ facilitatorId, specification }) => {
              // call your API to attach with specification
              api.post(`/levels/${levelData.uuid}/facilitators`, {
                facilitatorId,
                specification
              })
              .then(fetchData)
              .catch(() => alert('Failed to add facilitator.'))
              .finally(() => setShowSelectFacPopup(false));
            }}
          />
        )}

  </div>

        {levelData.facilitators.length > 0 ? (
          <>
            {/* <div className={styles.tableTop}>
              <h3>Instructors</h3>
              <button onClick={handleAddNewClick} className={styles.addButton}>Add New Instructor</button>
              {showAddNewPopup && (
                <AddFacilitatorPage onClose={handleClosePopup} />
              )}
            </div> */}

            <Table
            columns={[
              {
                key: 'no',
                label: 'No.',
                render: (_row, idx) => idx + 1
              },
              {
                key: 'name',
                label: 'Name',
                render: row => `${row.firstName} ${row.lastName}`
              },
              { key: 'phone', label: 'Phone' },
              { key: 'specification', label: 'Specification' },
              {
                key: 'actions',
                label: 'Total Hours',
                render: (row) => (
                  <div className={styles.hoursButtons}>
                    <button className={styles.addButton} onClick={() => {
                      setCurrentFacilitatorId(row.uuid);
                      setPopupType('addUpdate');
                    }}>
                      Add Hours
                    </button>
                    <button className={styles.button} onClick={() => {
                      setCurrentFacilitatorId(row.uuid);
                      setPopupType('view');
                    }}>
                      View Hours
                    </button>
                  </div>
                )
              }
            ]}
            data={levelData.facilitators}
          />

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
