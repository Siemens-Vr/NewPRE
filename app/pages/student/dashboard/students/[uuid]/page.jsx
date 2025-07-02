
"use client";
import styles from '@/app/styles/students/singleStudent/sStudent.module.css';
import AddLevelPopup from '@/app/components/student/AddLevelPopUp';
import React, { useState, useEffect, useMemo } from "react";
import { config } from "/config";
import Image from "next/image";
import UpdateStudent from "@/app/components/student/UpdateStudent";
import LevelAddPopUp from "@/app/components/cohort/LevelAddPopUp";
import api from "@/app/lib/utils/axios";
import Loading from '@/app/components/Loading/Loading';
import Table from '@/app/components/table/Table';
import Pagination from '@/app/components/pagination/pagination';

const ROWS_PER_PAGE = 10;
const SinstudentPage = ({ params }) => {
  const [student, setStudent] = useState(null);
  const { uuid } = params;
  const [showUpdate, setShowUpdate] = useState(false);
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [uuid]);

  const handleshowUpdate = () => {
    setShowUpdate(true);
  };
  const  handleshow= () => {
    setShowUpdate(false);
  };

 const fetchStudent = async () => {
  try {
    const response = await api.get(`/students/${uuid}`);
    setStudent(response.data); 
    setFilteredStudent([response.data]); 
    // console.log("Fetched student:", response.data);
  } catch (error) {
    console.error("Error fetching student:", error);
    Swal.fire('Error', 'Failed to fetch student details', 'error');
  }
  
};
const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  const sortedStudent = useMemo(() => {
    if (!Array.isArray(filteredStudent)) return [];

    if (!sortKey) return filteredStudent;

    return [...filteredStudent].sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudent, sortKey, sortOrder]);
  const paginatedStudent = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return Array.isArray(sortedStudent)
      ? sortedStudent.slice(start, start + ROWS_PER_PAGE)
      : [];
  }, [sortedStudent, page]);
const columns = [
     {
      key: 'no',
      label: 'No',
      render: (_row, idx) => idx + 1 + page * ROWS_PER_PAGE
    },
    { key: 'regNo',    label: 'Registration No',  sortable: true  },
    {
      key: 'name',
      label: ' Full Name',
      sortable: true,
      render: row => {
        const first = row.firstName?.trim();
        const last  = row.lastName?.trim();
        if (!first && !last) return '—';
        return [first, last].filter(Boolean).join(' ');
      }
    },
    {
      key: 'cohorts',
      label: 'Cohorts',
      render: row => row.cohorts?.map(cohort => cohort.cohortName).join(", ") || "N/A"
    },
    {
      key: 'levels',
      label: 'Levels',
      render: row => row.levels?.map(level => level.levelName).join(", ") || "N/A"
    },
    {
      key: 'totalFeePaid',
      label: 'Total Fee Paid',
      render: row => `KES ${row.levels?.reduce((sum, level) => sum + (level?.StudentLevels?.fee || 0), 0) || 0}`
    },
    {
      key: 'status',
      label: 'Status',
      render: row => row.isActive ? "Active" : "Inactive"
    }
  ]

  if (!student) return <Loading />;

  return (
      <div className={styles.container}>
        {/* <div className={styles.header}>
          <h1>Welcome {student.firstName} </h1>
          <div className={styles.headerButtons}>
           <h2>Total fee paid : {student.levels?.reduce((sum, level) => sum + (level?.StudentLevels?.fee || 0), 0)}</h2>
           <h2>Course level : {student.levels?.[0]?.levelName || "N/A"}</h2>
          </div>
        </div> */}

        <div className={styles.profileSection}>
          {/* <div className={styles.profileCard}>
            <>
            <Image
                className={styles.profileImage}
                src="/noavatar.png"
                alt=""
                width="50"
                height="50"
            />
            <div>
            <p><strong>Full Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Reg No:</strong> {student.regNo}</p>
            <p><strong>Kcse No:</strong> {student.kcseNo}</p>
          </div>

            </>
          </div> */}
          <div className={styles.detailsCard}>
            <>
             
            <div className={styles.detailsHeader}>
              <h3 className={styles.title}>Personal Details</h3>
              <button onClick={handleshowUpdate} className={styles.updateButton}>
                Update
              </button>
            </div>
             <Image
                className={styles.profileImage}
                src="/noavatar.png"
                alt=""
                width="50"
                height="50"
            />
            <p><strong>Full Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Reg No:</strong> {student.regNo}</p>
            <p><strong>Kcse No:</strong> {student.kcseNo}</p>
            </>
          </div>

          {showUpdate && <UpdateStudent onClose={handleshow} />}
      </div>
        <div>
             {loading ? (
                  <Loading />
                ) : (
           <>
          {paginatedStudent.length > 0 ? (
             <Table
              columns={columns}
              data={paginatedStudent}
              onSort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          ) : (
            <p className={styles.noData}>No students information found.</p>
          )}

          <Pagination
            count={sortedStudent.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChange={(p) => setPage(p)}
          />
        </>

        )}  
         </div>
         {/* <div className={styles.courseCard}>
  <div className={styles.cardHeader}>
   
    <span
      className={`${styles.statusDot} ${
        student.isActive ? styles.active : styles.inactive
      }`}
    />
    <h2 className={styles.cardTitle}>
      {student.firstName} {student.lastName}
    </h2>
  </div>
  <div className={styles.cardBody}>
    <p>
      <strong>Cohort:</strong>{" "}
      {student.cohort?.name ?? "Not assigned"}
    </p>
    <p>
      <strong>Level:</strong>{" "}
      {student.levels?.[0]?.levelName ?? "N/A"}
    </p>
  </div>
</div> */}
      </div>
  );
};

export default SinstudentPage;
