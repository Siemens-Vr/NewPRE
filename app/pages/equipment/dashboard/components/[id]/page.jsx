// "use client";
// import React, { useEffect, useState } from 'react';
// import styles from '@/app/styles/components/singleComponent/singlecomponent.module.css';
// import Search from '@/app/components/search/search';
// import { useParams, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import AddBorrow from '@/app/components/Borrow/borrow';
// import api from '@/app/lib/utils/axios';
// import { MdSearch} from "react-icons/md";


// import { config } from '/config';

// const SingleComponentPage = () => {
//   const [components, setComponents] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const [quantityToAdd, setQuantityToAdd] = useState(0);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('');
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const componentsType = params.id;
//   const q = searchParams.get('q');
//   const [borrow,setAddBorrow]=useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const url = `/components/components/${componentsType}${q ? `?q=${q}` : ''}`;
//         // console.log('Fetching URL:', url);
//         const response = await api.get(url);
//         if (response.statusText === 'OK') {
//           const data = response.data;
//           if (Array.isArray(data.rows)) {
//             setComponents(data.rows);
//           } else {
//             console.error('Fetched data is not an array');
//           }
//         } else {
//           console.log("Failed to fetch data");
//         }
//       } catch (error) {
//         console.log("An error occurred when fetching data", error);
//       }
//     };
//     fetchData();
//   }, [componentsType, q]);

//   // Separate components into three categories
//   const componentsWithPartNumbers = components.filter(component => component.partNumber);
//   const componentsWithoutPartNumbers = components.filter(component => !component.partNumber);

//   // For component types that have both parts with and without part numbers
//   const componentTypesWithBoth = componentsWithPartNumbers.some(comp => componentsWithoutPartNumbers.find(comp2 => comp.componentType === comp2.componentType));

//   const handleAddQuantity = (component) => {
//     setSelectedComponent(component);
//     setShowPopup(true);
//   };

//   const handleSubmitQuantity = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${config.baseURL}/components/${selectedComponent.uuid}/update-quantity`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           componentUUID: selectedComponent.uuid,
//           quantity: parseInt(quantityToAdd),
//         }),
//       });

//       if (response.ok) {
//         setToastMessage("Quantity updated successfully");
//         setToastType("success");
//         setShowPopup(false);
//         // Refresh the component list
//         const updatedComponents = components.map(comp =>
//           comp.uuid === selectedComponent.uuid
//             ? { ...comp, totalQuantity: comp.totalQuantity + parseInt(quantityToAdd) }
//             : comp
//         );
//         setComponents(updatedComponents);
//       } else {
//         const errorData = await response.json();
//         setToastMessage(`Failed to update quantity: ${errorData.message}`);
//         setToastType("error");
//       }
//     } catch (error) {
//       console.log("Error updating quantity", error);
//       setToastMessage('An error occurred while updating quantity.');
//       setToastType("error");
//     } finally {
//       setTimeout(() => {
//         setToastMessage('');
//         setToastType('');
//       }, 3000); // Hide the toast after 3 seconds
//     }
//   };

//   return (
//     <div>
//       {componentsWithoutPartNumbers.length > 0 && (

    
//     <div className={styles.container}>

//       {/* <div className={styles.top}>
//         <Search placeholder="Search components" />
//       </div> */}

//       <div className={styles.search}>
//           <MdSearch />
//           <input type="text" placeholder="Search..." className={styles.input} />
//           </div>
 
 
//         {/* Components without Part Numbers */}
//         <>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <td>No.</td>
//                 <td>Component Name</td>
//                 <td>Category</td>
//                 <td>Total Quantity</td>
//                 <td>Remaining Quantity</td>
//                 <td>Borrowed Quantity</td>
//                 <td>Action</td>
//               </tr>
//             </thead>
//             <tbody>
//               {componentsWithoutPartNumbers.map((component, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}.</td>
//                   <td>{component.componentName}</td>
//                   <td>{component.componentType}</td>
//                   <td>{component.totalQuantity}</td>
//                   <td>{component.remainingQuantity}</td>
//                   <td>{component.borrowedQuantity}</td>
//                   <td className={styles.buttons}>
//                   <Link href={`/pages/equipment/dashboard/components/single/${component.uuid}`}>
//                       {/* <button className={styles.button}>View</button> */}
//                     </Link>
//                     <button className={styles.button} onClick={() => handleAddQuantity(component)}>
//                       AddQ
//                     </button>
//                     {/* <Link href={`/pages/equipment/dashboard/borrow/add?id=${component.uuid}`}>
//                       <button className={styles.button}>Borrow</button>
//                     </Link>    */}

