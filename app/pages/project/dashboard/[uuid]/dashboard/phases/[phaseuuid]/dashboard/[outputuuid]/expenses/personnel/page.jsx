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

const PersonnelPage = () => {
  const [personnel, setPersonnel] = useState([]);
  const [count, setCount] = useState(0);
  const params = useParams();
  const { uuid, phaseuuid, outputuuid } = params;
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 0;
  const filter = searchParams.get("filter") || "all";
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
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
    fetchPersonnel();
  }, [q, page, filter]);



  const fetchPersonnel = async () => {
    setLoading(true); 
    try {
      // Update the URL to match the API structure
      let url = `${config.baseURL}/personnels/${uuid}?`;
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
        setPersonnel(content || []);
        setCount(count || 0);
      } else {
        console.error("Error fetching personnnels:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    finally {
      setLoading(false);
    }
};

  const handleDownloadAll = (personnnel) => {
    if (!personnel.document) {
      alert("No files available to download.");
      return;
    }

    const filePath = `${config.baseURL}/download${personnel.document}`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (personneluuid) => {
 
    console.log("View personnel UUID:", personneluuid);
    
    if (!personneluuid) {
      console.error("Personnel's UUID is missing");
      return;
    }

   
    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/personnel/${personneluuid}`);
  };

  const handleDelete = async (personneluuid, name) => {
    if (!personneluuid) {
      console.error("Personnel UUID is missing");
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
        const response = await fetch(`${config.baseURL}/personnels/project/${personneluuid}/delete`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          await fetchPersonnel();
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
        console.error("Error deleting personnel:", error);
        alert("Failed to delete personnel. Please try again.");
      }
    
  }
};

  const handleUpdateClick = (personnel) => {
    setSelectedPersonnel(personnel);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPersonnel(null);
  };
  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchPersonnel();
 
};

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for item..." />
        <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/personnel/add/`}>
          <button className={styles.addButton}>Add</button>
        </Link>
      </div>

      {Array.isArray(personnel) && personnel.length > 0 ? (
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
            {personnel.map((personnel) => (
              <tr key={personnel.id}>
                <td>{personnel.name}</td>
                <td>
                  <ActionButton
                    onEdit={() => handleUpdateClick(personnel)}
                    onDownload={() => handleDownloadAll(personnel)}
                    onDelete={() => handleDelete(personnel.uuid, personnel.itemName)}
                    onView={() => handleView(personnel.uuid)}   
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noItem}>No personnels available</p>
      )}
      <Pagination count={count} />

      {showPopup && (
        <UpdateSupplierPopup
          personnel={selectedPersonnel}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default PersonnelPage;