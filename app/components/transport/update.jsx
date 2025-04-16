// import React, { useEffect, useState } from "react";
// import { config } from "/config";
// import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';
//
// const UpdateTransportPopup = ({  onClose, transport, onSave  }) => {
//     const [formData, setFormData] = useState({
//         destination:'',
//         travelPeriod:'',
//         travelers:'',
//         description:'',
//         dateOfRequest:null,
//         dateReceived:null,
//         approver:'',
//         transport:'',
//         approvalDate:null,
//         paymentDate:null,
//         allowance:'',
//         type: '',
//         PvNo: '',
//         claimNumber: '',
//         accounted: '',
//         dateAccounted: null,
//         beneficiary:'',
//         dateTakenToApprover: null,
//         dateTakenToFinance:null,
//
//     });
//
//     useEffect(() => {
//         if (transport) {
//             setFormData({
//                 destination: transport.destination || "",
//                 travelPeriod: transport.travelPeriod || "",
//                 description: transport.description || "",
//                 travelers: transport.travelers || "",
//                 dateOfRequest: transport.dateOfRequest && !isNaN(Date.parse(transport.dateOfRequest))
//                     ? new Date(transport.dateOfRequest).toISOString().slice(0, 10)
//                     : '',
//                 dateReceived: transport.dateReceived && !isNaN(Date.parse(transport.dateReceived))
//                     ? new Date(transport.dateReceived).toISOString().slice(0, 10)
//                     : '',
//                 transport: transport.document || "",
//                 approver: transport.approver || "",
//                 approvalDate: transport.approvalDate && !isNaN(Date.parse(transport.approvalDate))
//                     ? new Date(transport.approvalDate).toISOString().slice(0, 10)
//                     : '',
//                 paymentDate: transport.paymentDate && !isNaN(Date.parse(transport.paymentDate))
//                     ? new Date(transport.paymentDate).toISOString().slice(0, 10)
//                     : '',
//                 allowance: transport.allowance || "",
//                 type: transport.type || "",
//                 PvNo: transport.PvNo || "",
//                 claimNumber: transport.claimNumber || "",
//                 accounted: transport.accounted || "",
//                 dateAccounted: transport.dateAccounted && !isNaN(Date.parse(transport.dateAccounted))
//                     ? new Date(transport.dateAccounted).toISOString().slice(0, 10)
//                     : '',
//                     beneficiary: transport.beneficiary || "",
//             });
//         }
//     }, [transport]);
//
//
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleSave = async () => {
//         const formDataToSend = new FormData();
//
//         // Helper function to validate dates
//         const validateDate = (date) => {
//             return date && !isNaN(Date.parse(date)) ? date : null;
//         };
//
//         Object.keys(formData).forEach((key) => {
//             if (!['document'].includes(key)) {
//                 if (["dateOfRequest", "dateReceived", "approvalDate", "paymentDate", "dateAccounted"].includes(key)) {
//                     const validDate = validateDate(formData[key]);
//                     if (validDate) {
//                         formDataToSend.append(key, validDate);
//                     }
//                 } else {
//                     formDataToSend.append(key, formData[key]);
//                 }
//             }
//         });
//
//         // Append files if selected
//         if (formData.transport) formDataToSend.append('transport', formData.transport);
//
//         console.log('FormData to send:');
//         for (let [key, value] of formDataToSend.entries()) {
//             console.log(`${key}:`, value);
//         }
//
//         try {
//             const url = `${config.baseURL}/transports/${transport.uuid}/update`;
//             console.log(url);
//             const response = await fetch(url, {
//                 method: 'PATCH',
//                 body: formDataToSend, // Send FormData
//             });
//
//             if (response.ok) {
//                 alert('Transport updated successfully!');
//                 onSave();
//             } else {
//                 console.error('Failed to update transport', await response.text());
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };
//
//
//
//     const renderFields = () => {
//         switch (formData.type) {
//             case "Claim":
//                 return (
//                     <>
//                         <div className={styles.inputGroup}>
//                             <label htmlFor="PvNo">PV No</label>
//                             <input
//                                 type="text"
//                                 id="PvNo"
//                                 name="PvNo"
//                                 value={formData.PvNo}
//                                 onChange={handleChange}
//                                 placeholder="e.g. PV123456"
//                                 required
//                             />
//                         </div>
//                         <div className={styles.inputGroup}>
//                             <label htmlFor="claimNumber">Claim Number</label>
//                             <input
//                                 type="text"
//                                 id="claimNumber"
//                                 name="claimNumber"
//                                 value={formData.claimNumber}
//                                 onChange={handleChange}
//                                 placeholder="e.g. CL123456"
//
//                             />
//                         </div>
//                     </>
//                 );
//             case "Petty Cash":
//                 return (
//                     <div className={styles.inputGroup}>
//                    <label htmlFor="PvNo">PV No</label>
//                             <input
//                                 type="text"
//                                 id="PvNo"
//                                 name="PvNo"
//                                 value={formData.PvNo}
//                                 onChange={handleChange}
//                                 placeholder="e.g. PV123456"
//                                 required
//                             />
//                 </div>
//                 );
//             case "Imprest":
//                 return (
//                     <>
//                     <div className={styles.inputGroup}>
//                     <label htmlFor="PvNo">PV No</label>
//                             <input
//                                 type="text"
//                                 id="PvNo"
//                                 name="PvNo"
//                                 value={formData.PvNo}
//                                 onChange={handleChange}
//                                 placeholder="e.g. PV123456"
//                                 required
//                             />
//                         </div>
//                         <div className={styles.inputGroup}>
//                             <label htmlFor="accounted">Accounted</label>
//                             <select
//                                 id="accounted"
//                                 name="accounted"
//                                 value={formData.accounted}
//                                 onChange={handleChange}
//
//                             >
//                                 <option value="">Select</option>
//                                 <option value="Yes">Yes</option>
//                                 <option value="No">No</option>
//                             </select>
//                         </div>
//                         <div className={styles.inputGroup}>
//                             <label htmlFor="dateAccounted">Date Accounted</label>
//                             <input
//                                 type="datetime-local"
//                                 id="dateAccounted"
//                                 name="dateAccounted"
//                                 value={formData.dateAccounted}
//                                 onChange={handleChange}
//
//                             />
//                         </div>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };
//     return (
//         <div className={styles.overlay}>
//             <div className={styles.popup}>
//                 <div className={styles.stickyHeader}>
//                     <h2>Update Transport</h2>
//                 </div>
//                 <form>
//                 <div className={styles.inputGroup}>
//                         <label htmlFor="destination">Destination</label>
//                         <input
//                             type="text"
//                             id="destination"
//                             name="destination"
//                             value={formData.destination}
//                             onChange={handleChange}
//                             placeholder="e.g. Nairobi"
//                             required
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="travelPeriod">Travel Period</label>
//                         <input
//                             type="text"
//                             id="travelPeriod"
//                             name="travelPeriod"
//                             value={formData.travelPeriod}
//                             onChange={handleChange}
//                             placeholder="e.g. 3 days."
//
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="description">Description</label>
//                         <input
//                             type="text"
//                             id="description"
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             placeholder="e.g. John Doe, Jane Doe"
//
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="allowance">Allowance</label>
//                         <input
//                             type="number"
//                             id="allowance"
//                             name="allowance"
//                             value={formData.allowance}
//                             onChange={handleChange}
//                             placeholder="e.g. 1500"
//
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
//
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="document">Document</label>
//                         <div className={styles.doc}>
//                             <div className={styles.docs}>
//                             <input
//                                 type="text"
//                                 id="transport"
//                                 name="transport"
//                                 value={formData.transport instanceof File ? formData.transport.name : formData.transport ? formData.transport.split('/').pop() : "N/A"}
//                                 readOnly
//                                 placeholder="transport document"
//
//                             />
//
//                                 {formData.transport && typeof formData.transport === "string" && (
//                                     <a
//                                         href={`${config.baseURL}/${formData.transport}`}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className={styles.fileLink}
//                                     >
//                                         Open File
//                                     </a>
//                                 )}
//
//                             </div>
//
//                              <input
//                                 type="file"
//                                 id="transport"
//                                 name="transport"
//                                 onChange={(e) => setFormData({ ...formData, transport: e.target.files[0] })}
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="beneficiary">Travelers</label>
//                         <input
//                             type="text"
//                             id="beneficiary"
//                             name="beneficiary"
//                             value={formData.beneficiary}
//                             onChange={handleChange}
//                             placeholder="e.g. John Doe, Jane Doe"
//
//                         />
//                     </div>
//
//
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="approvalDate">Approval Date</label>
//                         <input
//                             type="date"
//                             id="approvalDate"
//                             name="approvalDate"
//                             value={formData.approvalDate}
//                             onChange={handleChange}
//
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="dateOfRequest">Request Date</label>
//                         <input
//                             type="date"
//                             id="dateOfRequest"
//                             name="dateOfRequest"
//                             value={formData.dateOfRequest}
//                             onChange={handleChange}
//
//                         />
//                     </div>
//
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="dateReceived">Received Date</label>
//                         <input
//                             type="date"
//                             id="dateReceived"
//                             name="dateReceived"
//                             value={formData.dateReceived}
//                             onChange={handleChange}
//
//                         />
//                     </div>
//                     <div className={styles.inputGroup}>
//                         <label htmlFor="paymentDate">Payment Date</label>
//                         <input
//                             type="date"
//                             id="paymentDate"
//                             name="paymentDate"
//                             value={formData.paymentDate}
//                             onChange={handleChange}
//
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
//
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
//
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
//                         <button type="button" onClick={handleSave}>Update</button>
//                         <button type="button" onClick={onClose}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default UpdateTransportPopup;


