"use client";
import styles from '@/app/styles/supplier/singleSupplier.module.css';
import UpdateSupplierPopup from '@/app/components/suppliers/update';
import { useState, useEffect } from "react";
import { config } from "/config";

const SingleSuppliersPage = ({ params }) => {
  const [supplier, setSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { id } = params;

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`${config.baseURL}/suppliers/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSupplier(data);
    } catch (error) {
      console.error('Error fetching supplier:', error);
    }
  };

  useEffect(() => {


    fetchSupplier();
  }, [id]);

    // Delete supplier function
    const handleDelete = async (supplierId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
  
      if (confirmDelete) {
        try {
          const response = await fetch(`${config.baseURL}/suppliers/${supplierId}/delete`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            alert('Supplier deleted successfully!');
            await fetchSupplier()
      
          } else {
            console.error('Failed to delete supplier', await response.text());
          }
        } catch (error) {
          console.error('Error deleting supplier:', error);
        }
      }
    };
  const handleUpdateClick = (supplier) => {
    console.log(supplier)
    setSelectedSupplier(supplier);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedSupplier(null);
  };

  const handleSavePopup = async () => {
    handleClosePopup();
    await fetchSupplier();
  };
  const handleDirectDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `${config.baseURL}/${filePath}`;
    link.download = filePath.split('/').pop(); // Extract file name from the path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  if (!supplier) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{supplier.suppliers}</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.twoInputsRow}>
            <div>
              <label>Suppliers</label>
              <input
                type="text"
                value={supplier.suppliers}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Item Description</label>
              <input
                type="text"
                value={supplier.itemDescription}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Project</label>
              <input
                type="text"
                value={supplier.project}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>PvNo</label>
              <input
                type="text"
                value={supplier.PvNo}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Accounted</label>
              <input
                type="text"
                value={supplier.accounted || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Amount Claimed</label>
              <input
                type="text"
                value={supplier.amountClaimed}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div >
              <label>Approval Date</label>
              <input
                type="text"
                value={supplier.approvalDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
              <label>Approval</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={supplier.approvalName}
                  readOnly
                  className={styles.editInputField}
                />
                {supplier.approvalPath ? (
                  <div className={styles.linksInsideInput}>
                    <a
                      href={`${config.baseURL}/${supplier.approvalPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      View
                    </a>
                    <a href={`${config.baseURL}/download${supplier.approvalPath}`} className={styles.fileLink}>
                      Download
                    </a>
                  </div>
                ) : (
                  <span className={styles.naText}>N/A</span>
                )}
              </div>
            </div>

          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Approver</label>
              <input
                type="text"
                value={supplier.approver}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Claim Number</label>
              <input
                type="text"
                value={supplier.claimNumber}
                readOnly
                className={styles.editInputField}
              />
            </div>
          </div>

          <div className={styles.twoInputsRow}>

          <div>
              <label>Type</label>
              <input
                type="text"
                value={supplier.type}
                readOnly
                className={styles.editInputField}
              />
            </div>
          
            <div>
              <label>Date Accounted</label>
              <input
                type="text"
                value={supplier.dateAccounted || "N/A"}
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
                value={supplier.dateTakenToApprover || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div>
              <label>Date Taken to Finance</label>
              <input
                type="text"
                value={supplier.dateTakenToFinance}
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
                value={supplier.invoiceDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
              <label>Invoice</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={supplier.invoiceName || "N/A"}
                  readOnly
                  className={styles.editInputField}
                />
                {supplier.invoicePath ? (
                  <div className={styles.linksInsideInput}>
                    <a
                      href={`${config.baseURL}/${supplier.invoicePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileLink}
                    >
                      View
                    </a>
                    <a
                      href={`${config.baseURL}/${supplier.invoicePath}`}
                      download
                      className={styles.fileLink}
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <span className={styles.naText}>N/A</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.twoInputsRow}>
            <div>
              <label>Payment Date</label>
              <input
                type="text"
                value={supplier.paymentDate || "N/A"}
                readOnly
                className={styles.editInputField}
              />
            </div>
            <div className={styles.inputWithLink}>
                  <label>Payment Voucher</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      value={supplier.paymentName || "N/A"}
                      readOnly
                      className={styles.editInputField}
                    />
                    {supplier.paymentPath ? (
                      <div className={styles.linksInsideInput}>
                        <a
                          href={`${config.baseURL}/${supplier.paymentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          View
                        </a>
                        <a
                          href={`${config.baseURL}/${supplier.paymentPath}`}
                          download
                          className={styles.fileLink}
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className={styles.naText}>N/A</span>
                    )}
                  </div>
                </div>
              </div>

          <div className={styles.twoInputsRow}>
                    <button
                            type='button'
                            className={`${styles.button} ${styles.view}`}
                            onClick={() => handleUpdateClick(supplier)}
                        >
                          Update
                        </button>
                        <button
                            className={`${styles.button} ${styles.delete}`}
                            onClick={() => handleDelete(supplier.uuid)}
                        >
                          Delete
                        </button>
       
            <div>
       
            </div>
          </div>
        </form>
      </div>

      {showPopup && (
            <UpdateSupplierPopup
                supplier={selectedSupplier}
                onClose={handleClosePopup}
                onSave={handleSavePopup}
            />
        )}
    </div>
  );
};

export default SingleSuppliersPage;
