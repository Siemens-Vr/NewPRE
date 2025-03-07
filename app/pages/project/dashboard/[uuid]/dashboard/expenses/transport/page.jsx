"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilterTransport";
import styles from "@/app/styles/supplier/supplier.module.css";
import Link from "next/link";
import { config } from "/config";
import ActionButton from "@/app/components/actionButton/actionButton";
import UpdateTransportPopup from  '@/app/components/transport/update';

const TransportPage = () => {
  const [transport, setTransport] = useState([]);
  const [count, setCount] = useState(0);
  const params= useParams()
  const {uuid, id}= params
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 0;
  const filter = searchParams.get("filter") || "all";
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
 

  useEffect(() => {
    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", 0);
      replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, []);


  console.log("fetching uuid:", uuid)

  useEffect(() => {
    fetchTransport();
  }, [q, page, filter]);

  const fetchTransport = async () => {
    setLoading(true); 
    try {
      let url = `${config.baseURL}/transports/${uuid}?`;
      const params = new URLSearchParams();

      if (q) params.append("q", q);
      if (page) params.append("page", page);
      if (filter && filter !== "all") params.append("filter", filter);

      url += params.toString();

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const { content, count } = data;
        setTransport(content || []);
        setCount(count || 0);
      } else {
        console.error("Error fetching transport items:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching transport items:", error);
    }
    finally {
      setLoading(false);
  }
  };

  const handleDownloadAll = (transport) => {
    const filePaths = [
      transport.document && `${config.baseURL}/download${transport.document}`,
    ].filter(Boolean);

    if (filePaths.length === 0) {
      alert("No files available to download.");
      return;
    }

    filePaths.forEach((filePath) => {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleView = (id) => {
    window.location.href = `/pages/project/dashboard/${uuid}/dashboard/expenses/transport/${id}/`;
  };
  const handleDelete = async (id) => {
    if (!id) {
      console.error("Transport data is not loaded");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  
    if (confirmDelete) {
      try {
        const response = await fetch(`${config.baseURL}/transports/${id}/delete`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          alert("Item deleted successfully!");
          // Immediate navigation without state updates
          window.location.href = `/pages/project/dashboard/${uuid}/dashboard/expenses/transport`;
        } else {
          throw new Error("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const handleUpdateClick = (transport) => {
    setSelectedTransport(transport);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTransport(null);
  };

  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchTransport();
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for travel..." />

        <Link href={`/pages/project/dashboard/${uuid}/dashboard/expenses/transport/add/`}>
  <button className={styles.addButton}>Add</button>
</Link>
      </div>

      {Array.isArray(transport) && transport.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Destination</td>
              <td>Travel Period</td>
              <td>Travelers</td>
              <td>Date of Request</td>
              {/* <td>Date Received</td>
              <td>Approver</td>
              <td>Approval Date</td>
              <td>Payment Date</td> */}
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {transport.map((transport) => (
              <tr key={transport.id}>
                <td>{transport.destination}</td>
                <td>{transport.travelPeriod}</td>
                <td>{transport.travelers ? transport.travelers.length : 0}</td>
                <td>
                  {transport.dateOfRequest
                    ? new Date(transport.dateOfRequest).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <ActionButton
                    onEdit={() => handleUpdateClick(transport)}
                    onDownload={() => handleDownloadAll(transport)}
                    onDelete={() => handleDelete (transport.id)}
                    onView={ () => handleView (transport.id)}
            
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noItems}>No travel items available</p>
      )}
      <Pagination count={count} />

      {showPopup && (
        <UpdateTransportPopup
          transport={selectedTransport}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default TransportPage;
