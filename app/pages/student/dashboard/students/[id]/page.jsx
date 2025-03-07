"use client";
import styles from '@/app/styles/students/singleStudent/sStudent.module.css';
import AddLevelPopup  from '@/app/components/student/AddLevelPopUp'
import { useState, useEffect } from "react";
import { config } from "/config";

const SinstudentPage = ({ params }) => {
  const [student, setStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLevels, setEditedLevels] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { id } = params;

  const fetchStudent = async () => {
    try {
      const response = await fetch(`${config.baseURL}/students/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStudent(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        regNo: data.regNo,
        kcseNo: data.kcseNo,
        gender: data.gender,
      });
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };
  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes in exam results and fee paid
  const handleLevelChange = (studentLevelUuid, field, value) => {
    setEditedLevels((prev) => ({
      ...prev,
      [studentLevelUuid]: {
        ...prev[studentLevelUuid],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/students/${id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update student information");
      }

      const updatedStudent = await response.json();
      setStudent(updatedStudent);
      alert("Student information updated successfully!");
      fetchStudent();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleUpdateLevel = async (studentLevelUuid) => {
    const updatedData = editedLevels[studentLevelUuid];

    if (!updatedData) {
      return;
    }

    try {
      // Patch the StudentLevels record directly using its UUID
      const response = await fetch(`${config.baseURL}/students/${studentLevelUuid}/updateLevel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fee: updatedData.fee,
          examResults: updatedData.examResults,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update level information");
      }

      const updatedStudentLevel = await response.json();

      // Update the student data with the new level information
      setStudent((prevStudent) => ({
        ...prevStudent,
        levels: prevStudent.levels.map((level) =>
          level.StudentLevels.uuid === studentLevelUuid
            ? { ...level, StudentLevels: updatedStudentLevel }
            : level
        ),
      }));

      alert("Level information updated successfully!");
      fetchStudent(); // Optionally refetch the student data if needed
    } catch (error) {
      console.error("Error updating level:", error);
      alert(error.message);
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <div className={styles.contentContainer}>
        <div className={styles.avatarContainer}>
          <img
            src="/noavatar.png"
            alt={`${student.firstName} ${student.lastName}`}
            className={styles.avatar}
          />
          <div className={styles.avatarName}>
            <h3 className={styles.name}>
              {student.firstName} {student.lastName}
            </h3>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleUpdate}>
            <div className={styles.basic}>
              <div className={styles.infoImg}>
                <img
                  src="/noavatar.png"
                  alt={`${student.firstName} ${student.lastName}`}
                />
                <div className={styles.info}>
                  <h1>Basic Information</h1>
                  <p>Update Profile Information</p>
                </div>
              </div>
              <div className={styles.end}>
                <button type="submit">Update</button>
              </div>
            </div>
            <div className={styles.form}>
              {/* Form fields */}
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Registration Number</label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>KCSE Number</label>
                <input
                  type="text"
                  name="kcseNo"
                  value={formData.kcseNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        {/* Add Level Popup Modal */}
        {isModalOpen && (
          <AddLevelPopup
            studentUuid={student.uuid}
            onClose={closeModal}
          />
        )}

        {/* Levels Section */}
        <div className={styles.levelsSection}>
          <div className={styles.levelsHeader}>
            <h1>Course Information</h1>
            <button className={styles.addLevelButton} onClick={openModal}>
              Add Level
            </button>
          </div>

          {student.levels && student.levels.length > 0 ? (
            student.levels.map((level) => (
              <div className={styles.levelsContainer} key={level.uuid}>
                <div className={styles.infoTitle}>
                  <h2 className={styles.levelName}>{level.levelName}</h2>
                  <p>Fee Amount: {level.feeAmount}</p>
                  <p>Balance: {level.balance}</p>
                  <p className={styles.status}>
                    Status:
                    <span
                      className={
                        level.StudentLevels.examResults
                          ? styles.doneStatus
                          : styles.activeStatus
                      }
                    ></span>
                  </p>
                  <button
                    className={styles.updateButton}
                    onClick={() => handleUpdateLevel(level.StudentLevels.uuid)}
                  >
                    Update
                  </button>
                </div>
                <div className={styles.infoGrid}>
                  <div>
                    <strong>Cohort</strong>{" "}
                    {level.Cohort ? level.Cohort.cohortName : "N/A"}
                  </div>
                  <div>
                    <strong>Start Date</strong>{" "}
                    {new Date(level.Cohort.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date</strong>{" "}
                    {new Date(level.Cohort.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Level Name</strong> {level.levelName}
                  </div>
                  <div>
                    <strong>Level Start Date</strong>{" "}
                    {new Date(level.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Level End Date</strong>{" "}
                    {new Date(level.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Level Exam Date</strong>{" "}
                    {new Date(level.exam_dates).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Exam Results:</strong>
                    <select
                      value={
                        editedLevels[level.StudentLevels.uuid]?.examResults ||
                        level.StudentLevels.examResults
                      }
                      onChange={(e) =>
                        handleLevelChange(
                          level.StudentLevels.uuid,
                          "examResults",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Exam Result</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                  <div>
                    <strong>Fee Paid</strong>
                    <input
                      type="number"
                      value={
                        editedLevels[level.StudentLevels.uuid]?.fee ||
                        level?.StudentLevels?.fee ||
                        0
                      }
                      onChange={(e) =>
                        handleLevelChange(
                          level.StudentLevels.uuid,
                          "fee",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Course Information Available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinstudentPage;
