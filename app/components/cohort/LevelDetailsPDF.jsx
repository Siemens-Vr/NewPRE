import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const LevelDetailsPDF = ({ levelData }) => {
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
    infoContainer: {
      marginBottom: 15,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    infoValue: {
      fontSize: 14,
      color: '#2c3e50',
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
    levelSection: {
      marginTop: 15,
      borderTop: 1,
      borderColor: '#bdc3c7',
      paddingTop: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{levelData.levelName}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start Date:</Text>
              <Text style={styles.infoValue}>{new Date(levelData.startDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End Date:</Text>
              <Text style={styles.infoValue}>{new Date(levelData.endDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Exam Date:</Text>
              <Text style={styles.infoValue}>{new Date(levelData.exam_dates).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Exam Quotation Number:</Text>
              <Text style={styles.infoValue}>{levelData.exam_quotation_number}</Text>
            </View>
          </View>
          <Text style={styles.subheading}>Facilitators</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCol, { width: '10%' }]}>No.</Text>
              <Text style={[styles.tableCol, { width: '45%' }]}>Name</Text>
              <Text style={[styles.tableCol, { width: '45%' }]}>Email</Text>
            </View>
            {levelData.facilitators.map((facilitator, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '45%' }]}>{facilitator.firstName} {facilitator.lastName}</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '45%' }]}>{facilitator.email}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.subheading}>Students</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCol, { width: '10%' }]}>No.</Text>
              <Text style={[styles.tableCol, { width: '35%' }]}>Name</Text>
              <Text style={[styles.tableCol, { width: '25%' }]}>Reg No</Text>
              <Text style={[styles.tableCol, { width: '30%' }]}>Fee Payment</Text>
            </View>
            {levelData.students.map((student, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '35%' }]}>{student.firstName} {student.lastName}</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '25%' }]}>{student.regNo}</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '30%' }]}>{student.feePayment}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LevelDetailsPDF;
