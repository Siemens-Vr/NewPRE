"use client";
import styles from '@/app/styles/supplier/singleSupplier.module.css';
import UpdateSupplierPopup from '@/app/components/suppliers/update';
import { useState, useEffect } from "react";
import { config } from "/config";
import { useRouter } from 'next/navigation';

const SingleSuppliersPage = ({ params }) => {
  const [procurement, setProcurement] = useState(null);
  const [selectedProcurement, setSelectedProcurement] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { uuid, procurementuuid } = params;

  // Function to format dates (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0]; // Extract only YYYY-MM-DD
  };



  const fetchProcurement = async () => {
    console.log("Fetching procurement with UUID:", procurementuuid);
    
    try {
        const response = await fetch(`${config.baseURL}/procurements/project/${procurementuuid}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched procurement data:", data); // Log the fetched data
        setProcurement(data);
    } catch (error) {
        console.error('Error fetching procurement:', error);
    }
};

  useEffect(() => {
      fetchProcurement();
  }, [procurementuuid]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProcurement(null);
  };
  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchProcurement();
 
};
 

  if (!procurement) {
    return <div>Loading...</div>;
  }
  if(!procurement){
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{procurement.suppliers}</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Item Name</label>
              <input
                type="text"
                value={procurement.itemName}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Suppliers</label>
              <input
                type="text"
                value={procurement.suppliers}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
          <div className={styles.twoInputsRow}>
      
            <div>
              <label>Item Description</label>
              <textarea
                type="text"
                value={procurement.itemDescription}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
           
          <div className={styles.twoInputsRow}>
            <div>
              <label>Amount Claimed</label>
              <input
                type="text"
                value={procurement.amountClaimed}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Approval Date</label>
              <input type="text"
               value={formatDate(procurement.approvalDate)} readOnly className={styles.editInputField} />
            </div>

          </div>

          <div className={styles.twoInputsRow}>
          <div>
              <label>Approver</label>
              <input
                type="text"
                value={procurement.approver}
                readOnly
                className={styles.editInputField}
              />
            </div>

          <div className={styles.inputWithLink}>
              <label>Document</label>
              <div className={styles.inputContainer}>
                <input type="text" value={procurement.document ? procurement.document.split('/').pop() : "N/A"} readOnly className={styles.editInputField} />
                {procurement.document && (
                  <div className={styles.linksInsideInput}>
                    <a href={`${config.baseURL}/${procurement.document}`} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                      View
                    </a>
                    <a href={`${config.baseURL}/download${procurement.document}`} className={styles.fileLink}>
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
            </div>
          <div className={styles.twoInputsRow}>
          <div>
              <label>Type</label>
              <input
                type="text"
                value={procurement.type}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Claim Number</label>
              <input
                type="text"
                value={procurement.claimNumber}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
          <div>
              <label>Date Taken to Approver</label>
              <input
                type="text"
                value={formatDate(procurement.dateTakenToApprover) || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Payment Date</label>
              <input
                type="text"
                value={formatDate(procurement.paymentDate) || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
          <div>
              <label>Invoice Date</label>
              <input
                type="text"
                value={formatDate(procurement.invoiceDate) || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Taken to Finance</label>
              <input
                type="text"
                value={formatDate(procurement.dateTakenToFinance) || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
          <div>
              <label>Date Accounted</label>
              <input
                type="text"
                value={formatDate(procurement.dateAccounted) || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>PvNo</label>
              <input
                type="text"
                value={procurement.PvNo}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>
        </form>
      </div>

      {showPopup && (
        <UpdateSupplierPopup
          procurement={selectedProcurement}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default SingleSuppliersPage;
