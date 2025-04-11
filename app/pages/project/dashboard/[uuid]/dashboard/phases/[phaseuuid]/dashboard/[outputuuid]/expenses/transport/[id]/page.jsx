"use client";

import styles from '@/app/styles/supplier/singleSupplier.module.css';
import UpdateTransportPopup from '@/app/components/transport/update';
import { useState, useEffect } from "react";
import { config } from "/config";
import { useRouter } from "next/navigation";

const SingleTransportPage = ({ params }) => {
  const [transport, setTransport] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const { uuid, id, outputuuid } = params;
  // console.log("Fetching transport with UUID:", transport.id);
  const fetchTransport = async () => {
    if (!id) {
      console.error("Transport ID is undefined or null.");
      return;
    }
  
    console.log("Fetching transport with ID:", id);
    try {
      const response = await fetch(`${config.baseURL}/transports/output/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transport. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received transport data:", data);
      setTransport(data);
    } catch (error) {
      console.error('Error fetching transport:', error);
    }
  };
  
  useEffect(() => {
    fetchTransport();
  }, [id]); // Only depend on id, not transport
  
  // const fetchTransport = async () => {
  //   if (!id) {
  //     router.push(`/pages/project/dashboard/${uuid}/dashboard/expenses/transport`);
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(`${config.baseURL}/transports/project/${id}`);
  //     if (!response.ok) {
  //       console.error("API responded with an error:", response.status, response.statusText);
  //       router.push(`/pages/project/dashboard/${uuid}/dashboard/expenses/transport`);
  //       return;
  //     }
  //     const data = await response.json();
      
  //     console.log("Received transport data:", data); // Debug log
  //     if (!data) {
  //       console.error("Received null or undefined data from API.");
  //       return;
  //     }
  
  //     setTransport(data);
  //   } catch (error) {
  //     console.error("Error fetching transport:", error);
  //     router.push(`/pages/project/dashboard/${uuid}/dashboard/expenses/transport`);
  //   }
  // };
  
  useEffect(() => {
    fetchTransport();
  }, [id]);


  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTransport(null);
  };

  // Updated date formatting function with proper null/undefined checking
  const formatDate = (dateString) => {
    if (!dateString || dateString === "null" || dateString === "undefined") {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };

  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchTransport();
  };

  if (!transport && id) {
    return <div>Loading...</div>;
  }

  if (!transport) {
    return null;
  }

  // Helper function to safely access nested properties
  const getDateValue = (dateField) => {
    return transport[dateField] || "N/A";
  };
  const handleBack = () => {
    router.back(); // Go to the previous page
  };

  return (
    <div>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
    
    
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{transport.destination}</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          {/* First two rows remain unchanged */}
          <div className={styles.twoInputsRow}>
            <div>
              <label>Destination</label>
              <input type="text" value={transport.destination} readOnly className={styles.editInputField} />
            </div>
            <div>
              <label>Travel Period</label>
              <input type="text" value={transport.travelPeriod} readOnly className={styles.editInputField} />
            </div>
          </div>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Description</label>
              <input type="text" value={transport.description} readOnly className={styles.editInputField} />
            </div>
            </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Travelers</label>
              <input type="text" value={transport.travelers} readOnly className={styles.editInputField} />
            </div>
            <div>
              <label>Allowance</label>
              <input type="text" value={transport.allowance} readOnly className={styles.editInputField} />
            </div>
          </div>

          {/* Updated date fields with proper formatting */}
          <div className={styles.twoInputsRow}>
            <div>
              <label>Approval Date</label>
              <input
                type="text"
                value={formatDate(getDateValue('approvalDate'))}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
              <label>Document</label>
              <div className={styles.inputContainer}>
                <input type="text" value={transport.document ? transport.document.split('/').pop() : "N/A"} readOnly className={styles.editInputField} />
                {transport.document && (
                  <div className={styles.linksInsideInput}>
                    <a href={`${config.baseURL}/${transport.document}`} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                      View
                    </a>
                    <a href={`${config.baseURL}/download${transport.document}`} className={styles.fileLink}>
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Approver</label>
              <input type="text" value={transport.approver || "N/A"} readOnly className={styles.editInputField} />
            </div>
            <div>
              <label>Claim Number</label>
              <input type="text" value={transport.claimNumber || "N/A"} readOnly className={styles.editInputField} />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Type</label>
              <input type="text" value={transport.type || "N/A"} readOnly className={styles.editInputField} />
            </div>
            <div>
                        <label htmlFor="dateOfRequest">Request Date</label>
                        <input
                            type="date"
                            id="dateOfRequest"
                            value={formatDate(getDateValue('dateOfRequest'))}
                            readOnly
                            className={styles.editInputField}
                        
                        />
                    </div>
          </div>

          <div className={styles.twoInputsRow}>
          <div>
              <label>Payment Date</label>
              <input
                type="text"
                value={formatDate(getDateValue('paymentDate'))}
                readOnly
                className={styles.editInputField}
              />
            </div>

                    <div>
                        <label htmlFor="dateReceived">Received Date</label>
                        <input
                            type="date"
                            id="dateReceived"
                            value={formatDate(getDateValue('dateReceived'))}
                            readOnly
                            className={styles.editInputField}
                          
                        />
                    </div>
          </div>

          <div className={styles.twoInputsRow}>
            
            <div>
              <label>PvNo</label>
              <input type="text" value={transport.PvNo || "N/A"} readOnly className={styles.editInputField} />
            </div>
          </div>
        </form>
      </div>

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

export default SingleTransportPage;