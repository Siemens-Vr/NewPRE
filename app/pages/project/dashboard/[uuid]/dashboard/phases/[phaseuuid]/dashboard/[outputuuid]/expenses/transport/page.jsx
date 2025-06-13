"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Pagination from "@/app/components/pagination/pagination";
import Search from "@/app/components/search/searchFilterTransport";
import styles from "@/app/styles/supplier/supplier.module.css";
import Link from "next/link";
import { config } from "/config";
import ActionButton from "@/app/components/actionButton/actionButton";
import UpdateTransportPopup from  '@/app/components/transport/update';
import Swal from "sweetalert2";
import LevelForm from "@/app/components/cohort/AddLevel";
import AddTransportPage
  from "@/app/pages/project/dashboard/[uuid]/dashboard/phases/[phaseuuid]/dashboard/[outputuuid]/expenses/transport/add/page";

const TransportPage = () => {
  const [transport, setTransport] = useState([]);
  const [count, setCount] = useState(0);
  const params= useParams()
  const {uuid, phaseuuid, outputuuid}= params
  const id= transport.uuid
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 0;
  const filter = searchParams.get("filter") || "all";
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const[showAddNewPopup,setShowAddNewPopups]=useState(false);


  useEffect(() => {
    if (!searchParams.has("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", 0);
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }, [searchParams, router]);


  console.log("fetching uuid:", uuid)


  useEffect(() => {
    fetchTransport();
  }, [q, page, filter]);

  const fetchTransport = async () => {
    setLoading(true);
    try {
      let url = `${config.baseURL}/transports/${outputuuid}?`;
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




  const handleDelete = async (id, name) => {
    console.log(uuid, phaseuuid, outputuuid, id)
    if (!id) {
      console.error("Transport data is not loaded");
      return;
    }

    const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: `You are about to delete ${name} `,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#ff7211',
                    confirmButtonText: 'Yes, delete',
                    cancelButtonText: 'Cancel'
                  });

                  if (result.isConfirmed) {
                    setDeleting(uuid);

    // if (confirmDelete) {
      try {
        const response = await fetch(`${config.baseURL}/transports/${id}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: `${name} has been successfully deleted.`,
            icon: 'success',
            confirmButtonColor: '#ff7211',
          });

          await fetchTransport();
          window.location.reload();


// Immediate navigation without state updates
          // window.location.href = `/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`;
        } else {
          throw new Error("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };
// };

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
  const handleView = (id) => {
    console.log("View transport UUID:", id);
    console.log("UUID:", uuid);
    console.log("Phase UUID:", phaseuuid);
    console.log("Output UUID:", outputuuid);

    if (!id || !uuid || !phaseuuid || !outputuuid) {
      console.error("One or more required parameters are missing");
      return;
    }

    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport/${id}`);

  };
  const handleBack = () => {
    router.back(); // Go to the previous page
  };
// added
  const handleAddNewClick=()=>{
    setShowAddNewPopups(true);
  };
  const handleClosePopups=()=>{
    setShowAddNewPopups(false);
  }
  return (

          <div>
            <button className={styles.backButton} onClick={handleBack}>
              Back
            </button>

            <div className={styles.container}>
              <div className={styles.top}>
                <Search placeholder="Search for travel..."/>

                <button
                    type="button"
                    onClick={handleAddNewClick}
                    className={`${styles.addButton} ${styles.button}`}
                >
                  Add
                </button>

                {showAddNewPopup && (
                    < AddTransportPage onClose={handleClosePopups}/>
                )}
                {/*      <Link href={`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport/add/`}>*/}
                {/*<button className={styles.addButton}>Add</button>*/}
                {/*</Link>*/}
              </div>

              {Array.isArray(transport) && transport.length > 0 ? (
                  <div className="overflow-x-auto mt-6 bg-white shadow-md ">
                    <table className="min-w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-white uppercase bg-[#1b9392]">
                      <tr>
                        <th scope="col" className="px-6 py-3">Destination</th>
                        <th scope="col" className="px-6 py-3">Travel Period</th>
                        <th scope="col" className="px-6 py-3">Travelers</th>
                        <th scope="col" className="px-6 py-3">Date of Request</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {transport.map((item) => (
                          <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-black">{item.destination}</td>
                            <td className="px-6 py-4 text-black">{item.travelPeriod}</td>
                            <td className="px-6 py-4 text-black">{item.travelers ? item.travelers.length : 0}</td>
                            <td className="px-6 py-4 text-black">
                              {item.dateOfRequest ? new Date(item.dateOfRequest).toLocaleDateString() : ""}
                            </td>
                            <td className="px-6 py-4 text-black">
                              <ActionButton
                                  onEdit={() => handleUpdateClick(item)}
                                  onDownload={() => handleDownloadAll(item)}
                                  onDelete={() => handleDelete(item.id, item.destination)}
                                  onView={() => handleView(item.id)}
                              />
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                  <p className={styles.noItems}>No travel items available</p>
              )}
              <Pagination count={count}/>

              {showPopup && (
                  <UpdateTransportPopup
                      transport={selectedTransport}
                      onClose={handleClosePopup}
                      onSave={handleSavePopup}
                  />
              )}
            </div>
          </div>

        );
        };

        export default TransportPage;
