// "use client"
// import React, { useState, useEffect } from 'react';
// import styles from '@/app/styles/supplier/UpdateSupplierPopups.module.css';
// import { config } from "/config";
// import { useParams } from "next/navigation";
//
//
// const UpdateSupplierPopup = ({ procurement, onClose, onSave }) => {
//     const { uuid, procurementUuid } = useParams();
//     const [formData, setFormData] = useState({
//         suppliers: '',
//         itemDescription: '',
//         amountClaimed: '',
//         approver: '',
//         dateTakenToApprover: '',
//         dateTakenToFinance: '',
//         type: '',
//         PvNo: '',
//         claimNumber: '',
//         accounted: '',
//         dateAccounted: '',
//     });
//
//     useEffect(() => {
//         if (procurement) {
//             setFormData({
//                 itemName: procurement.itemName || '',
//                 suppliers:procurement.suppliers || '',
//                 itemDescription: procurement.itemDescription || '',
//                 amountClaimed: procurement.amountClaimed || '',
//                 approver: procurement.approver || '',
//                 dateTakenToApprover: procurement.dateTakenToApprover ? new Date(procurement.dateTakenToApprover).toISOString().slice(0,16) : '',
//                 dateTakenToFinance:procurement.dateTakenToFinance ? new Date(procurement.dateTakenToFinance).toISOString().slice(0,16) : '',
//                 type: procurement.type || '',
//                 PvNo: procurement.PvNo || '',
//                 claimNumber: procurement.claimNumber || '',
//                 accounted: procurement.accounted || '',
//                 dateAccounted: procurement.dateAccounted ? new Date(procurement.dateAccounted).toISOString().slice(0,16) : '',
//             });
//         }
//     }, [procurement]);
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleSave = async () => {
//         if (!procurement || !procurement.uuid) {
//             console.error("Procurement data is missing or undefined.");
//             return;
//         }
//
//         try {
//             const response = await fetch(`${config.baseURL}/procurements/project/${procurement.uuid}/edit`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
//
//             if (response.ok) {
//                 alert('Items updated successfully!');
//                 onSave();
//             } else {
//                 console.error('Failed to update item', await response.text());
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };
//
//
//     const renderFields = () => {
//         return (
//             <>
//                 {(formData.type === "Claim" || formData.type === "Petty Cash") && (
//                     <div className={styles.divInput}>
//                         <label htmlFor="claimNumber" className={styles.label}>Claim Number</label>
//                         <input
//                             type="text"
//                             placeholder="Claim Number"
//                             name="claimNumber"
//                             value={formData.claimNumber}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                 )}
//
//                 {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
//                     <div className={styles.divInput}>
//                         <label htmlFor="pvNo" className={styles.label}>PV No</label>
//                         <input
//                             type="text"
//                             placeholder="PV No"
//                             name="pvNo"
//                             value={formData.PvNo}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                 )}
//
//                 {formData.type === "Imprest" && (
//                     <>
//                         <div className={styles.divInput}>
//                             <label htmlFor="accounted" className={styles.label}>Accounted</label>
//                             <select
//                                 name="accounted"
//                                 value={formData.accounted}
//                                 onChange={handleChange}
//                                 required
//                                 className={styles.select}
//                             >
//                                 <option value="">Select Accounted</option>
//                                 <option value="Yes">Yes</option>
//                                 <option value="No">No</option>
//                             </select>
//                         </div>
//                         <div className={styles.divInput}>
//                             <label htmlFor="dateAccounted" className={styles.label}>Date Accounted</label>
//                             <input
//                                 type="datetime-local"
//                                 name="dateAccounted"
//                                 value={formData.dateAccounted}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </>
//                 )}
//             </>
//         );
//     };
//
//
//     return (
//         <div className={styles.overlay}>
//             <div className={styles.popup}>
//                 <div className={styles.stickyHeader}>
//                 <h1>Edit Procurement {procurementUuid}</h1>
//                 <p>Project ID: {uuid}</p>
//                 </div>
//                 <form>
//                 <div className={styles.inputGroup}>
//                         <label htmlFor="itemName">Item Name</label>
//                         <input
//                             type="text"
//                             id="item Name"
//                             name="itemName"
//                             value={formData.itemName}
//                             onChange={handleChange}
//                             placeholder="e.g. ABC Supplies Ltd."
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="supplier">Supplier</label>
//                         <input
//                             type="text"
//                             id="supplier"
//                             name="suppliers"
//                             value={formData.suppliers}
//                             onChange={handleChange}
//                             placeholder="e.g. ABC Supplies Ltd."
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="itemDescription">Item Description</label>
//                         <input
//                             type="text"
//                             id="itemDescription"
//                             name="itemDescription"
//                             value={formData.itemDescription}
//                             onChange={handleChange}
//                             placeholder="e.g. Office Chairs"
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="amountClaimed">Amount Claimed</label>
//                         <input
//                             type="number"
//                             id="amountClaimed"
//                             name="amountClaimed"
//                             value={formData.amountClaimed}
//                             onChange={handleChange}
//                             placeholder="e.g. 1500"
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="approver">Approver</label>
//                         <input
//                             type="text"
//                             id="approver"
//                             name="approver"
//                             value={formData.approver}
//                             onChange={handleChange}
//                             placeholder="e.g. John Doe"
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="dateTakenToApprover">Date Taken To Approver</label>
//                         <input
//                             type="datetime-local"
//                             id="dateTakenToApprover"
//                             name="dateTakenToApprover"
//                             value={formData.dateTakenToApprover}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="dateTakenToFinance">Date Taken To Finance</label>
//                         <input
//                             type="datetime-local"
//                             id="dateTakenToFinance"
//                             name="dateTakenToFinance"
//                             value={formData.dateTakenToFinance}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="type">Type</label>
//                         <select
//                             id="type"
//                             name="type"
//                             value={formData.type}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Type</option>
//                             <option value="Claim">Claim</option>
//                             <option value="Imprest">Imprest</option>
//                             <option value="Petty Cash">Petty Cash</option>
//                         </select>
//                     </div>
//
//                     {renderFields()}
//
//                     <div className={`${styles.stickyButtons} ${styles.buttonGroup}`}>
//                         <button type="button" onClick={handleSave}>Save</button>
//                         <button type="button" onClick={onClose}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default UpdateSupplierPopup;
"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/supplier/UpdateSupplierPopups.module.css';
import { config } from "/config";
import { useParams } from "next/navigation";

