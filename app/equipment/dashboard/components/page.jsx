'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Toolbar from '@/app/components/ToolBar/ToolBar';
import Table from '@/app/components/table/Table';
import Pagination from '@/app/components/pagination/pagination';
import CategoriesPopUp from "@/app/components/categories/categories";
import AddComponent from "@/app/components/component/component";
import api from '@/app/lib/utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import { MdFilterList, MdAdd } from 'react-icons/md';
import Loading from '@/app/components/Loading/Loading';
import styles from '@/app/styles/components/components.module.css';
import EmptyState from '@/app/components/EmptyState/EmptyState';

const ROWS_PER_PAGE = 10;

// Custom hook for data fetching
const useComponents = (searchQuery, refreshTrigger) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/components${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
      const { data } = response;
      
      // Normalize response structure
      const components = Array.isArray(data) ? data : 
                        data?.components || data?.data || [];
      
      setItems(components);
      
      if (data.message && components.length > 0) {
        toast.success(data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          'Failed to fetch components';
      toast.error(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  }, [searchQuery, refreshTrigger]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return { items, loading, hasFetched };
};

// Table columns configuration
const getTableColumns = (page) => [
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
      return (
        <span className={`${styles.badge} ${cls}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      );
    }
  },
  {
    key: 'actions',
    label: 'Action',
    render: row => (
      <Link href={`/equipments/components/${encodeURIComponent(row.componentType)}`}>
        <button className={styles.button}>View</button>
      </Link>
    )
  }
];

// Toolbar buttons configuration
const getToolbarButtons = (onShowCat, onShowAdd) => [
  {
    label: 'Filter',
    onClick: () => console.log('Filter clicked'),
    variant: 'secondary',
    icon: MdFilterList
  },
  {
    label: 'Add Categories',
    onClick: onShowCat,
    variant: 'primary',
    icon: MdAdd
  },
  {
    label: 'Add New',
    onClick: onShowAdd,
    variant: 'primary',
    icon: MdAdd
  }
];

export default function ComponentsPage() {
  const [showCatPopup, setShowCat] = useState(false);
  const [showAddPopup, setShowAdd] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const { items, loading, hasFetched } = useComponents(q, refreshTrigger);

  // Paginated data
  const paginated = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return items.slice(start, start + ROWS_PER_PAGE);
  }, [items, page]);

  // Handlers
  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
  
  const handleModalSuccess = (setModalState) => () => {
    setModalState(false);
    handleRefresh();
  };

  const showEmptyState = !loading && items.length === 0 && hasFetched;
  const showTable = !loading && items.length > 0;
  const showPagination = !loading && items.length > ROWS_PER_PAGE;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Toolbar
        placeholder="Search by Category..."
        buttons={getToolbarButtons(
          () => setShowCat(true),
          () => setShowAdd(true)
        )}
      />

      {loading && <Loading />}

      {showTable && <Table columns={getTableColumns(page)} data={paginated} />}

      {showEmptyState && (
        <EmptyState
          illustration="/undraw_no-data_ig65.svg"
          message={q ? `No components found for "${q}"` : "No components found"}
          details={q ? "Try adjusting your search terms." : "You haven't added any components yet. Start by creating a component now."}
          actionLabel="Add Component"
          onAction={() => setShowAdd(true)}
        />
      )}

      {showPagination && (
        <div className={styles.paginationContainer}>
          <Pagination count={items.length} itemsPerPage={ROWS_PER_PAGE} />
        </div>
      )}

      {showCatPopup && (
        <CategoriesPopUp 
          onClose={() => setShowCat(false)}
          onSuccess={handleModalSuccess(setShowCat)}
        />
      )}
      
      {showAddPopup && (
        <AddComponent 
          onClose={() => setShowAdd(false)}
          onSuccess={handleModalSuccess(setShowAdd)}
        />
      )}
    </div>
  );
}