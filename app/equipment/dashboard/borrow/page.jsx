'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Toolbar from '@/app/components/ToolBar/ToolBar';
import Table from '@/app/components/table/Table';
import Pagination from '@/app/components/pagination/pagination';
import AddBorrow from '@/app/components/Borrow/Borrow';
import Loading from '@/app/components/Loading/Loading';
import api from '@/app/lib/utils/axios';
import EmptyState from '@/app/components/EmptyState/EmptyState';
import { MdSearch, MdAdd } from 'react-icons/md';
import Link from 'next/link';
import styles from "@/app/styles/borrow/borrow.module.css"

const ROWS_PER_PAGE = 10;

export default function BorrowedComponentPage(onClose) {
  const searchParams = useSearchParams();
  const router  = useRouter();
  const q = searchParams.get('q') ?? '';
  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  // fetch on mount or q change
  useEffect(() => {
    setLoading(true);
    api.get(`/borrow${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  // paginate
  const paginated = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return data.slice(start, start + ROWS_PER_PAGE);
  }, [data, page]);

  // Table columns
  const columns = [
    {
      key: 'no',
      label: 'No.',
      render: (_row, idx) => idx + 1 + page * ROWS_PER_PAGE
    },
    {
      key: 'componentName',
      label: 'Component',
      render: row => row.component.componentName
    },
    { key: 'fullName', label: 'Name' },
    { key: 'departmentName', label: 'Department' },
    {
      key: 'dateOfIssue',
      label: 'Issue Date',
      render: row => row.dateOfIssue.split('T')[0]
    },
    
    {
      key: 'expectedReturnDate',
      label: 'Expected Return Date',
      render: row => row.expectedReturnDate.split('T')[0]
    },
    {
      key: 'status',
      label: 'Status',
      render: row => row.status ? 'Returned' : 'Not Returned'
    },
    {
      key: 'actions',
      label: 'Action',
      render: row => (
        <div>
        <button
          className={styles.button}
          onClick={() => {
            // console.log("I have been clicked")
            // console.log(row)
            setSelected(row);
            setShowAdd(true);
          }}
        >
          Update
        </button>
          <Link href={`/equipments/borrow/${row.uuid}`}>
        <button
          className={styles.button}
          
        >
          view
        </button>

        </Link>

        </div>
      )
    }
  ];

  // handle search via Toolbar
  const handleSearch = (searchValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', searchValue);
    params.set('page', 0);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div >
      <Toolbar
        placeholder="Search by Component..."
        onSearch={handleSearch}
        buttons={[
          {
            label: 'Borrow',
            onClick: () => setShowAdd(true),
            variant: 'primary',
            icon: MdAdd
          }
        ]}
      />

      {loading
        ? <Loading text="Loading borrows..." />
        : data.length > 0
          ? <Table columns={columns} data={paginated} />
          :  (
        <EmptyState
          illustration="/undraw_no-data_ig65.svg"
          message="No borrowing records found"
          details="You haven’t borrowed anything yet. Start by borrowing a component now."
          actionLabel="Start a Borrow Request"
          onAction={() => setShowAdd(true)}
        />
      )
      }

      {!!data.length && (
        <Pagination
          count={data.length}
          itemsPerPage={ROWS_PER_PAGE}
        />
      )}

      {showAdd && (
            <AddBorrow
        initialData={selected}
        onClose={() => {
          setShowAdd(false);
          setSelected(null); // Clear the selected data on close
        }}
        // ...
      />
            )}
    </div>
  );
}
