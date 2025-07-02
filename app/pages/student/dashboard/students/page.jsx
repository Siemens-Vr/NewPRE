
"use client";

import api from '@/app/lib/utils/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import UpdateStudent from "@/app/components/student/UpdateStudent";
import Pagination from '@/app/components/pagination/pagination';
import styles from '@/app/styles/students/Student.module.css';
import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import AddStudentPage from "@/app/pages/student/dashboard/students/add/page";
import Toolbar from '@/app/components/toolbar/Toolbar';
import Table from '@/app/components/table/Table';
import { MdAdd, MdFilterList, MdVisibility, MdEdit, MdDelete, MdDownload  } from 'react-icons/md';
import Loading from '@/app/components/Loading/Loading';
import { useParams } from 'next/navigation';



const ROWS_PER_PAGE = 10;
const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  // const [popupStudentId, setPopupStudentId] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const q = searchParams.get('q') || '';
    const params = useParams();
    const { uuid, id } = params;
  // const page = searchParams.get('page') || '0';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const url = `/students${q ? `?q=${encodeURIComponent(q)}` : ''}`;
        // console.log(url);
        const res = await api.get(url);
       setStudents(res.data.content);
setFilteredStudents(res.data.content);
        // console.log("data:",res.data);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load students list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [q]);

  const fetchAllStudents = async () => {
    const allStudents = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      try {
        const url = `/students?page=${page}`;
        const response = await api.get(url);
        const data = await response.data;
        if (response.statusText === 'OK') {
          const { content, totalPages: fetchedTotalPages } = data;
          allStudents.push(...content);
          totalPages = fetchedTotalPages;
          page += 1;
        } else {
          console.error('Error fetching students:', data);
          showErrorAlert(data.message || 'Failed to fetch students. Please try again.');
          break;
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        showErrorAlert('Failed to fetch students. Please try again.');
        break;
      }
    }

    return allStudents;
  };

  const handleAddNewClick = () => {
    setShowAddNewPopup(true);
};
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  const handleDownloadPDF = async () => {
    const allStudents = await fetchAllStudents();
    if (allStudents.length > 0) {
      const blob = await pdf(<StudentListPDF students={allStudents} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      showErrorAlert('No students available to download.');
    }
  };
  const handleDeleteStudent = async (uuid, fullName, row) => {
    const confirm = await Swal.fire({
      title: `Delete ${fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/students/${row.uuid}/delete`);
        setStudents((prev) => prev.filter((s) => s.uuid !== uuid));
        Swal.fire('Deleted!', `${fullName} has been removed.`, 'success');
      } catch (err) {
        Swal.fire('Error', 'Something went wrong', 'error');
        console.log(err);
      }
    }
  };
const handleUpdateStudent = (student) => {
  setEditingStudent(student);
};

  const sortedStudents = useMemo(() => {
    if (!Array.isArray(filteredStudents)) return [];
  
    if (!sortKey) return filteredStudents;
  
    return [...filteredStudents].sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortKey, sortOrder]);
  

  const paginatedStudents = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return Array.isArray(sortedStudents)
      ? sortedStudents.slice(start, start + ROWS_PER_PAGE)
      : [];
  }, [sortedStudents, page]);

  const dropdownItemStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

  
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

    { key: 'phone', label: 'Phone' },
{
  key: 'actions',
  label: 'Actions',
  render: row => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const menu = document.getElementById(`dropdown-${row.uuid}`);
          if (menu) {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
        }}
        title="More"
      >
        ⋮
      </button>

      <div
        id={`dropdown-${row.uuid}`}
        style={{
          display: 'none',
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          zIndex: 10,
          minWidth: '120px',
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <button
              style={dropdownItemStyle}
              onClick={() => window.location.href = `/pages/student/dashboard/students/${row.uuid}/`}
            >
              View
            </button>
          </li>
          <li>
            <button
              style={dropdownItemStyle}
              onClick={() => {handleUpdateStudent(row);
        }}
            >   
              Update
            </button>
          </li>
          <li>
            <button
              style={{ ...dropdownItemStyle, color: 'red' }}
              onClick={() => handleDeleteStudent(row.uuid, row.fullName, row)}
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}


  ];
  return (
    <div className={styles.container}>
      <Toolbar
        placeholder="Search student..."
        buttons={[
          {
            label: 'Filter',
            onClick: () => {}, 
            variant: 'secondary',
            icon: MdFilterList
          },
          {
            label: 'Download PDF',
            onClick: handleDownloadPDF, 
            variant: 'primary',
            icon: MdDownload
          },
           {
            label: 'Add New',
            onClick: () => setAdding(true),
            variant: 'primary',
            icon: MdAdd
          },
        ]}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          {paginatedStudents.length > 0 ? (
             <Table
              columns={columns}
              data={paginatedStudents}
              onSort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          ) : (
            <p className={styles.noData}>No students found.</p>
          )}

          <Pagination
            count={sortedStudents.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {adding && <AddStudentPage onClose={() => setAdding(false)} />}
        {editingStudent && (
<UpdateStudent
  uuid={editingStudent.uuid}
  onClose={() => setEditingStudent(null)}
/>

)}


    </div>
  );
};
const StudentListPDF = ({students}) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: 20,
    },
    section: {
      margin: 5,
      padding: 5,
      flexGrow: 1,
    },
    heading: {
      fontSize: 20,
      marginBottom: 15,
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    tableContainer: {
      flexGrow: 1,
      overflowY: 'scroll',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bdc3c7',
      borderRightWidth: 0,
      borderBottomWidth: 0,
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
      fontSize: 10,
    },
    tableHeaderText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 10,
    },
    tableCell: {
      fontSize: 8,
      color: '#2c3e50',
    },
    oddRow: {
      backgroundColor: '#f9f9f9',
    },
    evenRow: {
      backgroundColor: '#ffffff',
    },
    numberCol: {
      width: '3%',
    },
    nameCol: {
      width: '14%',
    },
    standardCol: {
      width: '10%',
    },
    longCol: {
      width: '13%',
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={styles.heading}>Siemens Centre Student List</Text>
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.numberCol]}>#</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.nameCol]}>First Name</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.nameCol]}>Last Name</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.longCol]}>Email</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Phone</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Reg No</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>KCSE No</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Gender</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Fee Payment</Text>
                <Text style={[styles.tableCol, styles.tableHeaderText, styles.standardCol]}>Exam Results</Text>
              </View>
              {students.map((student, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text style={[styles.tableCol, styles.tableCell, styles.numberCol]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.nameCol]}>{student.firstName}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.nameCol]}>{student.lastName}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.longCol]}>{student.email}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.phone}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.regNo}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.kcseNo}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.gender}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.feePayment}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, styles.standardCol]}>{student.examResults}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default StudentsPage;
