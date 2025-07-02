"use client";

import { useState, useEffect, useMemo } from 'react';
import Pagination from '@/app/components/pagination/pagination';
import Toolbar from '@/app/components/toolbar/Toolbar';
import Table from '@/app/components/table/Table';
import AddFacilitatorPage from "@/app/pages/student/dashboard/facilitators/add/page";
import { MdAdd, MdFilterList } from 'react-icons/md';
import api from '@/app/lib/utils/axios';
import Swal from 'sweetalert2';
import styles from '@/app/styles/students/addStudent/facilitators.module.css';
import Loading from '@/app/components/Loading/Loading';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

const ROWS_PER_PAGE = 10;

const FacilitatorsPage = () => {
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  useEffect(() => {
    const fetchFacilitators = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/facilitators${q ? `?q=${q}` : ''}`);
        setFacilitators(Array.isArray(response.data) ? response.data : []);

      } catch (error) {
        console.error('Error fetching facilitators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilitators();
  }, [q]);

  const handleDeleteFacilitator = async (uuid, fullName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${fullName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/facilitators/${uuid}/delete`);
        setFacilitators(prev => prev.filter(f => f.uuid !== uuid));
        Swal.fire('Deleted!', `${fullName} has been deleted.`, 'success');
      } catch (error) {
        console.error('Error deleting facilitator:', error);
        Swal.fire('Error', 'Could not delete the facilitator.', 'error');
      }
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

 const sortedFacilitators = useMemo(() => {
  const data = Array.isArray(facilitators) ? facilitators : [];
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const aVal = (a[sortKey] ?? '').toString().toLowerCase();
    const bVal = (b[sortKey] ?? '').toString().toLowerCase();
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}, [facilitators, sortKey, sortOrder]);


  const paginatedFacilitators = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return sortedFacilitators.slice(start, start + ROWS_PER_PAGE);
  }, [sortedFacilitators, page]);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: row => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNo', label: 'Phone', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div className={styles.buttons}>
          <Link href={`/pages/student/dashboard/facilitators/${row.uuid}`}>
            <button className={`${styles.button} ${styles.view}`}>View</button>
          </Link>
          <button
            className={`${styles.button} ${styles.delete}`}
            onClick={() => handleDeleteFacilitator(row.uuid, `${row.firstName} ${row.lastName}`)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <Toolbar
        placeholder="Search facilitator..."
        buttons={[
          {
            label: 'Filter',
            onClick: () => {},
            variant: 'secondary',
            icon: MdFilterList
          },
          {
            label: 'Add New',
            onClick: () => setAdding(true),
            variant: 'primary',
            icon: MdAdd
          }
        ]}
      />

      {loading ? (
        <Loading />
      ) : paginatedFacilitators.length > 0 ? (
        <Table
          columns={columns}
          data={paginatedFacilitators}
          onSort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      ) : (
        <p className={styles.noData}>No facilitators found.</p>
      )}

      <Pagination
        count={sortedFacilitators.length}
        itemsPerPage={ROWS_PER_PAGE}
        onPageChange={(p) => setPage(p)}
      />

      {adding && <AddFacilitatorPage onClose={() => setAdding(false)} />}
    </div>
  );
};

export default FacilitatorsPage;
