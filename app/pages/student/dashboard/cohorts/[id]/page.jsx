"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import styles from '@/app/styles/cohorts/viewCohort/viewCohort.module.css';
import CardComponent from "@/app/components/card/CardComponents"; 
import LevelAddPopUp from '@/app/components/cohort/AddLevel';
import LZString from 'lz-string';
import { useRouter } from 'next/navigation';
import api from "@/app/lib/utils/axios";



const ViewCohort = () => {
  const router = useRouter();
  const [cohortsData, setCohortsData] = useState(null);
  const [levelsData, setLevelsData] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [levelToEdit, setLevelToEdit] = useState(null);
  
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    fetchCohortData();
  }, [id]);

  const handleLevelAdd = async (levelData) => {
  try {
    if (editMode && levelToEdit) {
      // Update existing level
      const response = await api.patch(`/levels/${levelToEdit.uuid}/update`, levelData);
      if (response.status === 200) {
        await fetchCohortData();
        setEditMode(false);
        setShowPopup(false);
        setLevelToEdit(null);
      } else {
        console.error("Failed to update level:", response.data);
      }
    } else {
      // Create new level
      const response = await api.post(`/levels`, levelData);
      if (response.status === 201 || response.status === 200) {
        await fetchCohortData();
        setShowPopup(false);
      } else {
        console.error("Failed to add new level:", response.data);
      }
    }
  } catch (error) {
    console.error('Error adding/updating level:', error);
  }
};

  
  // Separate function to refetch cohort data
  const fetchCohortData = async () => {
    
    try {
      if (id) {
        const response = await api.get(`/cohorts/${id}`);
        setCohortsData(response.data.cohort);
        setLevelsData(response.data.levels || []);
      }
    } catch (error) {
      console.error("Error fetching cohort data:", error);
    }
  };

  // console.log(cohortsData)
  const handleEditLevel = (level) => {
  setLevelToEdit(level);
  setEditMode(true);
  setShowPopup(true);
};

const handleUpdateLevel = async (updatedData) => {
  try {
    const response = await api.patch(`/levels/${levelToEdit.uuid}/update`, updatedData);
    if (response.status === 200) {
      await fetchCohortData();
      setEditMode(false);
      setShowPopup(false);
    } else {
      console.error("Failed to update level:", response.data);
    }
  } catch (error) {
    console.error("Error updating level:", error);
  }
};