//                      {/* Added a pop up button */}
//                     <button onClick={() => setAddBorrow(true)} className={styles.addButton}>Borrow</button>
                    
                   
//                   </td>
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
     


    
//     </div>
//   )}
  
//   {componentsWithPartNumbers.length > 0 && (
//     <div className={styles.container}>

//       {/* <div className={styles.top}>
//         <Search placeholder="Search components" />
//       </div> */}

//       <div className={styles.search}>
//            <MdSearch />
//           <input type="text" placeholder="search..." className={styles.input} />
//          </div>

        

//       {/* Components with Part Numbers */}
      
//         <>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <td>No.</td>
//                 <td>Component Name</td>
//                 <td>Part Number</td>
//                 <td>Category</td>
//                 <td>Status</td>
//                 <td>Condition</td>
//                 <td>Action</td>
//               </tr>
//             </thead>
//             <tbody>
//               {componentsWithPartNumbers.map((component, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}.</td>
//                   <td>{component.componentName}</td>
//                   <td>{component.partNumber}</td>
//                   <td>{component.componentType}</td>
//                   <td>
//                     <span className={`${styles.badgePill} ${component.status ? styles.greenPill : styles.redPill}`}>
//                       {component.status ? 'Borrowed' : 'Not Borrowed'}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`${styles.badgePill} ${component.condition ? styles.greenPill : styles.redPill}`}>
//                       {component.condition ? 'Not Okay' : 'Okay'}
//                     </span>
//                   </td>
//                   <td className={styles.buttons}>
//                     <Link href={`/pages/equipment/dashboard/components/single/${component.uuid}`}>
//                       <button className={styles.button}>View</button>
//                     </Link> 
                    
//                     {/* <Link href={`/pages/equipment/dashboard/borrow/add?id=${component.uuid}`}>
//                       <button className={styles.button}>Borrow</button>
//                     </Link> */}
                           
//                     {/* Added a pop up button        */}
//                    <button onClick={() => setAddBorrow(true)} className={styles.addButton}>Borrow</button>              
 
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
    
//     </div>
//       )}

//     {showPopup && (
//         <div className={styles.popup}>
//           <div className={styles.popupContent}>
//             <h2>Add Quantity for {selectedComponent.componentName}</h2>
//             <form onSubmit={handleSubmitQuantity}>
//               <input
//                 type="number"
//                 value={quantityToAdd}
//                 onChange={(e) => setQuantityToAdd(e.target.value)}
//                 placeholder="Quantity to add"
//               />
//               <div className={styles.buttonContainer}>
//                 <button type="submit">Add</button>
//                 <button className={styles.closeButton} onClick={() => setShowPopup(false)}>Close</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {toastMessage && (
//         <div className={`${styles.toast} ${styles[toastType]} ${toastMessage ? styles.show : styles.hide}`}>
//           {toastMessage}
//         </div>
//       )}


//       {borrow && (
//         <AddBorrow        
//           onClose={() => setAddBorrow(false)}         
//         />
//       )}

//     </div>
//   );
// };

// export default SingleComponentPage;



'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams }   from 'next/navigation';
import Link from 'next/link';
import Toolbar from '@/app/components/toolbar/Toolbar';
import Table from '@/app/components/table/Table';
import Pagination from '@/app/components/pagination/Pagination';
import AddBorrow from '@/app/components/borrow/Borrow';
import api  from '@/app/lib/utils/axios';
import { MdFilterList, MdAdd }   from 'react-icons/md';
import styles  from '@/app/styles/components/singleComponent/singlecomponent.module.css';

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
          <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowQty(true); }}
          >Add Q</button>
          <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowBorrow(true); }}
          >Borrow</button>
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
          <Link href={`/pages/equipment/dashboard/components/single/${row.uuid}`}>
            <button className={styles.button}>View</button>
          </Link>
          <button
            className={styles.button}
            onClick={() => { setSelected(row); setShowBorrow(true); }}
          >Borrow</button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.pageContainer}>

      {/* global search + optional filter/add in toolbar */}
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
            label: 'Add Quantity',
            variant: 'primary',
            onClick: () => { /* open a generic add-quantity UI? */ },
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
        <QuantityModal
          component={selected}
          onClose={()=>setShowQty(false)}
          onSave={updatedQty=>{ /* update state as before */ }}
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

