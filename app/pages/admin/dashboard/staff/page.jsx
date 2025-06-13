'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams }                from 'next/navigation';
import Toolbar                            from '@/app/components/toolbar/Toolbar';
import Table                              from '@/app/components/table/Table';
import Pagination                         from '@/app/components/pagination/Pagination';
import AddStaffPage                       from '@/app/components/staff/addStaff';
import api                                from '@/app/lib/utils/axios';
import { MdAdd, MdFilterList, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import styles                             from '@/app/styles/staff/staff.module.css';
import Swal                               from 'sweetalert2';
import Link                               from 'next/link';

const ROWS_PER_PAGE = 10;

export default function StaffPage() {
  const [staffs,    setStaffs]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [adding,    setAdding]    = useState(false);
  const [sortKey,   setSortKey]   = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Grab ?q= and ?page= from URL
  const searchParams = useSearchParams();
  const q    = searchParams.get('q')    || '';
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  // Fetch staff list whenever q changes
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const url = `/staffs${q ? `?q=${encodeURIComponent(q)}` : ''}`;
        const res = await api.get(url);
        setStaffs(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load staff list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, [q]);

  // Sort in-memory
  const sortedStaffs = useMemo(() => {
    if (!sortKey) return staffs;
    return [...staffs].sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [staffs, sortKey, sortOrder]);

  // Slice by page from URL
  const paginatedStaffs = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return sortedStaffs.slice(start, start + ROWS_PER_PAGE);
  }, [sortedStaffs, page]);

  // Handle header click toggling
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Column definitions
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: row => {
        const first = row.firstName?.trim();
        const last  = row.lastName?.trim();
        if (!first && !last) return '—';
        return [first, last].filter(Boolean).join(' ');
      }
    },
    { key: 'email',       label: 'Email',    sortable: true },
    { key: 'gender',      label: 'Gender' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'idNumber',    label: 'ID No' },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div className={styles.actionGroup}>
          <Link href={`/pages/staff/${row.uuid}/dashboard`}>
            <button className="btn-primary" title="View">
              <MdVisibility size={18} />
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <Toolbar
        placeholder="Search staff..."
        buttons={[
          {
            label: 'Filter',
            onClick: () => {/* open filter UI */},
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
        <p className={styles.loader}>Loading staff members…</p>
      ) : (
        <>
          {paginatedStaffs.length > 0 ? (
            <Table
              columns={columns}
              data={paginatedStaffs}
              onSort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          ) : (
            <p className={styles.noData}>No staff found.</p>
          )}

          <Pagination
            count={sortedStaffs.length}
            itemsPerPage={ROWS_PER_PAGE}
          />
        </>
      )}

      {adding && <AddStaffPage onClose={() => setAdding(false)} />}
    </div>
  );
}
