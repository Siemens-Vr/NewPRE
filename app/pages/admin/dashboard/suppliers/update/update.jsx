"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';
import { config } from "/config";

const UpdateSupplierPopup = ({ supplier, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        suppliers: '',
        itemDescription: '',
        amountClaimed: '',
        approver: '',
        dateTakenToApprover: '',
        dateTakenToFinance: '',
        type: '',
        PvNo: '',
        claimNumber: '',
        accounted: '',
        dateAccounted: '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                suppliers: supplier.suppliers || '',
                itemDescription: supplier.itemDescription || '',
                amountClaimed: supplier.amountClaimed || '',
                approver: supplier.approver || '',
                dateTakenToApprover: supplier.dateTakenToApprover ? new Date(supplier.dateTakenToApprover).toISOString().slice(0,16) : '',
                dateTakenToFinance: supplier.dateTakenToFinance ? new Date(supplier.dateTakenToFinance).toISOString().slice(0,16) : '',
                type: supplier.type || '',
                PvNo: supplier.PvNo || '',
                claimNumber: supplier.claimNumber || '',
                accounted: supplier.accounted || '',
                dateAccounted: supplier.dateAccounted ? new Date(supplier.dateAccounted).toISOString().slice(0,16) : '',
            });
        }
    }, [supplier]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${config.baseURL}/supplier/${supplier.uuid}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Supplier updated successfully!');
                onSave();
            } else {
                console.error('Failed to update supplier', await response.text());
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
                            value={formData.pvNo}
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
                    <h2>Update Supplier</h2>
                </div>
                <form>
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
                            required
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
                            required
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

export default UpdateSupplierPopup;