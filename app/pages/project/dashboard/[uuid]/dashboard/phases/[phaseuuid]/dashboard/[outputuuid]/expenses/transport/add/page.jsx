// "use client";
//
// import { useState } from "react";
// import { useSearchParams, useRouter, useParams } from "next/navigation";
// import styles from '@/app/styles/supplier/addSupplier.module.css';
// import { config } from "/config";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
//
// const AddTransportPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [formData, setFormData] = useState({
//     destination: "",
//     description: "",
//     travelPeriod: "",
//     travelers: "",
//     dateOfRequest: "",
//     dateReceived: "",
//     approver: "",
//     approvedDate: "",
//     transport: null,
//     type: "",
//     PvNo: "",
//     claimNumber: "",
//     accounted: "",
//     dateAccounted: "",
//     paymentDate: "",
//     allowance: "",
//     beneficiary: "",
//   });
//
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const projectId = searchParams.get("projectId");
//   const params = useParams();
//   const { uuid, phaseuuid, outputuuid } = params;
//
//   const handleChange = (e) => {
//     const { name, type, value, files } = e.target;
//
//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//
//     const formDataToSend = new FormData();
//
//     Object.keys(formData).forEach((key) => {
//       if (key === "document" && formData[key]) {
//         formDataToSend.append(key, formData[key]);
//       } else {
//         formDataToSend.append(key, formData[key]);
//       }
//     });
//
//     try {
//       const response = await fetch(`${config.baseURL}/transports/${outputuuid}`, {
//         method: "POST",
//         body: formDataToSend,
//       });
//
//       if (response.ok) {
//         setSuccessMessage("Transport details added successfully!");
//
//         setFormData({
//           destination: "",
//           description: "",
//           travelPeriod: "",
//           travelers: "",
//           dateOfRequest: "",
//           dateReceived: "",
//           approver: "",
//           approvedDate: "",
//           transport: null,
//           type: "",
//           PvNo: "",
//           claimNumber: "",
//           accounted: "",
//           dateAccounted: "",
//           paymentDate: "",
//           allowance: "",
//           beneficiary: "",
//         });
//
//         if (router) {
//           router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`);
//         }
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to submit transport details.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const renderFields = () => {
//     return (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modal}>
//
//               {(formData.type === "Claim" || formData.type === "Petty Cash") && (
//                   <div className={styles.divInput}>
//                     <label htmlFor="claimNumber" className={styles.label}>
//                       Claim Number
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="Claim Number"
//                         name="claimNumber"
//                         value={formData.claimNumber}
//                         onChange={handleChange}
//                     />
//                   </div>
//               )}
//
//               {(formData.type === "Claim" ||
//                   formData.type === "Petty Cash" ||
//                   formData.type === "Imprest") && (
//                   <div className={styles.divInput}>
//                     <label htmlFor="PvNo" className={styles.label}>
//                       PV No
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="PV No"
//                         name="PvNo"
//                         value={formData.PvNo}
//                         onChange={handleChange}
//                     />
//                   </div>
//               )}
//
//               {formData.type === "Imprest" && (
//                   <>
//                     <div className={styles.divInput}>
//                       <label htmlFor="accounted" className={styles.label}>
//                         Accounted
//                       </label>
//                       <select
//                           name="accounted"
//                           value={formData.accounted}
//                           onChange={handleChange}
//                           className={styles.select}
//                       >
//                         <option value="">Select Accounted</option>
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                       </select>
//                     </div>
//                     <div className={styles.divInput}>
//                       <label htmlFor="dateAccounted" className={styles.label}>
//                         Date Accounted
//                       </label>
//                       <input
//                           type="datetime-local"
//                           name="dateAccounted"
//                           value={formData.dateAccounted}
//                           onChange={handleChange}
//                       />
//                     </div>
//                   </>
//               )}
//             </>
//             );
//             };
//
//             return (
//             <div className={styles.container}>
//               {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
//               <ToastContainer position="top-center" autoClose={3000}/>
//               <form onSubmit={handleSubmit} className={styles.form}>
//                 <div className={styles.divInput}>
//                   <label htmlFor="destination" className={styles.label}>
//                     Destination
//                   </label>
//                   <input
//                       type="text"
//                       placeholder="Destination"
//                       name="destination"
//                       value={formData.destination}
//                       onChange={handleChange}
//                       required
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="travelPeriod" className={styles.label}>
//                     Travel Period
//                   </label>
//                   <input
//                       type="text"
//                       placeholder="Travel Period"
//                       name="travelPeriod"
//                       value={formData.travelPeriod}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="description" className={styles.label}>
//                     Description
//                   </label>
//                   <textarea
//                       placeholder="Description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       required
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="travelers" className={styles.label}>
//                     Travelers
//                   </label>
//                   <textarea
//                       placeholder="Travelers"
//                       name="travelers"
//                       value={formData.travelers}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="dateOfRequest" className={styles.label}>
//                     Date of Request
//                   </label>
//                   <input
//                       type="date"
//                       name="dateOfRequest"
//                       value={formData.dateOfRequest}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="dateReceived" className={styles.label}>
//                     Date Received
//                   </label>
//                   <input
//                       type="date"
//                       name="dateReceived"
//                       value={formData.dateReceived}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="approver" className={styles.label}>
//                     Approver
//                   </label>
//                   <select
//                       name="approver"
//                       value={formData.approver}
//                       onChange={handleChange}
//                       className={styles.select}
//                   >
//                     <option value="">Select Approver</option>
//                     <option value="VC">VC</option>
//                     <option value="DVC">DVC</option>
//                   </select>
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="approvedDate" className={styles.label}>
//                     Approval Date
//                   </label>
//                   <input
//                       type="date"
//                       name="approvedDate"
//                       value={formData.approvedDate}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="transport" className={styles.label}>
//                     Document
//                   </label>
//                   <input type="file" name="transport" onChange={handleChange}/>
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="paymentDate" className={styles.label}>
//                     Payment Date
//                   </label>
//                   <input
//                       type="date"
//                       name="paymentDate"
//                       value={formData.paymentDate}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="allowance" className={styles.label}>
//                     Allowance
//                   </label>
//                   <input
//                       type="number"
//                       placeholder="Allowance"
//                       name="allowance"
//                       value={formData.allowance}
//                       onChange={handleChange}
//                       required
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="beneficiary" className={styles.label}>
//                     Beneficiary
//                   </label>
//                   <input
//                       type="text"
//                       placeholder="Beneficiary"
//                       name="beneficiary"
//                       value={formData.beneficiary}
//                       onChange={handleChange}
//                   />
//                 </div>
//
//                 <div className={styles.divInput}>
//                   <label htmlFor="type" className={styles.label}>
//                     Type
//                   </label>
//                   <select
//                       name="type"
//                       value={formData.type}
//                       onChange={handleChange}
//                       required
//                       className={styles.select}
//                   >
//                     <option value="">Select Type</option>
//                     <option value="Claim">Claim</option>
//                     <option value="Imprest">Imprest</option>
//                     <option value="Petty Cash">Petty Cash</option>
//                   </select>
//                 </div>
//
//                 {renderFields()}
//
//                 <div className={styles.buttonContainer}>
//                   <button type="submit">
//                     {isLoading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//   </div>
//
//             );
//             };
//
//             export default AddTransportPage;

"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import styles from '@/app/styles/supplier/addSupplier.module.css';
import { config } from "/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTransportPage = ( {onClose} ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        destination: "",
        description: "",
        travelPeriod: "",
        travelers: "",
        dateOfRequest: "",
        dateReceived: "",
        approver: "",
        approvedDate: "",
        transport: null,
        type: "",
        PvNo: "",
        claimNumber: "",
        accounted: "",
        dateAccounted: "",
        paymentDate: "",
        allowance: "",
        beneficiary: "",
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const params = useParams();
    const { uuid, phaseuuid, outputuuid } = params;

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
        setIsLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch(`${config.baseURL}/transports/${outputuuid}`, {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                setSuccessMessage("Transport details added successfully!");
                setFormData({
                    destination: "",
                    description: "",
                    travelPeriod: "",
                    travelers: "",
                    dateOfRequest: "",
                    dateReceived: "",
                    approver: "",
                    approvedDate: "",
                    transport: null,
                    type: "",
                    PvNo: "",
                    claimNumber: "",
                    accounted: "",
                    dateAccounted: "",
                    paymentDate: "",
                    allowance: "",
                    beneficiary: "",
                });
                if (router) {
                    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}/expenses/transport`);
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to submit transport details.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}  onClick={onClose} >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.container}>

                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    <ToastContainer position="top-center" autoClose={3000}/>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {[
                            ["destination", "Destination", "text"],
                            ["travelPeriod", "Travel Period", "text"],
                            ["description", "Description", "textarea"],
                            ["travelers", "Travelers", "textarea"],
                            ["dateOfRequest", "Date of Request", "date"],
                            ["dateReceived", "Date Received", "date"],
                            ["paymentDate", "Payment Date", "date"],
                            ["allowance", "Allowance", "number"],
                            ["beneficiary", "Beneficiary", "text"],
                        ].map(([name, label, type]) => (
                            <div className={styles.divInput} key={name}>
                                <label htmlFor={name} className={styles.label}>{label}</label>
                                {type === "textarea" ? (
                                    <textarea
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        placeholder={label}
                                        required={name === "description"}
                                        className={styles.textarea}
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        placeholder={label}
                                        required={name === "destination" || name === "allowance"}
                                        className={styles.input}
                                    />
                                )}
                            </div>
                        ))}

                        <div className={styles.divInput}>
                            <label htmlFor="approver" className={styles.label}>Approver</label>
                            <select name="approver" value={formData.approver} onChange={handleChange}
                                    className={styles.select}>
                                <option value="">Select Approver</option>
                                <option value="VC">VC</option>
                                <option value="DVC">DVC</option>
                            </select>
                        </div>

                        <div className={styles.divInput}>
                            <label htmlFor="approvedDate" className={styles.label}>Approval Date</label>
                            <input
                                type="date"
                                name="approvedDate"
                                value={formData.approvedDate}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.divInput}>
                            <label htmlFor="transport" className={styles.label}>Document</label>
                            <input
                                type="file"
                                name="transport"
                                onChange={handleChange}
                                className={styles.input}
                            />
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

                        {(formData.type === "Claim" || formData.type === "Petty Cash") && (
                            <div className={styles.divInput}>
                                <label htmlFor="claimNumber" className={styles.label}>Claim Number</label>
                                <input
                                    type="text"
                                    name="claimNumber"
                                    value={formData.claimNumber}
                                    onChange={handleChange}
                                    placeholder="Claim Number"
                                    className={styles.input}
                                />
                            </div>
                        )}

                        {(formData.type === "Claim" || formData.type === "Petty Cash" || formData.type === "Imprest") && (
                            <div className={styles.divInput}>
                                <label htmlFor="PvNo" className={styles.label}>PV No</label>
                                <input
                                    type="text"
                                    name="PvNo"
                                    value={formData.PvNo}
                                    onChange={handleChange}
                                    placeholder="PV No"
                                    className={styles.input}
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
                                        className={styles.input}
                                    />
                                </div>
                            </>
                        )}

                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.button}>
                                {isLoading ? "Submitting..." : "Submit"}
                            </button>
                            <button  className={styles.buttons} type="button" onClick={onClose}>Cancel</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddTransportPage;