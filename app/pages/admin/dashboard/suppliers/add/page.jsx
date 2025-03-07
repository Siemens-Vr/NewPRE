"use client";
import { useState } from "react";
import styles from '@/app/styles/supplier/addSupplier.module.css';
import { config } from "/config";


const SuppliersAddPage = () => {
    const [isloading, setIsloading] = useState(false)
    const [formData, setFormData] = useState({
        suppliers: "",
        itemDescription: "",
        amountClaimed: "",
        approver: "",
        dateTakenToApprover: "",
        approvalDate: "",
        paymentDate:"",
        invoiceDate:"",
        dateTakenToFinance: "",
        type: "",
        claimNumber: "",
        pvNo: "",
        accounted: "",
        dateAccounted: "",
        project:"",
        approval: null, 
        payment: null,  
        invoice: null,  
        
    });

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
    
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] }); // Store the first file
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true)
       // Create a FormData object for file and text data
       const formDataToSend = new FormData();

       // Append text fields
       Object.keys(formData).forEach((key) => {
           if (key === "approval" || key === "payment" || key === "invoice") {
               if (formData[key]) {
                   formDataToSend.append(key, formData[key]); // Append file fields
               }
           } else {
               formDataToSend.append(key, formData[key]);
           }
       });

       for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
    }
    
        try {
            const response = await fetch(`${config.baseURL}/suppliers`, {
                method: "POST",
                body: formDataToSend, // Use FormData as the request body
            });

            if (response.ok) {
                setSuccessMessage("Supplier added successfully!");
                setFormData({
                    suppliers: "",
                    itemDescription: "",
                    amountClaimed: "",
                    approver: "",
                    dateTakenToApprover: "",
                    approvalDate: "",
                    paymentDate: "",
                    invoiceDate: "",
                    dateTakenToFinance: "",
                    type: "",
                    claimNumber: "",
                    pvNo: "",
                    accounted: "",
                    dateAccounted: "",
                    project: "",
                    approval: null, // Reset file fields
                    payment: null,
                    invoice: null,
                });
                setIsloading(false)
            } else {
                console.error("Failed to add Supplier", await response.text());
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const renderFields = () => {
        return (
            <>
                {(formData.type === "Claim" || formData.type === "Petty Cash") && (
                    <div className={styles.divInput}>
                        <label htmlFor="claimNumber" className={styles.label}>Claim Number</label>
                        <input
                            type="text"
                            placeholder="Claim Number"
                            name="claimNumber"
                            value={formData.claimNumber}
                            onChange={handleChange}
                           
                        />
                    </div>
                )}
    
                {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
                    <div className={styles.divInput}>
                        <label htmlFor="pvNo" className={styles.label}>PV No</label>
                        <input
                            type="text"
                            placeholder="PV No"
                            name="pvNo"
                            value={formData.pvNo}
                            onChange={handleChange}
                         
                        />
                    </div>
                )}
    
                {formData.type === "Imprest" && (
                    <>
                        <div className={styles.divInput}>
                            <label htmlFor="accounted" className={styles.label}>Accounted</label>
                            <select
                                name="accounted"
                                value={formData.accounted}
                                onChange={handleChange}
                               
                                className={styles.select}
                            >
                                <option value="">Select Accounted</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="dateAccounted" className={styles.label}>Date Accounted</label>
                            <input
                                type="datetime-local"
                                name="dateAccounted"
                                value={formData.dateAccounted}
                                onChange={handleChange}
                               
                            />
                        </div>
                    </>
                )}
            </>
        );
    };
    

    return (
        <div className={styles.container}>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.divInput}>
                    <label htmlFor="suppliers" className={styles.label}>Suppliers</label>
                    <input
                        type="text"
                        placeholder="Suppliers"
                        name="suppliers"
                        value={formData.suppliers}
                        onChange={handleChange}
                        required
                       
                    />
                </div>
           
                <div className={styles.divInput}>
                    <label htmlFor="amountClaimed" className={styles.label}>Amount Claimed</label>
                    <input
                        type="text"
                        placeholder="Amount Claimed"
                        name="amountClaimed"
                        value={formData.amountClaimed}
                        onChange={handleChange}
                    
                    />
                </div>
                <div className={`${styles.divInput} ${styles.fullWidth}`}>
                    <label htmlFor="itemDescription" className={styles.label}>Item Description</label>
                    <textarea
                        type="text"
                        placeholder="Item Description"
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={handleChange}
                        required
                  
                    />

                </div>
                <div className={styles.divInput}>
                    <label htmlFor="approver" className={styles.label}>Approver</label>
                    <select
                        name="approver"
                        value={formData.approver}
                        onChange={handleChange}
                   
                        className={styles.select}
                    >
                        <option value="">Select Approver</option>
                        <option value="VC">VC</option>
                        <option value="DVC">DVC</option>

                    </select>
                </div>
                <div className={styles.divInput}>
                    <label htmlFor="dateTakenToApprover" className={styles.label}>Date Taken To Approver</label>
                    <input
                        type="date"
                        name="dateTakenToApprover"
                        value={formData.dateTakenToApprover}
                        onChange={handleChange}
                       
                    />
                </div>
                <div className={styles.divInput}>
                <div className={styles.divInputs}>
                <div className={styles.divInput}>
                        <label htmlFor="approval" className={styles.label}>Approval </label>
                        <input
                            type="file"
                            name="approval"
                            onChange={handleChange}
                        
                        />
                    </div>
                    <div className={styles.divInput}>
                        <label htmlFor="approvalDate" className={styles.label}>Approval Date</label>
                        <input
                            type="date"
                            name="approvalDate"
                            value={formData.approvalDate}
                            onChange={handleChange}
                          
                        />
                    </div>
                   
                  
                </div>
                </div>
           
                <div className={styles.divInput}>
                <label htmlFor="dateTakenToFinance" className={styles.label}>Date Taken To Finance</label>
                    <input
                        type="date"
                        name="dateTakenToFinance"
                        value={formData.dateTakenToFinance}
                        onChange={handleChange}
                     
                    />
                </div>
                <div className={styles.divInput}>
                    <div className={styles.divInputs}>
                    <div className={styles.divInput}>
                            <label htmlFor="payment" className={styles.label}>Payment </label>
                            <input
                                type="file"
                                name="payment"
                                onChange={handleChange}
                            
                            />
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="paymentDate" className={styles.label}>Payment Date</label>
                            <input
                                type="date"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={handleChange}
                         
                            />
                        </div>
                     

                    </div>
                </div>

                <div className={styles.divInput}>
                    <div className={styles.divInputs}>
                        <div className={styles.divInput}>
                            <label htmlFor="invoiceDate" className={styles.label}>Invoice Date</label>
                            <input
                                type="date"
                                name="invoiceDate"
                                value={formData.invoiceDate}
                                onChange={handleChange}
                              
                            />
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="invoice" className={styles.label}>Invoice</label>
                            <input
                                type="file"
                                name="invoice"
                                onChange={handleChange}
                             
                            />
                        </div>
                    </div>
                </div>
            
                <div className={styles.divInput}>
                    <label htmlFor="project" className={styles.label}>Project</label>
                    <select
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Select project vote</option>
                        <option value="SIFA">SIFA</option>
                        <option value="Eureka">NRF-EUREKA</option>
                        <option value ="NRF-PAMOJA">NRF-PAMOJA</option>
                        <option value="CMU">CMU</option>
                        <option value="Worldskills">Worldskills</option>
                        <option value="ERASMUS">ERASMUS</option>
                        <option value="SMSCP">SMSCP</option>


                    </select>
                </div>
                <div className={styles.divInput}>
                    <label htmlFor="type" className={styles.label}>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Select Type</option>
                        <option value="Claim">Claim</option>
                        <option value="Imprest">Imprest</option>
                        <option value="Petty Cash">Petty Cash</option>
                    </select>
                </div>

                {renderFields()}

                <div className={styles.buttonContainer}>
                    <button type="submit">{isloading? "Submitting...":"Submit"}</button>
                </div>
            </form>
        </div>
    );
};

export default SuppliersAddPage;