import React, { useEffect, useState } from "react";
import { config } from "/config";
import styles from '@/app/styles/supplier/UpdateSupplierPopup.module.css';

const UpdateTransportPopup = ({ onClose, transport, onSave }) => {
    const [formData, setFormData] = useState({
        destination: '',
        travelPeriod: '',
        travelers: '',
        description: '',
        dateOfRequest: null,
        dateReceived: null,
        approver: '',
        transport: '',
        approvalDate: null,
        paymentDate: null,
        allowance: '',
        type: '',
        PvNo: '',
        claimNumber: '',
        accounted: '',
        dateAccounted: null,
        beneficiary: '',
        dateTakenToApprover: null,
        dateTakenToFinance: null,
    });

    useEffect(() => {
        if (transport) {
            setFormData({
                destination: transport.destination || "",
                travelPeriod: transport.travelPeriod || "",
                description: transport.description || "",
                travelers: transport.travelers || "",
                dateOfRequest: formatDate(transport.dateOfRequest),
                dateReceived: formatDate(transport.dateReceived),
                transport: transport.document || "",
                approver: transport.approver || "",
                approvalDate: formatDate(transport.approvalDate),
                paymentDate: formatDate(transport.paymentDate),
                allowance: transport.allowance || "",
                type: transport.type || "",
                PvNo: transport.PvNo || "",
                claimNumber: transport.claimNumber || "",
                accounted: transport.accounted || "",
                dateAccounted: formatDate(transport.dateAccounted),
                beneficiary: transport.beneficiary || "",
                dateTakenToApprover: formatDate(transport.dateTakenToApprover, true),
                dateTakenToFinance: formatDate(transport.dateTakenToFinance, true),
            });
        }
    }, [transport]);

    const formatDate = (date, isDateTime = false) => {
        return date && !isNaN(Date.parse(date))
            ? new Date(date).toISOString().slice(0, isDateTime ? 16 : 10)
            : '';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (!['document'].includes(key)) {
                if (["dateOfRequest", "dateReceived", "approvalDate", "paymentDate", "dateAccounted", "dateTakenToApprover", "dateTakenToFinance"].includes(key)) {
                    if (value && !isNaN(Date.parse(value))) {
                        formDataToSend.append(key, value);
                    }
                } else {
                    formDataToSend.append(key, value);
                }
            }
        });

        if (formData.transport) formDataToSend.append('transport', formData.transport);

        try {
            const url = `${config.baseURL}/transports/${transport.uuid}/update`;
            const response = await fetch(url, {
                method: 'PATCH',
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Transport updated successfully!');
                onSave();
            } else {
                console.error('Failed to update transport', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderFields = () => {
        switch (formData.type) {
            case "Claim":
                return (
                    <>
                        <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input type="text" id="PvNo" name="PvNo" value={formData.PvNo} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="claimNumber">Claim Number</label>
                            <input type="text" id="claimNumber" name="claimNumber" value={formData.claimNumber} onChange={handleChange} />
                        </div>
                    </>
                );
            case "Petty Cash":
                return (
                    <div className={styles.inputGroup}>
                        <label htmlFor="PvNo">PV No</label>
                        <input type="text" id="PvNo" name="PvNo" value={formData.PvNo} onChange={handleChange} />
                    </div>
                );
            case "Imprest":
                return (
                    <>
                        <div className={styles.inputGroup}>
                            <label htmlFor="PvNo">PV No</label>
                            <input type="text" id="PvNo" name="PvNo" value={formData.PvNo} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="accounted">Accounted</label>
                            <select id="accounted" name="accounted" value={formData.accounted} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="dateAccounted">Date Accounted</label>
                            <input type="datetime-local" id="dateAccounted" name="dateAccounted" value={formData.dateAccounted} onChange={handleChange} />
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
                    <h2>Update Transport</h2>
                </div>
                <form className={styles.form}>
                    <div className={styles.formBody}>
                        {[
                            { label: "Destination", name: "destination", type: "text" },
                            { label: "Travel Period", name: "travelPeriod", type: "text" },
                            { label: "Description", name: "description", type: "text" },
                            { label: "Allowance", name: "allowance", type: "number" },
                            { label: "Approver", name: "approver", type: "text" },
                            { label: "Beneficiary", name: "beneficiary", type: "text" },
                            { label: "Approval Date", name: "approvalDate", type: "date" },
                            { label: "Request Date", name: "dateOfRequest", type: "date" },
                            { label: "Received Date", name: "dateReceived", type: "date" },
                            { label: "Payment Date", name: "paymentDate", type: "date" },
                            { label: "Date Taken To Approver", name: "dateTakenToApprover", type: "datetime-local" },
                            { label: "Date Taken To Finance", name: "dateTakenToFinance", type: "datetime-local" },
                        ].map(({ label, name, type }) => (
                            <div key={name} className={styles.inputGroup}>
                                <label htmlFor={name}>{label}</label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <div className={styles.inputGroup}>
                            <label htmlFor="type">Type</label>
                            <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                                <option value="">Select Type</option>
                                <option value="Claim">Claim</option>
                                <option value="Imprest">Imprest</option>
                                <option value="Petty Cash">Petty Cash</option>
                            </select>
                        </div>

                        {renderFields()}

                        <div className={styles.inputGroup}>
                            <label htmlFor="transport">Document</label>
                            <div className={styles.doc}>
                                <div className={styles.docs}>
                                    {/*<input*/}
                                    {/*    type="text"*/}
                                    {/*    readOnly*/}
                                    {/*    value={*/}
                                    {/*        formData.transport instanceof File*/}
                                    {/*            ? formData.transport.name*/}
                                    {/*            : formData.transport*/}
                                    {/*                ? formData.transport.split('/').pop()*/}
                                    {/*                : "No document"*/}
                                    {/*    }*/}
                                    {/*/>*/}
                                    {formData.transport && typeof formData.transport === "string" && (
                                        <a
                                            href={`${config.baseURL}/${formData.transport}`}
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
                                    name="transport"
                                    onChange={(e) => setFormData({ ...formData, transport: e.target.files[0] })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.button} type="button" onClick={handleSave}>Update</button>
                        <button  className={styles.buttons} type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTransportPopup;
