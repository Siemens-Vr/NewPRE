"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '@/app/components/pagination/pagination';
import Search from '@/app/components/search/searchFilter';
import styles from '@/app/styles/supplier/supplier.module.css';
import Link from "next/link";
import UpdateSupplierPopup from '@/app/components/suppliers/update';
import { config } from "/config";

const StudentsPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || 0;
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    if (!searchParams.has('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', 0);
      replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [q, page, filter]);

  const fetchSuppliers = async () => {
    try {

      let url = `${config.baseURL}/suppliers?`;
      const params = new URLSearchParams();
      
      if (q) params.append('q', q);
      if (page) params.append('page', page);
      if (filter && filter !== 'all') params.append('filter', filter);
      
      url += params.toString();

      // console.log(url)

      const response = await fetch(url);
      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        const { content, count } = data;
        setSuppliers(content || []);
        setCount(count || 0);
      } else {
        console.error('Error fetching suppliers:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };


  const handleDownloadAll = (supplier) => {
    // Define the list of files
    const filePaths = [
      supplier.invoicePath && `${config.baseURL}/download${supplier.invoicePath}`,
      supplier.paymentPath && `${config.baseURL}/download${supplier.paymentPath}`,
      supplier.approvalPath && `${config.baseURL}/download${supplier.approvalPath}`,
    ].filter(Boolean); // Remove null/undefined values
  
    if (filePaths.length === 0) {
      alert("No files available to download.");
      return;
    }
  
    // Download each file
    filePaths.forEach((filePath) => {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup the link
    });
  };
  

console.log(suppliers)





  return (
      <div className={styles.container}>
        <div className={styles.top}>
          <Search
              placeholder="Search for a supplier..."
          />

          <Link href="/pages/admin/dashboard/suppliers/add">
            <button className={styles.addButton}>Add New</button>
          </Link>
        </div>

        {Array.isArray(suppliers) && suppliers.length > 0 ? (
            <table className={styles.table}>
              <thead>
              <tr>
                <td>Project</td>
                <td>Type</td>
                <td>Suppliers</td>
                <td>Item</td>
                {/* <td>Amount </td> */}
                <td>Approver</td>
                <td>Approval Date</td>
                <td>Payment Date</td>
                <td>PV NO</td>
                <td>Action</td>
              </tr>
              </thead>
              <tbody>
              {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.project}</td>
                    <td>{supplier.type}</td>
                    <td>
                      {supplier.suppliers.length > 30 
                        ? `${supplier.suppliers.slice(0, 30)}...` 
                        : supplier.suppliers}
                    </td>
                    <td>
                      {supplier.itemDescription.length > 30 
                        ? `${supplier.itemDescription.slice(0, 30)}...` 
                        : supplier.itemDescription}
                    </td>
                    {/* <td>{supplier.amountClaimed}</td> */}
                    <td>{supplier.approver}</td>
                    <td>{supplier.approvalDate ? new Date(supplier.approvalDate).toLocaleDateString() : ''}</td>
                    <td>{supplier.paymentDate ? new Date(supplier.paymentDate).toLocaleDateString() : ''}</td>
                    <td>{supplier.PvNo}</td>
                    <td>
                    <div className={styles.buttons}>
                      {/* Download All Button */}
                      <button
                        className={`${styles.button} ${styles.download}`}
                        onClick={() => handleDownloadAll(supplier)}
                      >
                        Download
                      </button>

                      {/* View Button */}
                      <Link href={`/pages/admin/dashboard/suppliers/${supplier.uuid}`}>
                        <button className={`${styles.button} ${styles.view}`}>
                          View
                        </button>
                      </Link>
                    </div>

                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p className={styles.noStudents}>No suppliers available</p>
        )}
        <Pagination count={count} />

        
      </div>
  );
};

export default StudentsPage;
