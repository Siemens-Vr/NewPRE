"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import styles from '@/app/styles/cohorts/viewCohort/viewCohort.module.css'
import LevelAddPopUp from '@/app/components/cohort/LevelAddPopUp';
import LZString from 'lz-string';
import { useRouter } from 'next/navigation';


import { config } from '/config';


const ViewCohort = () => {
  const router = useRouter();
  const [cohortsData, setCohortsData] = useState(null);
  const [levelsData, setLevelsData] = useState(null);
  
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    fetchCohortData();
  }, [id]);

  const handleLevelAdd = async (newLevelData) => {
    try {
      const response = await fetch(`${config.baseURL}/levels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLevelData),
      });
  
      if (response.ok) {
        await fetchCohortData(); // Refetch the cohort data after adding the new level
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to add new level:', errorData);
      }
    } catch (error) {
      console.error('Error adding new level:', error);
    }
  };
  
  // Separate function to refetch cohort data
  const fetchCohortData = async () => {
    try {
      if (id) { 
        const response = await fetch(`${config.baseURL}/cohorts/${id}`);
        const data = await response.json();
        // console.log(data)
        setCohortsData(data.cohort);
        setLevelsData(data.levels || [])

      }
    } catch (error) {
      console.error("Error fetching cohort data:", error);
    }
  };

  // console.log(cohortsData)


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
          levelsData.map((level) => (
            <div className={styles.card} key={level.uuid}>
              <h2 className={styles.levelName}>{level.levelName}</h2>
              <p className={styles.levelDetails}>Number of Students: {level.students ? level.students.length : 0}</p>
              <p className={styles.levelDetails}>Number of Facilitators: {level.facilitators ? level.facilitators.length : 0}</p>
              <div className={styles.cardFooter}>
                <Link className={`${styles.button} ${styles.view}`} href={`/pages/student/dashboard/cohorts/${cohortsData.uuid}/levels/${level.uuid}`}>
                  View More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-lg'>No levels available for this cohort.</p> // Message when no levels are available
        )}
      </div>
      {showPopup && (
        <LevelAddPopUp
          cohortId={cohortsData.uuid}
          onClose={() => setShowPopup(false)}
          onAdd={handleLevelAdd}
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

