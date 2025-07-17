"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import styles from "@/app/styles/cohorts/viewCohort/viewCohort.module.css";
import CardComponent from "@/app/components/card/CardComponent";
import LevelAddPopUp from "@/app/components/cohort/AddLevel";
import EditLevelForm from "@/app/components/cohort/editFormLevel";
import FormModal from "@/app/components/Form/FormModal";
import api from "@/app/lib/utils/axios";
import Loading from "@/app/components/Loading/Loading";

export default function ViewCohort() {
  const router = useRouter();
  const { id } = useParams();

  const [cohortData, setCohortData] = useState(null);
  const [levelsData, setLevelsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // popups
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState(null);

  // archive
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);

  useEffect(() => {
    fetchCohortData();
  }, [id]);

  const fetchCohortData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cohorts/${id}`);
      const { cohort, levels } = res.data;
      setCohortData(cohort);
      setLevelsData(levels || []);
    } catch (err) {
      console.error("Error fetching cohort data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLevel = async (levelData) => {
    try {
      const payload = {
        levelName: levelData.levelName,
        startDate: levelData.startDate,
        endDate: levelData.endDate,
        exam_dates: levelData.exam_dates || "",
        exam_quotation_number: levelData.exam_quotation_number,
        cohortId: cohortData.uuid,
        facilitators: (levelData.facilitators || []).map((f) => ({
          value: f.uuid,
          role: f.role,
        })),
      };
      const response = await api.post(`/levels`, payload);
      if ([200, 201].includes(response.status)) {
        await fetchCohortData();
      }
    } catch (err) {
      console.error("Error adding level:", err);
      alert("Failed to add level. Please try again.");
    } finally {
      setShowAddPopup(false);
    }
  };

  const handleUpdateLevel = async (levelData) => {
    try {
      const payload = {
        levelName: levelData.levelName,
        startDate: levelData.startDate,
        endDate: levelData.endDate,
        exam_dates: levelData.exam_dates || "",
        exam_quotation_number: levelData.exam_quotation_number || "",
        cohortId: cohortData.uuid,
      };
      const response = await api.patch(
        `/levels/${levelData.uuid}`,
        payload
      );
      if (response.status === 200) {
        await fetchCohortData();
        alert("Level updated successfully!");
      }
    } catch (err) {
      console.error("Error updating level:", err);
      alert("Failed to update level. Please try again.");
    } finally {
      setShowEditPopup(false);
      setLevelToEdit(null);
    }
  };

  const handleArchiveLevel = async (uuid, reason) => {
    try {
      await api.post(`/levels/${uuid}/archive`, { reason });
      // remove archived level from list
      setLevelsData((prev) => prev.filter((l) => l.uuid !== uuid));
      alert("Level archived.");
    } catch (err) {
      console.error("Archive failed:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to archive level.";
      alert(msg);
    } finally {
      setShowArchiveModal(false);
      setArchiveTarget(null);
    }
  };

  const openAddPopup = () => {
    setLevelToEdit(null);
    setShowAddPopup(true);
    setShowEditPopup(false);
  };

  const openEditPopup = async (summary) => {
    setLoading(true);
    try {
      const res = await api.get(`/levels/${summary.uuid}`);
      const data = res.data;
      if (!data || Array.isArray(data)) throw new Error("Invalid data");
      setLevelToEdit(data);
    } catch {
      setLevelToEdit(summary);
    } finally {
      setLoading(false);
      setShowEditPopup(true);
      setShowAddPopup(false);
    }
  };

  if (loading) return <Loading text="Loading cohort details..." />;
  if (!cohortData) return <p className="text-center">No cohort data available.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div className={styles.detailsRow}>
          <h1>{cohortData.cohortName}</h1>
          <p>
            Start Date: {new Date(cohortData.startDate).toLocaleDateString()}
          </p>
          <p>
            End Date: {new Date(cohortData.endDate).toLocaleDateString()}
          </p>
          <button onClick={openAddPopup} className={styles.buttons}>
            Add Level
          </button>
          <button
            onClick={async () => {
              const blob = await pdf(
                <CohortDetailsPDF cohortData={cohortData} />
              ).toBlob();
              window.open(URL.createObjectURL(blob));
            }}
            className={`${styles.cohortbtn} ${styles.cohortdownload}`}
          >
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
                href={`/student/dashboard/cohorts/${cohortData.uuid}/levels/${level.uuid}`}
                onUpdate={() => openEditPopup(level)}
                onArchive={() => {
                  setArchiveTarget(level);
                  setShowArchiveModal(true);
                }}
                showDropdown
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">
            No levels available for this cohort.
          </p>
        )}
      </div>

      {showAddPopup && (
        <LevelAddPopUp
          onClose={() => setShowAddPopup(false)}
          onSave={handleAddLevel}
          cohortStartDate={cohortData.startDate}
          cohortEndDate={cohortData.endDate}
          initialValues={null}
          cohortUuid={cohortData.uuid}
        />
      )}

      {showEditPopup && levelToEdit && (
        <EditLevelForm
          initialValues={levelToEdit}
          onClose={() => setShowEditPopup(false)}
          onSave={handleUpdateLevel}
          cohortStartDate={cohortData.startDate}
          cohortEndDate={cohortData.endDate}
          cohortId={cohortData.uuid}
        />
      )}

      {showArchiveModal && archiveTarget && (
        <FormModal
          title={`Archive "${archiveTarget.levelName}"`}
          fields={[
            {
              name: "reason",
              label: "Reason for archiving",
              type: "select",
              options: [
                { value: "No longer relevant", label: "No longer relevant" },
                { value: "Duplicate entry", label: "Duplicate entry" },
                { value: "Incorrect data", label: "Incorrect data" },
                { value: "Other", label: "Other" }
              ]
            },
          ]}
          initialValues={{ reason: "" }}
          onChange={() => {}}
          onSubmit={({ reason }) =>
            handleArchiveLevel(archiveTarget.uuid, reason)
          }
          onClose={() => {
            setShowArchiveModal(false);
            setArchiveTarget(null);
          }}
        />
      )}
    </div>
  );
}

// PDF generator remains unchanged...
const CohortDetailsPDF = ({ cohortData }) => {
  const stylesPDF = StyleSheet.create({
    page: { flexDirection: "column", backgroundColor: "#fff", padding: 20 },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    heading: { fontSize: 24, marginBottom: 15, fontWeight: "bold", textAlign: "center" },
    dateContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
    dateText: { fontSize: 12 },
    levelSection: { marginTop: 15, borderTop: 1, borderColor: "#bdc3c7", paddingTop: 10 },
    subheading: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
    text: { fontSize: 12, marginBottom: 5 },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bdc3c7",
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginTop: 10,
    },
    tableRow: { flexDirection: "row", borderBottomColor: "#bdc3c7", borderBottomWidth: 1 },
    tableCol: {
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderColor: "#bdc3c7",
      padding: 5,
    },
    tableHeader: { backgroundColor: "#34495e", color: "#ffffff" },
    tableCell: { fontSize: 10 },
  });

  return (
    <Document>
      <Page size="A4" style={stylesPDF.page}>
        <View style={stylesPDF.section}>
          <Text style={stylesPDF.heading}>{cohortData.cohortName}</Text>
          <View style={stylesPDF.dateContainer}>
            <Text style={stylesPDF.dateText}>
              Start Date: {new Date(cohortData.startDate).toLocaleDateString()}
            </Text>
            <Text style={stylesPDF.dateText}>
              End Date: {new Date(cohortData.endDate).toLocaleDateString()}
            </Text>
          </View>
          {cohortData.levels?.map((level, idx) => (
            <View key={idx} style={stylesPDF.levelSection}>
              <Text style={stylesPDF.subheading}>{level.levelName}</Text>
              <View style={stylesPDF.table}>
                <View style={[stylesPDF.tableRow, stylesPDF.tableHeader]}>
                  <Text style={[stylesPDF.tableCol, { width: "10%" }]}>No.</Text>
                  <Text style={[stylesPDF.tableCol, { width: "35%" }]}>Name</Text>
                  <Text style={[stylesPDF.tableCol, { width: "25%" }]}>Reg No</Text>
                  <Text style={[stylesPDF.tableCol, { width: "30%" }]}>Fee Payment</Text>
                </View>
                {level.students?.map((stu, i) => (
                  <View key={i} style={stylesPDF.tableRow}>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: "10%" }]}>
                      {i + 1}
                    </Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: "35%" }]}>
                      {stu.firstName} {stu.lastName}
                    </Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: "25%" }]}>
                      {stu.regNo}
                    </Text>
                    <Text style={[stylesPDF.tableCol, stylesPDF.tableCell, { width: "30%" }]}>
                      {stu.feePayment}
                    </Text>
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
