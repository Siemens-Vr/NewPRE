"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import styles from '@/app/styles/cohorts/viewCohort/viewCohort.module.css';
import CardComponent from '@/app/components/card/CardComponents';
import LevelAddPopUp from '@/app/components/cohort/AddLevel';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import Loading from '@/app/components/Loading/Loading';

const ViewCohort = () => {
  const router = useRouter();
  const { id } = useParams();

  const [cohortsData, setCohortsData] = useState(null);
  const [levelsData, setLevelsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchCohortData();
  }, [id]);

  const fetchCohortData = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await api.get(`/cohorts/${id}`);
        setCohortsData(response.data.cohort);
        setLevelsData(response.data.levels || []);
      }
    } catch (error) {
      console.error('Error fetching cohort data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelAdd = async levelData => {
    try {
      if (editMode && levelToEdit) {
        const response = await api.patch(`/levels/${levelToEdit.uuid}/update`, levelData);
        if (response.status === 200) await fetchCohortData();
      } else {
        const response = await api.post(`/levels`, levelData);
        if ([200, 201].includes(response.status)) await fetchCohortData();
      }
    } catch (error) {
      console.error('Error adding/updating level:', error);
    } finally {
      setShowPopup(false);
      setEditMode(false);
      setLevelToEdit(null);
    }
  };

  const handleEditLevel = level => {
    setLevelToEdit(level);
    setEditMode(true);
    setShowPopup(true);
  };

  const handleDeleteLevel = async levelUuid => {
    if (!window.confirm('Are you sure you want to delete this level?')) return;
    try {
      const response = await api.delete(`/levels/${levelUuid}`);
      if (response.status === 200) {
        setLevelsData(prev => prev.filter(l => l.uuid !== levelUuid));
      }
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cohortsData) return;
    const blob = await pdf(<CohortDetailsPDF cohortData={cohortsData} />).toBlob();
    window.open(URL.createObjectURL(blob));
  };

  if (loading) {
    return <Loading text="Loading cohort details..." />;
  }

  if (!cohortsData) {
    return <p className="text-center">No cohort data available.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div className={styles.detailsRow}>
          <h1>{cohortsData.cohortName}</h1>
          <p>Start Date: {new Date(cohortsData.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(cohortsData.endDate).toLocaleDateString()}</p>
          <button onClick={() => setShowPopup(true)} className={styles.buttons}>
            Add Level
          </button>
          <button
            onClick={handleDownloadPDF}
            className={`${styles.cohortbtn} ${styles.cohortdownload}`}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className={styles.levelsContainer}>
        {levelsData.length > 0 ? (
          <div className="card-grid">
            {levelsData.map(level => (
              <CardComponent
                key={level.uuid}
                title={level.levelName}
                details={{
                  'Number of Students': level.students?.length || 0,
                  'Number of Facilitators': level.facilitators?.length || 0
                }}
                href={`/pages/student/dashboard/cohorts/${cohortsData.uuid}/levels/${level.uuid}`}
                onUpdate={() => handleEditLevel(level)}
                onDelete={() => handleDeleteLevel(level.uuid)}
                showDropdown={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">
            No levels available for this cohort.
          </p>
        )}
      </div>

      {showPopup && (
        <LevelAddPopUp
          onClose={() => setShowPopup(false)}
          onSave={handleLevelAdd}
          cohortStartDate={cohortsData.startDate}
          cohortEndDate={cohortsData.endDate}
          initialValues={editMode ? levelToEdit : null}
        />
      )}
    </div>
  );
};

const CohortDetailsPDF = ({ cohortData }) => {
  const stylesPDF = StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#fff', padding: 20 },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    heading: { fontSize: 24, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    dateText: { fontSize: 12 },
    levelSection: { marginTop: 15, borderTop: 1, borderColor: '#bdc3c7', paddingTop: 10 },
    subheading: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
    text: { fontSize: 12, marginBottom: 5 },
    table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bdc3c7', borderRightWidth: 0, borderBottomWidth: 0, marginTop: 10 },
    tableRow: { flexDirection: 'row', borderBottomColor: '#bdc3c7', borderBottomWidth: 1 },
    tableCol: { borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#bdc3c7', padding: 5 },
    tableHeader: { backgroundColor: '#34495e', color: '#ffffff' },
    tableCell: { fontSize: 10 }
  });

  return (
    <Document>
      <Page size="A4" style={stylesPDF.page}>
        <View style={stylesPDF.section}>
          <Text style={stylesPDF.heading}>{cohortData.cohortName}</Text>
          <View style={stylesPDF.dateContainer}>
            <Text style={stylesPDF.dateText}>Start Date: {new Date(cohortData.startDate).toLocaleDateString()}</Text>
            <Text style={stylesPDF.dateText}>End Date: {new Date(cohortData.endDate).toLocaleDateString()}</Text>
          </View>
          {cohortData.levels.map((level, index) => (
            <View key={index} style={stylesPDF.levelSection}>
              <Text style={stylesPDF.subheading}>{level.levelName}</Text>
              <View style={stylesPDF.table}>
                <View style={[stylesPDF.tableRow, stylesPDF.tableHeader]}>
                  <Text style={[stylesPDF.tableCol, { width: '10%' }]}>No.</Text>
                  <Text style={[stylesPDF.tableCol, { width: '35%' }]}>Name</Text>
                  <Text style={[stylesPDF.tableCol, { width: '25%' }]}>Reg No</Text>
                  <Text style={[stylesPDF.tableCol, { width: '30%' }]}>Fee Payment</Text>
                </View>
                {level.students.map((student, sIndex) => (
                  <View key={sIndex} style={stylesPDF.tableRow}>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: '10%' }]}>{sIndex + 1}</Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: '35%' }]}>{student.firstName} {student.lastName}</Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: '25%' }]}>{student.regNo}</Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: '30%' }]}>{student.feePayment}</Text>
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
