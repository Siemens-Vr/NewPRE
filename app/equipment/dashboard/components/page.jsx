'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link   from 'next/link';
import Toolbar   from '@/app/components/ToolBar/ToolBar';
import Table   from '@/app/components/table/Table';
import Pagination  from '@/app/components/pagination/pagination';
import CategoriesPopUp from "@/app/components/categories/categories";
import AddComponent from "@/app/components/component/component";
import api from '@/app/lib/utils/axios';
import { toast, ToastContainer }      from 'react-toastify';
import { MdFilterList, MdAdd }        from 'react-icons/md';
import Loading from '@/app/components/Loading/Loading';
import styles  from '@/app/styles/components/components.module.css';
import EmptyState from '@/app/components/EmptyState/EmptyState';

const ROWS_PER_PAGE = 10;

export default function ComponentsPage() {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showCatPopup, setShowCat]  = useState(false);
  const [showAddPopup, setShowAdd]  = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const searchParams = useSearchParams();
  const q    = searchParams.get('q')    || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  // Fetch (optionally filtered by ?q=)
  useEffect(() => {
    setLoading(true);
    api.get(`/components${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to fetch components');
      })
      .finally(() =>{ 
        setLoading(false)
         setHasFetched(true);
      });
  }, [q]);

  // Paginate in‐memory
  const paginated = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return items.slice(start, start + ROWS_PER_PAGE);
  }, [items, page]);

  // Column defs for Table
  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (_row, idx) => idx + 1 + page * ROWS_PER_PAGE
    },
    {
      key: 'componentType',
      label: 'Category'
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity'
    },
    {
      key: 'status',
      label: 'Status',
      render: row => {
        const inStock = row.totalQuantity > 0;
        const cls = inStock ? styles.inStock : styles.outOfStock;
        return <span className={`${styles.badge} ${cls}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>;
      }
    },
    {
      key: 'actions',
      label: 'Action',
      render: row => (
        <Link href={`/pages/equipment/dashboard/components/${encodeURIComponent(row.componentType)}`}>
          <button className={styles.button}>View</button>
        </Link>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Toolbar drives ?q= and has your two buttons */}
      <Toolbar
        placeholder="Search by Category..."
        buttons={[
          {
            label: 'Filter',
            onClick: () => {/* your filter logic */},
            variant: 'secondary',
            icon: MdFilterList
          },
          {
            label: 'Add Categories',
            onClick: () => setShowCat(true),
            variant: 'primary',
            icon: MdAdd
          },
          {
            label: 'Add New',
            onClick: () => setShowAdd(true),
            variant: 'primary',
            icon: MdAdd
          }
        ]}
      />

      {/* Loading indicator */}
      {loading && <Loading/>}

      {/* Table or “No results” */}
      {!loading && (
        items.length > 0
        ? <Table columns={columns} data={paginated} />
        : hasFetched &&         
            <EmptyState
                  illustration="/undraw_no-data_ig65.svg"
                  message="No equipments records found"
                  details="You haven’t added any equipments yet. Start by creating an equipment now."
                  actionLabel="Add Equipments"
                  onAction={() => setShowAdd(true)}
            />
      )}

      {/* Pagination */}
      {!loading && items.length > ROWS_PER_PAGE && (
        <div>
          <Pagination
            count={items.length}
            itemsPerPage={ROWS_PER_PAGE}
          />
        </div>
      )}

      {/* Modals */}
      {showCatPopup && <CategoriesPopUp onClose={() => setShowCat(false)} />}
      {showAddPopup && <AddComponent onClose={() => setShowAdd(false)} />}
    </div>
  );
}
