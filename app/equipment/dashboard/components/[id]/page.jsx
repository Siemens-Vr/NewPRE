'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams }   from 'next/navigation';
import Link from 'next/link';
import Toolbar from '@/app/components/ToolBar/ToolBar';
import Table from '@/app/components/table/Table';
import Pagination from '@/app/components/pagination/pagination';
import AddBorrow from '@/app/components/Borrow/Borrow';
import api  from '@/app/lib/utils/axios';
import { MdFilterList, MdAdd }   from 'react-icons/md';
import styles  from '@/app/styles/components/singleComponent/singlecomponent.module.css';
import AddComponentQuantity from '@/app/components/component/addQuantity';
const ROWS_PER_PAGE = 10;

export default function SingleComponentPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const componentsType = params.id;
  const q            = searchParams.get('q')    || '';
  const page         = parseInt(searchParams.get('page') || '0', 10);

  const [components, setComponents] = useState([]);
  const [showQty,     setShowQty]   = useState(false);
  const [showBorrow,  setShowBorrow]= useState(false);
  const [selected,    setSelected]  = useState(null);

 

  // Fetch data whenever type or search changes
  useEffect(() => {
    api.get(
      `/components/components/${componentsType}${q ? `?q=${encodeURIComponent(q)}` : ''}`
    )
    .then(res => {
      // expecting { rows: [...] }
      if (Array.isArray(res.data.rows)) {
        setComponents(res.data.rows);
      } else {
        console.error('Unexpected payload', res.data);
        setComponents([]);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      setComponents([]);
    });
  }, [componentsType, q]);


  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
  
  const handleModalSuccess = (setModalState) => () => {
    setModalState(false);
    handleRefresh();
  };

  // split into two tables
  const withPN    = components.filter(c => c.partNumber);
  const withoutPN = components.filter(c => !c.partNumber);

  // paginate whichever table has rows
  const paginated = useMemo(() => {
    const start = page * ROWS_PER_PAGE;
    return components.slice(start, start + ROWS_PER_PAGE);
  }, [components, page]);

  // common table columns for “without partNumber”
  const baseColumns = [
    {
      key: 'no',
      label: 'No.',
      render: (_r, i) => i + 1 + page * ROWS_PER_PAGE
    },
    { key: 'componentName', label: 'Component Name' },
    { key: 'componentType', label: 'Category' },
    { key: 'totalQuantity', label: 'Total Qty' },
    { key: 'remainingQuantity', label: 'Remaining Qty' },
    { key: 'borrowedQuantity', label: 'Borrowed Qty' },
  ];

  // extend columns with Actions
  const columnsWithoutPN = [
    ...baseColumns,
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div className={styles.buttons}>
          <Link href={`/equipments/components/single/${row.uuid}`}>
            <button className={styles.button}>View</button>
          </Link>
          <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowQty(true); }}
          >Add Q</button>
          {/* <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowBorrow(true); }}
          >Borrow</button> */}
        </div>
      )
    }
  ];

  // columns for “with partNumber”
  const columnsWithPN = [
    {
      key: 'no',
      label: 'No.',
      render: (_r, i) => i + 1 + page * ROWS_PER_PAGE
    },
    { key: 'componentName', label: 'Component Name' },
    { key: 'partNumber',    label: 'Part Number' },
    { key: 'componentType',  label: 'Category' },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <span className={`${styles.badgePill} ${
          row.status ? styles.greenPill : styles.redPill
        }`}>
          {row.status ? 'Borrowed' : 'Available'}
        </span>
      )
    },
    {
      key: 'condition',
      label: 'Condition',
      render: row => (
        <span className={`${styles.badgePill} ${
          row.condition ? styles.redPill : styles.greenPill
        }`}>
          {row.condition ? 'Not OK' : 'OK'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: row => (
        <div >
          <Link href={`/equipments/components/single/${row.uuid}`}>
            <button className={styles.button}>View</button>
          </Link>
              <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowQty(true); }}
          >Add Q</button>
          {/* <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowBorrow(true); }}
          >Borrow</button> */}
        </div>
      )
    }
  ];

  return (
    <div className={styles.pageContainer}>

     
      <Toolbar
        placeholder="Search components…"
        buttons={[
          {
            label: 'Filter',
            variant: 'secondary',
            onClick: () => {/* your filter logic */},
            icon: MdFilterList
          },
          {
            label: 'Borrow',
            variant: 'primary',
            onClick: () => { setShowBorrow(true); },
            icon: MdAdd
          }
        ]}
      />


      {/* Table for components without partNumber */}
      {withoutPN.length > 0 && (
        <Section title="Items (no part number)">
          <Table
            columns={columnsWithoutPN}
            data={withoutPN.slice(page * ROWS_PER_PAGE, (page+1)*ROWS_PER_PAGE)}
          />
        </Section>
      )}

      {/* Table for components with partNumber */}
      {withPN.length > 0 && (
        <Section title="Items (with part number)">
          <Table
            columns={columnsWithPN}
            data={withPN.slice(page * ROWS_PER_PAGE, (page+1)*ROWS_PER_PAGE)}
          />
        </Section>
      )}

      {/* if neither has data */}
      {components.length === 0 && (
        <p className={styles.noData}>No components found.</p>
      )}

      {/* Pagination */}
      {components.length > ROWS_PER_PAGE && (
        <div className={styles.paginationWrapper}>
          <Pagination
            count={components.length}
            itemsPerPage={ROWS_PER_PAGE}
          />
        </div>
      )}

      {/* Add Quantity popup */}
      {showQty && selected && (
        <AddComponentQuantity
          component={selected}
          onClose={()=>setShowQty(false)}
          onSuccess={handleModalSuccess(setShowQty)}

        />
      )}

      {/* Borrow popup */}
      {showBorrow && selected && (
        <AddBorrow
          component={selected}
          onClose={()=>setShowBorrow(false)}
        />
      )}
    </div>
  );
}

// A tiny helper for section headers (optional)
function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

