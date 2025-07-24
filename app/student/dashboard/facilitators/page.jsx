"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/pagination/pagination';
import Toolbar from '@/app/components/ToolBar/ToolBar';
import Table from '@/app/components/table/Table';
import AddFacilitatorPage from "@/app/student/dashboard/facilitators/add/page";
import { MdAdd, MdFilterList } from 'react-icons/md';
import api from '@/app/lib/utils/axios';
import Swal from 'sweetalert2';
import styles from '@/app/styles/students/addStudent/facilitators.module.css';
import Loading from '@/app/components/Loading/Loading';
import EmptyState from '@/app/components/EmptyState/EmptyState';
import Link from "next/link";

const ROWS_PER_PAGE = 10;

export default function FacilitatorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchFacilitators = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/facilitators${q ? `?q=${q}` : ''}`);
        setFacilitators(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching facilitators:', error);
        Swal.fire('Error', 'Failed to load facilitators', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFacilitators();
  }, [q]);

  const handleDeleteFacilitator = async (uuid, fullName, e) => {
    e.stopPropagation();
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

  const sorted = useMemo(() => {
    const data = [...facilitators];
    if (!sortKey) return data;
    return data.sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [facilitators, sortKey, sortOrder]);

  const pageData = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return sorted.slice(start, start + ROWS_PER_PAGE);
  }, [sorted, page]);

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
          <button
            className={`${styles.button} ${styles.view}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/student/dashboard/facilitators/${row.uuid}`);
            }}
          >
            View
          </button>
          <button
            className={`${styles.button} ${styles.delete}`}
            onClick={(e) => handleDeleteFacilitator(row.uuid, `${row.firstName} ${row.lastName}`, e)}
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
        <Loading text="Loading facilitators..." />
      ) : sorted.length > 0 ? (
        <>
          <Table
            columns={columns}
            data={pageData}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onRowClick={(row) =>
              router.push(`/student/dashboard/facilitators/${row.uuid}`)
            }
          />
          <Pagination
            count={sorted.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          illustration="/undraw_no-data_ig65.svg"
          message="No facilitators found"
          details="You haven’t added any facilitators yet. Start by adding one now."
          actionLabel="Add Facilitator"
          onAction={() => setAdding(true)}
        />
      )}

      {adding && <AddFacilitatorPage onClose={() => setAdding(false)} />}
    </div>
  );
}
