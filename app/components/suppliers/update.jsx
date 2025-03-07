"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';
import { config } from "/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateSupplierPopup = ({ procurement, onClose, onSave }) => {
    
    // console.log(supplier)
    const [formData, setFormData] = useState({
        itemName: '',
        suppliers: '',
        itemDescription: '',
        amountClaimed: '',
        approver: '',
        dateTakenToApprover: null,
        dateTakenToFinance:null,
        type: '',
        PvNo: '',
        claimNumber: '',
        accounted: '',
        dateAccounted: null,
        procurement:'',
        approvalDate: null,
        approvalName: '',
        paymentDate:null,
       
    });

    useEffect(() => {
        if (procurement) {
            setFormData({
                itemName: procurement.itemName || '',
                suppliers: procurement.suppliers || '',
                itemDescription: procurement.itemDescription || '',
                amountClaimed: procurement.amountClaimed || '',
                approver: procurement.approver || '',
                dateTakenToApprover: procurement.dateTakenToApprover
                    ? new Date(procurement.dateTakenToApprover).toISOString().slice(0, 16)
                    : '',
                dateTakenToFinance: procurement.dateTakenToFinance
                    ? new Date(procurement.dateTakenToFinance).toISOString().slice(0, 16)
                    : '',
                procurement: procurement.document || "", 
                type: procurement.type || '',
                PvNo: procurement.PvNo || '',
                claimNumber: procurement.claimNumber || '',
                dateAccounted: procurement.dateAccounted
                    ? new Date(procurement.dateAccounted).toISOString().slice(0, 16)
                    : '',
                approvalDate: procurement.approvalDate
                    ? new Date(procurement.approvalDate).toISOString().slice(0, 10)
                    : '',
                approvalName: procurement.approvalName || '',
                invoiceDate: procurement.invoiceDate
                    ? new Date(procurement.invoiceDate).toISOString().slice(0, 10)
                    : '',
                paymentDate: procurement.paymentDate
                    ? new Date(procurement.paymentDate).toISOString().slice(0, 10)
                    : '',
                
               
                
            });
        }
    }, [procurement]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    
    const handleSave = async () => {
        const formDataToSend = new FormData(); // Define formDataToSend first
        
        // Append text fields, excluding the fields that should not be sent
        const excludedFields = [
            'approvalName',
            'approvalPath',
            'paymentVoucherName',
            'paymentVoucherPath',
            'invoicePath',
        ];
    
        // Append all form fields except excluded ones
        Object.keys(formData).forEach((key) => {
            if (!excludedFields.includes(key) && !['document'].includes(key)) {
                formDataToSend.append(key, formData[key]);
            }
        });
    
        try {
            const url = `${config.baseURL}/procurements/${procurement.uuid}/update`;
            console.log('Update URL:', url);
            console.log('Form Data being sent:', Object.fromEntries(formDataToSend));
    
            const response = await fetch(url, {
                method: 'PATCH',
                body: formDataToSend,
            });
    
            // Log the response
            const responseData = await response.json();
            console.log('Update Response:', responseData);
            if (response.ok) {
               alert('Item updated successfully!');
                await onSave(true);
            } else {
                console.error('Failed to update supplier', responseData);
              alert(responseData.message || 'Failed to update the item!');
                onSave(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
            onSave(false);
        }
    };

    const renderFields = () => {
        switch (formData.type) {
            case "Claim":
                return (
                    <>
                        <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input
                                type="text"
                                id="PvNo"
                                name="PvNo"
                                value={formData.PvNo }
                                onChange={handleChange}
                                placeholder="e.g. PV123456"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="claimNumber">Claim Number</label>
                            <input
                                type="text"
                                id="claimNumber"
                                name="claimNumber"
                                value={formData.claimNumber}
                                onChange={handleChange}
                                placeholder="e.g. CL123456"
                                required
                            />
                        </div>
                    </>
                );
            case "Petty Cash":
                return (
                    <div className={styles.inputGroup}>
                    <label htmlFor="PvNo">PV No</label>
                    <input
                        type="text"
                        id="PvNo"
                        name="PvNo"
                        value={formData.PvNo}
                        onChange={handleChange}
                        placeholder="e.g. PV123456"
                        required
                    />
                </div>
                );
            case "Imprest":
                return (
                    <>
                       <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input
                                type="text"
                                id="PvNo"
                                name="PvNo"
                                value={formData.PvNo}
                                onChange={handleChange}
                                placeholder="e.g. PV123456"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="accounted">Accounted</label>
                            <select
                                id="accounted"
                                name="accounted"
                                value={formData.accounted}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="dateAccounted">Date Accounted</label>
                            <input
                                type="datetime-local"
                                id="dateAccounted"
                                name="dateAccounted"
                                value={formData.dateAccounted}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                    <h2>Update Supplier</h2>
                </div>
                <ToastContainer position="top-center" autoClose={3000} />
                <form>
                <div className={styles.inputGroup}>
                        <label htmlFor="itemName">Item Name</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            placeholder="e.g. Office Chairs"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="supplier">Supplier</label>
                        <input
                            type="text"
                            id="supplier"
                            name="suppliers"
                            value={formData.suppliers}
                            onChange={handleChange}
                            placeholder="e.g. ABC Supplies Ltd."
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="itemDescription">Item Description</label>
                        <input
                            type="text"
                            id="itemDescription"
                            name="itemDescription"
                            value={formData.itemDescription}
                            onChange={handleChange}
                            placeholder="e.g. Office Chairs"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="amountClaimed">Amount Claimed</label>
                        <input
                            type="number"
                            id="amountClaimed"
                            name="amountClaimed"
                            value={formData.amountClaimed}
                            onChange={handleChange}
                            placeholder="e.g. 1500"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="approver">Approver</label>
                        <input
                            type="text"
                            id="approver"
                            name="approver"
                            value={formData.approver}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="dateTakenToApprover">Date Taken To Approver</label>
                        <input
                            type="datetime-local"
                            id="dateTakenToApprover"
                            name="dateTakenToApprover"
                            value={formData.dateTakenToApprover}
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="approvalDate">Approval Date</label>
                        <input
                            type="date"
                            id="approvalDate"
                            name="approvalDate"
                            value={formData.approvalDate}
                            onChange={handleChange}
                           
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="dateTakenToFinance">Date Taken To Finance</label>
                        <input
                            type="datetime-local"
                            id="dateTakenToFinance"
                            name="dateTakenToFinance"
                            value={formData.dateTakenToFinance}
                            onChange={handleChange}
                           
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="invoiceDate">Invoice Date</label>
                        <input
                            type="date"
                            id="invoiceDate"
                            name="invoiceDate"
                            value={formData.invoiceDate}
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="paymentDate">Payment Date</label>
                        <input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                           
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="document">Document</label>
                        <div className={styles.doc}>
                            <div className={styles.docs}>
                            <input
                                type="text"
                                id="procurement"
                                name="procurement"
                                value={formData.procurement instanceof File ? formData.procurement.name : formData.procurement ? formData.procurement.split('/').pop() : "N/A"}
                                readOnly
                                placeholder="Procurement document"
                               
                            />

                                {formData.procurement && typeof formData.procurement === "string" && (
                                    <a
                                        href={`${config.baseURL}/${formData.procurement}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.fileLink}
                                    >
                                        Open File
                                    </a>
                                )}

                            </div>

                             <input
                                type="file"
                                id="procurement"
                                name="procurement"
                                onChange={(e) => setFormData({ ...formData, procurement: e.target.files[0] })}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            
                        >
                            <option value="">Select Type</option>
                            <option value="Claim">Claim</option>
                            <option value="Imprest">Imprest</option>
                            <option value="Petty Cash">Petty Cash</option>
                        </select>
                    </div>


                    {renderFields()}

                    <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
                        <button type="button" onClick={handleSave}>Update</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateSupplierPopup;