"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilter";
import styles from "@/app/styles/supplier/supplier.module.css";
import Link from "next/link";
import { config } from "/config";
import ActionButton from "@/app/components/actionButton/actionButton";
import UpdateSupplierPopup from '@/app/components/suppliers/update';
import Swal from 'sweetalert2';

const ProcurementPage = () => {
  const [procurement, setProcurement] = useState([]);
  const [count, setCount] = useState(0);
  const params = useParams();
  const { uuid, phaseuuid, outputuuid } = params;
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 0;
  const filter = searchParams.get("filter") || "all";
  const [selectedProcurement, setSelectedProcurement] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", 0);
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchProcurement();
  }, [q, page, filter]);



  const fetchProcurement = async () => {
    setLoading(true); 
    try {
      // Update the URL to match the API structure
      let url = `${config.baseURL}/procurements/${outputuuid}?`;
      const params = new URLSearchParams();

      if (q) params.append("q", q);
      if (page) params.append("page", page);
      if (filter && filter !== "all") params.append("filter", filter);

      url += params.toString();
      console.log("Fetching URL:", url); // Add this for debugging

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const { content, count } = data;
        setProcurement(content || []);
        setCount(count || 0);
      } else {
        console.error("Error fetching items:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    finally {
      setLoading(false);
    }
};

  const handleDownloadAll = (procurement) => {
    if (!procurement.document) {
      alert("No files available to download.");
      return;
    }

    const filePath = `${config.baseURL}/download${procurement.document}`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (procurementuuid) => {
 
    console.log("View procurement UUID:", procurementuuid);
    
    if (!procurementuuid) {
      console.error("Procurement UUID is missing");
      return;
    }

   
    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement/${procurementuuid}`);
  };

  const handleDelete = async (procurementuuid, name) => {
    if (!procurementuuid) {
      console.error("Procurement UUID is missing");
      return;
    }
  
   const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${name} `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete',
                cancelButtonText: 'Cancel'
              });
              
              if (result.isConfirmed) {
                setDeleting(uuid);
      
  
      try {
        const response = await fetch(`${config.baseURL}/procurements/output/${procurementuuid}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          await fetchProcurement();
           Swal.fire({
              title: 'Deleted!',
              text: `${name} has been successfully deleted.`,
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
        } else {
          throw new Error("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const handleUpdateClick = (procurement) => {
    setSelectedProcurement(procurement);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProcurement(null);
  };
  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchProcurement();
 
};

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleBack = () => {
    router.back(); // Go to the previous page
  };

  return (
    <div>
      <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for item..." />
        <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement/add/`}>
          <button className={styles.addButton}>Add</button>
        </Link>
      </div>

      {Array.isArray(procurement) && procurement.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Item Name</td>
              <td>Type</td>
              <td>Suppliers</td>
              <td>Approval Date</td>
              <td>Payment Date</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {procurement.map((procurement) => (
              <tr key={procurement.id}>
                <td>{procurement.itemName}</td>
                <td>{procurement.type}</td>
                <td>{procurement.suppliers}</td>
                <td>
                  {procurement.approvalDate ? new Date(procurement.approvalDate).toLocaleDateString() : ""}
                </td>
                <td>
                  {procurement.paymentDate ? new Date(procurement.paymentDate).toLocaleDateString() : ""}
                </td>
                <td>
                  <ActionButton
                    onEdit={() => handleUpdateClick(procurement)}
                    onDownload={() => handleDownloadAll(procurement)}
                    onDelete={() => handleDelete(procurement.uuid, procurement.itemName)}
                    onView={() => handleView(procurement.uuid)}   
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noItem}>No procurements available</p>
      )}
      <Pagination count={count} />

      {showPopup && (
        <UpdateSupplierPopup
          procurement={selectedProcurement}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
    </div>
  );
};

export default ProcurementPage;