const UpdateSupplierPopup = ({ procurement, onClose, onSave }) => {
    const { uuid, procurementUuid } = useParams();

    const [formData, setFormData] = useState({
        itemName: '',
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
        if (procurement) {
            setFormData({
                itemName: procurement.itemName || '',
                suppliers: procurement.suppliers || '',
                itemDescription: procurement.itemDescription || '',
                amountClaimed: procurement.amountClaimed || '',
                approver: procurement.approver || '',
                dateTakenToApprover: procurement.dateTakenToApprover ? new Date(procurement.dateTakenToApprover).toISOString().slice(0, 16) : '',
                dateTakenToFinance: procurement.dateTakenToFinance ? new Date(procurement.dateTakenToFinance).toISOString().slice(0, 16) : '',
                type: procurement.type || '',
                PvNo: procurement.PvNo || '',
                claimNumber: procurement.claimNumber || '',
                accounted: procurement.accounted || '',
                dateAccounted: procurement.dateAccounted ? new Date(procurement.dateAccounted).toISOString().slice(0, 16) : '',
            });
        }
    }, [procurement]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!procurement || !procurement.uuid) {
            console.error("Procurement data is missing or undefined.");
            return;
        }

        try {
            const response = await fetch(`${config.baseURL}/procurements/project/${procurement.uuid}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Items updated successfully!');
                onSave();
            } else {
                console.error('Failed to update item', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.stickyHeader}>
                    <h1>Edit Procurement - {procurementUuid}</h1>
                    <p>Project ID: {uuid}</p>
                </div>
                <form>
                    <div className={styles.inputGrid}>
                        {/* Main Fields */}
                        <div className={styles.inputGroup}>
                            <label>Item Name</label>
                            <input name="itemName" value={formData.itemName} onChange={handleChange} placeholder="e.g. Office Table" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Supplier</label>
                            <input name="suppliers" value={formData.suppliers} onChange={handleChange} placeholder="e.g. ABC Ltd" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Item Description</label>
                            <input name="itemDescription" value={formData.itemDescription} onChange={handleChange} placeholder="e.g. Tables and Chairs" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Amount Claimed</label>
                            <input type="number" name="amountClaimed" value={formData.amountClaimed} onChange={handleChange} placeholder="e.g. 1500" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Approver</label>
                            <input name="approver" value={formData.approver} onChange={handleChange} placeholder="e.g. VC" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Date Taken To Approver</label>
                            <input type="datetime-local" name="dateTakenToApprover" value={formData.dateTakenToApprover} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Date Taken To Finance</label>
                            <input type="datetime-local" name="dateTakenToFinance" value={formData.dateTakenToFinance} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                <option value="">Select Type</option>
                                <option value="Claim">Claim</option>
                                <option value="Imprest">Imprest</option>
                                <option value="Petty Cash">Petty Cash</option>
                            </select>
                        </div>

                        {/* Conditional Fields */}
                        {(formData.type === "Claim" || formData.type === "Petty Cash") && (
                            <div className={styles.inputGroup}>
                                <label>Claim Number</label>
                                <input name="claimNumber" value={formData.claimNumber} onChange={handleChange} placeholder="Claim Number" />
                            </div>
                        )}

                        {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
                            <div className={styles.inputGroup}>
                                <label>PV No</label>
                                <input name="PvNo" value={formData.PvNo} onChange={handleChange} placeholder="PV No" />
                            </div>
                        )}

                        {formData.type === "Imprest" && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Accounted</label>
                                    <select name="accounted" value={formData.accounted} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Date Accounted</label>
                                    <input type="datetime-local" name="dateAccounted" value={formData.dateAccounted} onChange={handleChange} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Buttons */}
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
