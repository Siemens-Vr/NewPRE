"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';
import { config } from "/config";
import { useParams } from "next/navigation";

const UpdateTransportPopup = ({ transport, onClose, onSave }) => {
    const { uuid, id } = useParams();
    const [formData, setFormData] = useState({
        destination:'',
        travelPeriod:'',
        travelers:'',
        dateOfRequest:null,
        dateReceived:null,
        approver:'',
        transport:'',
        approvalDate:null,
        paymentDate:null,
        allowance:'',
        type: '',
        PvNo: '',
        claimNumber: '',
        accounted: '',
        dateAccounted: null,

    });

    useEffect(() => {
        if (transport) {
            setFormData({
                destination: transport.destination || "",
                travelPeriod: transport.travelPeriod || "",
                travelers: transport.travelers || "",
                dateOfRequest: transport.dateOfRequest 
                ? new Date(transport.dateOfRequest).toISOString().slice(0, 10)
                : '',
                dateReceived: transport.dateReceived
                ? new Date(transport.dateReceived).toISOString().slice(0, 10)
                : '',
                transport:transport.document || "",
                approver: transport.approver || "",
                approvalDate: transport.approvalDate 
                ? new Date(transport.approvalDate).toISOString().slice(0, 10)
                : '',
                paymentDate: transport.paymentDate 
                ? new Date(transport.paymentDate).toISOString().slice(0, 10)
                : '',
                allowance: transport.allowance || "",
                type: transport.type || "",
                PvNo: transport.PvNo || "",
                claimNumber: transport.claimNumber || "",
                accounted: transport.accounted || "",
                dateAccounted: transport.dateAccounted 
                ? new Date(transport.dateAccounted).toISOString().slice(0, 10)
                : '',
            });
        }
    }, [transport]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!transport || !transport.uuid) {
            console.error("Transport data is missing or undefined.");
            return;
        }
    
        try {
            const response = await fetch(`${config.baseURL}/transports/${transport.uuid}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert('Transport details updated successfully!');
                onSave();
            } else {
                console.error('Failed to update transport', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
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
                            required
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
                            value={formData.PvNo}
                            onChange={handleChange}
                            required
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
                                required
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
                                required
                            />
                        </div>
                    </>
                )}
            </>
        );
    };
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                <h1>Edit Transport {id}</h1>
                <p>Project ID: {uuid}</p>
                </div>
                <form>
                <div className={styles.inputGroup}>
                        <label htmlFor="destination">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            placeholder="e.g. Nairobi"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="travelPeriod">Travel Period</label>
                        <input
                            type="text"
                            id="travelPeriod"
                            name="travelPeriod"
                            value={formData.travelPeriod}
                            onChange={handleChange}
                            placeholder="e.g. 3 days."
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="travelers">Travelers</label>
                        <input
                            type="text"
                            id="travelers"
                            name="travelers"
                            value={formData.travelers}
                            onChange={handleChange}
                            placeholder="e.g. John Doe, Jane Doe"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="allowance">Allowance</label>
                        <input
                            type="number"
                            id="allowance"
                            name="allowance"
                            value={formData.allowance}
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
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="document">Document</label>
                        <div className={styles.doc}>
                            <div className={styles.docs}>
                            <input
                                type="text" 
                                id="transport"
                                name="transport"
                                value={formData.transport instanceof File ? formData.transport.name : formData.transport ? formData.transport.split('/').pop() : "N/A"}
                                readOnly
                                placeholder="transport document"
                                required
                            />

                                {formData.transport && typeof formData.transport === "string" && (
                                    <a
                                        href={`${config.baseURL}/${formData.document}`}
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
                                id="transport"
                                name="transport"
                                onChange={(e) => setFormData({ ...formData, transport: e.target.files[0] })}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="approvalDate">Approval Date</label>
                        <input
                            type="date"
                            id="approvalDate"
                            name="approvalDate"
                            value={formData.approvalDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="dateOfRequest">Request Date</label>
                        <input
                            type="date"
                            id="dateOfRequest"
                            name="dateOfRequest"
                            value={formData.dateOfRequest}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="dateReceived">Received Date</label>
                        <input
                            type="date"
                            id="dateReceived"
                            name="dateReceived"
                            value={formData.dateReceived}
                            onChange={handleChange}
                            required
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
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Claim">Claim</option>
                            <option value="Imprest">Imprest</option>
                            <option value="Petty Cash">Petty Cash</option>
                        </select>
                    </div>

                    {renderFields()}
                    <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTransportPopup;
