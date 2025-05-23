// "use client";
// import { useState , usePara} from "react";
// import styles from '@/app/styles/supplier/addSuppliers.module.css';
// import { config } from "/config";
// import { useParams, useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
//
// const ProcurementAddPage = () => {
//     const [isloading, setIsloading] = useState(false)
//     const params = useParams()
//     const router =useRouter ();
//     const {uuid, phaseuuid, outputuuid} = params
//     const [formData, setFormData] = useState({
//         suppliers: "",
//         itemName:"",
//         itemDescription: "",
//         amountClaimed: "",
//         approver: "",
//         dateTakenToApprover: "",
//         approvalDate: "",
//         paymentDate:"",
//         invoiceDate:"",
//         dateTakenToFinance: "",
//         type: "",
//         claimNumber: "",
//         PvNo: "",
//         accounted: "",
//         dateAccounted: "",
//         procurement: null,
//
//
//     });
//     console.log(formData);
//     console.log(outputuuid);
//
//     const [successMessage, setSuccessMessage] = useState("");
//
//     const handleChange = (e) => {
//         const { name, type, value, files } = e.target;
//
//         if (type === "file") {
//             setFormData({ ...formData, [name]: files[0] }); // Store the first file
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsloading(true)
//        // Create a FormData object for file and text data
//        const formDataToSend = new FormData();
//
//        // Append text fields
//        Object.keys(formData).forEach((key) => {
//            if (key === "approval" || key === "payment" || key === "invoice") {
//                if (formData[key]) {
//                    formDataToSend.append(key, formData[key]); // Append file fields
//                }
//            } else {
//                formDataToSend.append(key, formData[key]);
//            }
//        });
//
//        for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}:`, value);
//     }
//
//         try {
//             const response = await fetch(`${config.baseURL}/procurements/${outputuuid}`, {
//                 method: "POST",
//                 body: formDataToSend, // Use FormData as the request body
//             });
//
//             if (response.ok) {
//                 setSuccessMessage("Supplier added successfully!");
//                 setFormData({
//                     suppliers: "",
//                     itemName:"",
//                     itemDescription: "",
//                     amountClaimed: "",
//                     approver: "",
//                     dateTakenToApprover: "",
//                     approvalDate: "",
//                     paymentDate: "",
//                     invoiceDate: "",
//                     dateTakenToFinance: "",
//                     type: "",
//                     claimNumber: "",
//                     PvNo: "",
//                     accounted: "",
//                     dateAccounted: "",
//                     project: "",
//                     procurement: null,
//
//                 });
//                 setIsloading(false)
//             } else {
//                 toast.error("Failed to add Supplier", await response.text());
//             }
//         } catch (error) {
//             toast.error("Error:", error);
//         }
//         router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`);
//
//     };
//
//
//     const renderFields = () => {
//         return (
//             <div className={styles.modalOverlay} onClick={onClose}>
//                 <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//
//                     <div className={styles.container}>
//
//                         {(formData.type === "Claim" || formData.type === "Petty Cash") && (
//                             <div className={styles.divInput}>
//                                 <label htmlFor="claimNumber" className={styles.label}>Claim Number</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Claim Number"
//                                     name="claimNumber"
//                                     value={formData.claimNumber}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                         )}
//
//                         {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
//                             <div className={styles.divInput}>
//                                 <label htmlFor="PvNo" className={styles.label}>PV No</label>
//                                 <input
//                                     type="text"
//                                     placeholder="PV No"
//                                     name="PvNo"
//                                     value={formData.PvNo}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                         )}
//
//                         {formData.type === "Imprest" && (
//                             <>
//                                 <div className={styles.divInput}>
//                                     <label htmlFor="accounted" className={styles.label}>Accounted</label>
//                                     <select
//                                         name="accounted"
//                                         value={formData.accounted}
//                                         onChange={handleChange}
//
//                                         className={styles.select}
//                                     >
//                                         <option value="">Select Accounted</option>
//                                         <option value="Yes">Yes</option>
//                                         <option value="No">No</option>
//                                     </select>
//                                 </div>
//                                 <div className={styles.divInput}>
//                                     <label htmlFor="dateAccounted" className={styles.label}>Date Accounted</label>
//                                     <input
//                                         type="datetime-local"
//                                         name="dateAccounted"
//                                         value={formData.dateAccounted}
//                                         onChange={handleChange}
//
//                                     />
//                                 </div>
//                             </>
//                         )}
//
//                     );
//
//                     };
//
//
//                     return (
//                     <div className={styles.container}>
//                         {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
//                         <ToastContainer position="top-center" autoClose={3000}/>
//                         <form onSubmit={handleSubmit} className={styles.form}>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="itemName" className={styles.label}>Item Name</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Item Name"
//                                     name="itemName"
//                                     value={formData.itemName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="suppliers" className={styles.label}>Suppliers</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Suppliers"
//                                     name="suppliers"
//                                     value={formData.suppliers}
//                                     onChange={handleChange}
//                                     required
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <div className={`${styles.divInput} ${styles.fullWidth}`}>
//                                     <label htmlFor="itemDescription" className={styles.label}>Item Description</label>
//                                     <textarea
//                                         type="text"
//                                         placeholder="Item Description"
//                                         name="itemDescription"
//                                         value={formData.itemDescription}
//                                         onChange={handleChange}
//                                         required
//
//                                     />
//
//                                 </div>
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="amountClaimed" className={styles.label}>Amount Claimed</label>
//                                 <input
//                                     type="text"
//                                     placeholder="Amount Claimed"
//                                     name="amountClaimed"
//                                     value={formData.amountClaimed}
//                                     onChange={handleChange}
//                                     required
//
//                                 />
//                             </div>
//
//                             <div className={styles.divInput}>
//                                 <label htmlFor="approver" className={styles.label}>Approver</label>
//                                 <select
//                                     name="approver"
//                                     value={formData.approver}
//                                     onChange={handleChange}
//
//                                     className={styles.select}
//                                 >
//                                     <option value="">Select Approver</option>
//                                     <option value="VC">VC</option>
//                                     <option value="DVC">DVC</option>
//
//                                 </select>
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="dateTakenToApprover" className={styles.label}>Date Taken To
//                                     Approver</label>
//                                 <input
//                                     type="date"
//                                     name="dateTakenToApprover"
//                                     value={formData.dateTakenToApprover}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="procurement" className={styles.label}>Document </label>
//                                 <input
//                                     type="file"
//                                     name="procurement"
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="approvalDate" className={styles.label}>Approval Date</label>
//                                 <input
//                                     type="date"
//                                     name="approvalDate"
//                                     value={formData.approvalDate}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//
//                             <div className={styles.divInput}>
//                                 <label htmlFor="dateTakenToFinance" className={styles.label}>Date Taken To
//                                     Finance</label>
//                                 <input
//                                     type="date"
//                                     name="dateTakenToFinance"
//                                     value={formData.dateTakenToFinance}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="paymentDate" className={styles.label}>Payment Date</label>
//                                 <input
//                                     type="date"
//                                     name="paymentDate"
//                                     value={formData.paymentDate}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="invoiceDate" className={styles.label}>Invoice Date</label>
//                                 <input
//                                     type="date"
//                                     name="invoiceDate"
//                                     value={formData.invoiceDate}
//                                     onChange={handleChange}
//
//                                 />
//                             </div>
//                             <div className={styles.divInput}>
//                                 <label htmlFor="type" className={styles.label}>Type</label>
//                                 <select
//                                     name="type"
//                                     value={formData.type}
//                                     onChange={handleChange}
//                                     required
//                                     className={styles.select}
//                                 >
//                                     <option value="">Select Type</option>
//                                     <option value="Claim">Claim</option>
//                                     <option value="Imprest">Imprest</option>
//                                     <option value="Petty Cash">Petty Cash</option>
//                                 </select>
//                             </div>
//
//                             {renderFields()}
//
//                             <div className={styles.buttonContainer}>
//                                 <button type="submit">{isloading ? "Submitting..." : "Submit"}</button>
//                             </div>
//                         </form>
//                     </div>
//                     </div>
//                 </div>
//             </div>
//                     );
//                     };
//
//                     export default ProcurementAddPage;
"use client";
import React, { useState } from "react";
import { config } from "/config";
import styles from '@/app/styles/supplier/addSuppliers.module.css';
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProcurementAddPage = ({ onClose }) => {
    const [isloading, setIsloading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { uuid, phaseuuid, outputuuid } = params;
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        suppliers: "",
        itemName: "",
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
        PvNo: "",
        accounted: "",
        dateAccounted: "",
        procurement: null,
    });

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${config.baseURL}/procurements/${outputuuid}`, {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                setSuccessMessage("Supplier added successfully!");
                setFormData({
                    suppliers: "",
                    itemName: "",
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
                    PvNo: "",
                    accounted: "",
                    dateAccounted: "",
                    procurement: null,
                });
                setIsloading(false);
                router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/procurement`);
            } else {
                toast.error("Failed to add Supplier");
            }
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <ToastContainer position="top-center" autoClose={3000} />
                <form onSubmit={handleSubmit} className={styles.form}>
                    {successMessage && (
                        <div className={`${styles.successMessage} ${styles.gridSpan}`}>
                            {successMessage}
                        </div>
                    )}

                    <div className={styles.divInput}>
                        <label className={styles.label}>Item Name</label>
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Suppliers</label>
                        <input type="text" name="suppliers" value={formData.suppliers} onChange={handleChange} required className={styles.input} />
                    </div>

                    <div className={`${styles.divInput} ${styles.gridSpan}`}>
                        <label className={styles.label}>Item Description</label>
                        <textarea name="itemDescription" value={formData.itemDescription} onChange={handleChange} required className={styles.textarea} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Amount Claimed</label>
                        <input type="text" name="amountClaimed" value={formData.amountClaimed} onChange={handleChange} required className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Approver</label>
                        <select name="approver" value={formData.approver} onChange={handleChange} className={styles.select}>
                            <option value="">Select Approver</option>
                            <option value="VC">VC</option>
                            <option value="DVC">DVC</option>
                        </select>
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Date Taken To Approver</label>
                        <input type="date" name="dateTakenToApprover" value={formData.dateTakenToApprover} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Document</label>
                        <input type="file" name="procurement" onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Approval Date</label>
                        <input type="date" name="approvalDate" value={formData.approvalDate} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Date Taken To Finance</label>
                        <input type="date" name="dateTakenToFinance" value={formData.dateTakenToFinance} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Payment Date</label>
                        <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Invoice Date</label>
                        <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className={styles.input} />
                    </div>

                    <div className={styles.divInput}>
                        <label className={styles.label}>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className={styles.select} required>
                            <option value="">Select Type</option>
                            <option value="Claim">Claim</option>
                            <option value="Imprest">Imprest</option>
                            <option value="Petty Cash">Petty Cash</option>
                        </select>
                    </div>

                    {(formData.type === "Claim" || formData.type === "Petty Cash") && (
                        <div className={styles.divInput}>
                            <label className={styles.label}>Claim Number</label>
                            <input type="text" name="claimNumber" value={formData.claimNumber} onChange={handleChange} className={styles.input} />
                        </div>
                    )}

                    {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
                        <div className={styles.divInput}>
                            <label className={styles.label}>PV No</label>
                            <input type="text" name="PvNo" value={formData.PvNo} onChange={handleChange} className={styles.input} />
                        </div>
                    )}

                    {formData.type === "Imprest" && (
                        <>
                            <div className={styles.divInput}>
                                <label className={styles.label}>Accounted</label>
                                <select name="accounted" value={formData.accounted} onChange={handleChange} className={styles.select}>
                                    <option value="">Select Accounted</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className={styles.divInput}>
                                <label className={styles.label}>Date Accounted</label>
                                <input type="datetime-local" name="dateAccounted" value={formData.dateAccounted} onChange={handleChange} className={styles.input} />
                            </div>
                        </>
                    )}

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.button}>
                            {isloading ? "Submitting..." : "Submit"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcurementAddPage;