const handleDeleteLevel = async (levelUuid) => {
  const confirm = window.confirm("Are you sure you want to delete this level?");
  if (!confirm) return;

  try {
    const response = await api.delete(`/levels/${levelUuid}`);
    if (response.status === 200) {
      setLevelsData(levelsData.filter(level => level.uuid !== levelUuid));
      console.log('Level deleted successfully');
    } else {
      console.error('Failed to delete level:', response.data);
    }
  } catch (error) {
    console.error('Error deleting level:', error);
  }
};

  const handleDownloadPDF = async () => {
    if (cohortsData) {
      const blob = await pdf(<CohortDetailsPDF cohortData={cohortsData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      console.error('No cohort data available to download.');
    }
  };

  if (!cohortsData) {
    return <p>Loading...</p>;
  }

  // if (!cohortsData.cohorts) {
  //   return <p>Error: Cohort data is unavailable.</p>;
  // }

  return (
    <div className={styles.container}>
      <div className={styles.details}>
          <div className={styles.detailsRow}>
          <h1>{cohortsData.cohortName}</h1>
           
          <p>
            Start Date: {new Date(cohortsData.startDate).toLocaleDateString()}
          </p>
            <p>
            End Date: {new Date(cohortsData.endDate).toLocaleDateString()}
            </p>

          <button onClick={() => setShowPopup(true)} className={styles.buttons}>
            Add Level
          </button>
          <button onClick={handleDownloadPDF} className={`${styles.cohortbtn} ${styles.cohortdownload}`}>
          Download PDF
        </button>
        </div>
       
      </div>
      <div className={styles.levelsContainer}>
        {levelsData.length > 0 ? (
  <div className="card-grid">
    {levelsData.map((level) => (
     <CardComponent
  key={level.uuid}
  title={level.levelName}
  details={{
    "Number of Students": level.students?.length || 0,
    "Number of Facilitators": level.facilitators?.length || 0,
  }}
  href={`/pages/student/dashboard/cohorts/${cohortsData.uuid}/levels/${level.uuid}`}
  onUpdate={() => handleEditLevel(level)}
  onDelete={() => handleDeleteLevel(level.uuid)}
  showDropdown={true}
/>

    ))}
  </div>
) : (
  <p className='text-center text-lg'>No levels available for this cohort.</p>
)}

      </div>
  {showPopup && (
  <LevelAddPopUp
    onClose={() => {
      setShowPopup(false);
      setEditMode(false);
      setLevelToEdit(null);
    }}
    onSave={handleLevelAdd}
    cohortStartDate={cohortsData.startDate}
    cohortEndDate={cohortsData.endDate}
    // Optionally pass initialValues if editing
    initialValues={editMode ? levelToEdit : null}
  />
)}


    </div>
  );
};

const CohortDetailsPDF = ({ cohortData }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    heading: {
      fontSize: 24,
      marginBottom: 15,
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    dateText: {
      fontSize: 12,
      color: '#2c3e50',
    },
    subheading: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: '#34495e',
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      color: '#2c3e50',
    },
    levelSection: {
      marginTop: 15,
      borderTop: 1,
      borderColor: '#bdc3c7',
      paddingTop: 10,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bdc3c7',
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginTop: 10,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomColor: '#bdc3c7',
      borderBottomWidth: 1,
    },
    tableCol: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderColor: '#bdc3c7',
      padding: 5,
    },
    tableHeader: {
      backgroundColor: '#34495e',
      color: '#ffffff',
      fontWeight: 'bold',
    },
    tableCell: {
      fontSize: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{cohortData.cohorts.cohortName}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Start Date: {new Date(cohortData.cohorts.startDate).toLocaleDateString()}</Text>
            <Text style={styles.dateText}>End Date: {new Date(cohortData.cohorts.endDate).toLocaleDateString()}</Text>
          </View>

          {cohortData.levels.map((level, index) => (
            <View key={index} style={styles.levelSection}>
              <Text style={styles.subheading}>{level.levelName}</Text>

              <Text style={[styles.text, { marginTop: 10, fontWeight: 'bold' }]}>Facilitators:</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCol, { width: '10%' }]}>No.</Text>
                  <Text style={[styles.tableCol, { width: '45%' }]}>Name</Text>
                  <Text style={[styles.tableCol, { width: '45%' }]}>Email</Text>
                </View>
                {level.facilitators.map((facilitator, fIndex) => (
                  <View key={fIndex} style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '10%' }]}>{fIndex + 1}</Text>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '45%' }]}>{facilitator.firstName} {facilitator.lastName}</Text>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '45%' }]}>{facilitator.email}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.text, { marginTop: 15, fontWeight: 'bold' }]}>Students:</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCol, { width: '10%' }]}>No.</Text>
                  <Text style={[styles.tableCol, { width: '35%' }]}>Name</Text>
                  <Text style={[styles.tableCol, { width: '25%' }]}>Reg No</Text>
                  <Text style={[styles.tableCol, { width: '30%' }]}>Fee Payment</Text>
                </View>
                {level.students.map((student, sIndex) => (
                  <View key={sIndex} style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '10%' }]}>{sIndex + 1}</Text>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '35%' }]}>{student.firstName} {student.lastName}</Text>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '25%' }]}>{student.regNo}</Text>
                    <Text style={[styles.tableCol, styles.tableCell, { width: '30%' }]}>{student.feePayment}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ViewCohort;

