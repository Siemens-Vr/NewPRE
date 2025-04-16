"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilter";
import styles from "@/app/styles/supplier/suppliers.module.css";
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
          <div className="overflow-x-auto mt-6 bg-white shadow-md">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-white uppercase bg-[#1b9392]">
              <tr>
                <th scope="col" className="px-6 py-3">Item Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Suppliers</th>
                <th scope="col" className="px-6 py-3">Approval Date</th>
                <th scope="col" className="px-6 py-3">Payment Date</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
              </thead>
              <tbody>
              {procurement.map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-black">{item.itemName}</td>
                    <td className="px-6 py-4 text-black">{item.type}</td>
                    <td className="px-6 py-4 text-black">{item.suppliers}</td>
                    <td className="px-6 py-4 text-black">
                      {item.approvalDate ? new Date(item.approvalDate).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4 text-black">
                      <ActionButton
                          onEdit={() => handleUpdateClick(item)}
                          onDownload={() => handleDownloadAll(item)}
                          onDelete={() => handleDelete(item.uuid, item.itemName)}
                          onView={() => handleView(item.uuid)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
      ) : (
          <p className="text-center text-gray-600 mt-6">No procurements available</p>
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