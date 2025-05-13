// "use client"
// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import styles from '@/app/styles/borrow/singlepage/singlepage.module.css';
// import api from "@/app/lib/utils/axios";
// import { config } from "/config";

// const SinglePage = () => {
//   const params = useParams();
//   const uuid = params.id;

//   const [borrowerData, setBorrowerData] = useState(null);
//   const [editableFields, setEditableFields] = useState({
//     actualReturnDate: false,
//     status: false,
//     condition: false,
//     conditionDetails: false,
//   });
//   const [formValues, setFormValues] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get(`${config.baseURL}/borrow/${uuid}`);
//         console.log(response)
//         if (response.statusText === 'OK') {
//           const data =response.data;
//           setBorrowerData(data);
//           initializeEditableFields(data);
//           setFormValues(extractFormValues(data));
//         }
        
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (uuid) {
//       fetchData();
//     }
//   }, [uuid]);

//   const initializeEditableFields = (data) => {
//     setEditableFields({
//       actualReturnDate: !data.actualReturnDate,
//       status: true,
//       condition: data.component?.condition !== "Okay",
//       conditionDetails: data.component?.condition === "Not Okay",
//     });
//   };

//   const extractFormValues = (data) => {
//     return {
//       actualReturnDate: data.actualReturnDate || "",
//       status: data.component?.status ? "Borrowed" : "Not Borrowed",
//       condition: data.component?.condition || "",
//       conditionDetails: data.component?.conditionDetails || "",
//     };
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//     setHasChanges(true);
//   };

//   const enableEdit = (fieldName) => {
//     setEditableFields((prev) => ({
//       ...prev,
//       [fieldName]: true,
//     }));
//   };

//   const cancelEdit = (fieldName) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [fieldName]: borrowerData.component?.[fieldName] || "",
//     }));
//     setEditableFields((prev) => ({
//       ...prev,
//       [fieldName]: false,
//     }));
//   };

//   const saveField = (fieldName) => {
//     setEditableFields((prev) => ({
//       ...prev,
//       [fieldName]: false,
//     }));
//   };

  
//   const handleSubmit = async () => {
//     const payload = {
//       actualReturnDate: formValues.actualReturnDate,
//       component: {
//         ...borrowerData.component,
//         status: formValues.status === "Borrowed",
//         condition: formValues.condition,
//         conditionDetails: formValues.conditionDetails,
//       },
//     };
//     console.log(payload)
//     try {
//       const response = await fetch(`${config.baseURL}/borrows/${uuid}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update the data.");
//       }

//       const updatedData = await response.json();
//       setBorrowerData(updatedData);
//       initializeEditableFields(updatedData);
//       setFormValues(extractFormValues(updatedData));
//       setHasChanges(false);
//       alert("Changes saved successfully!");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (isLoading) {
//     return <div className={styles.loader}>Loading...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>Error: {error}</div>;
//   }

//   if (!borrowerData) {
//     return <div className={styles.noData}>No Data Available.</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.formContainer}>
//         {/* Borrower Information */}
//         <div className={styles.formSection}>
//           <h2>Borrower&rsquo;s Information</h2>
//           {/* ... (other borrower information fields remain unchanged) ... */}
//           <div className={styles.fieldGroup}>
//             <label>Return Date</label>
//             {borrowerData.actualReturnDate ? (
//               <input
//                 type="text"
//                 value={new Date(borrowerData.actualReturnDate).toLocaleDateString()}
//                 readOnly
//               />
//             ) : (
//               <div className={styles.editableField}>
//                 <input
//                   type="date"
//                   name="actualReturnDate"
//                   value={formValues.actualReturnDate}
//                   readOnly={!editableFields.actualReturnDate}
//                   onChange={handleChange}
//                 />
//                 {editableFields.actualReturnDate ? (
//                   <div className={styles.actionButtons}>
//                     <button onClick={() => saveField("actualReturnDate")}>Save</button>
//                     <button onClick={() => cancelEdit("actualReturnDate")}>Cancel</button>
//                   </div>
//                 ) : (
//                   <div className={styles.actionButtons}>
//                     <button onClick={() => enableEdit("actualReturnDate")}>Edit</button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           {/* ... (other borrower information fields remain unchanged) ... */}
//         </div>

//         {/* Component Information */}
//         <div className={styles.formSection}>
//           <h2>Component Information</h2>
//           {/* ... (other component information fields remain unchanged) ... */}
//           <div className={styles.fieldGroup}>
//             <label>Status</label>
//             <div className={styles.editableField}>
//               <select
//                 name="status"
//                 value={formValues.status}
//                 disabled={!editableFields.status}
//                 onChange={handleChange}
//               >
//                 <option value="Borrowed">Borrowed</option>
//                 <option value="Not Borrowed">Not Borrowed</option>
//               </select>
//               {editableFields.status && (
//                 <div className={styles.actionButtons}>
//                   <button onClick={() => saveField("status")}>Save</button>
//                   <button onClick={() => cancelEdit("status")}>Cancel</button>
//                 </div>
//               )}
//               {!editableFields.status && (
//                 <button onClick={() => enableEdit("status")}>Edit</button>
//               )}
//             </div>
//           </div>
//           {/* ... (other component information fields remain unchanged) ... */}
//         </div>
//       </div>
      
//       {hasChanges && (
//         <div className={styles.submitButtonContainer}>
//           <button className={styles.submitButton} onClick={handleSubmit}>
//             Submit Changes
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SinglePage;

"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from '@/app/styles/borrow/singlepage/singlepage.module.css';
import api from "@/app/lib/utils/axios";
import { config } from "/config";

const SinglePage = () => {
  const params = useParams();
  const uuid = params.id;

  const [borrowerData, setBorrowerData] = useState(null);
  const [editableFields, setEditableFields] = useState({
    actualReturnDate: false,
    status: false,
    condition: false,
    conditionDetails: false,
  });
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/borrow/${uuid}`);
        if (response.status === 200) {
          const data = response.data;
          setBorrowerData(data);
          initializeEditableFields(data);
          setFormValues(extractFormValues(data));
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching borrow data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchData();
    }
  }, [uuid]);

  const initializeEditableFields = (data) => {
    setEditableFields({
      actualReturnDate: !data.actualReturnDate,
      status: true,
      condition: true,
      conditionDetails: data.component?.condition === false, // Not Okay
    });
  };

  const extractFormValues = (data) => {
    return {
      actualReturnDate: data.actualReturnDate || "",
      status: data.component?.status ? "Borrowed" : "Not Borrowed",
      condition: data.component?.condition ? "Okay" : "Not Okay",
      conditionDetails: data.component?.conditionDetails || "",
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setHasChanges(true);
    
    // Update condition details visibility when condition changes
    if (name === "condition") {
      setEditableFields((prev) => ({
        ...prev,
        conditionDetails: value === "Not Okay",
      }));
    }
  };

  const enableEdit = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const cancelEdit = (fieldName) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: extractFormValues(borrowerData)[fieldName] || "",
    }));
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  const saveField = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };
  
  const handleSubmit = async () => {
    const payload = {
      actualReturnDate: formValues.actualReturnDate,
      component: {
        ...borrowerData.component,
        status: formValues.status === "Borrowed",
        condition: formValues.condition === "Okay",
        conditionDetails: formValues.condition === "Not Okay" ? formValues.conditionDetails : "",
      },
    };
    
    try {
      const response = await api.patch(`/borrows/${uuid}`, payload);

      if (response.status === 200) {
        const updatedData = response.data;
        setBorrowerData(updatedData);
        initializeEditableFields(updatedData);
        setFormValues(extractFormValues(updatedData));
        setHasChanges(false);
        alert("Changes saved successfully!");
      } else {
        throw new Error("Failed to update the data.");
      }
    } catch (err) {
      alert(err.message);
      console.error("Error updating borrow data:", err);
    }
  };

  if (isLoading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!borrowerData) {
    return <div className={styles.noData}>No Data Available.</div>;
  }

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* Borrower Information */}
        <div className={styles.formSection}>
          <h2>Borrower&rsquo;s Information</h2>
          
          <div className={styles.fieldGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={borrowerData.fullName || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Borrower Contact</label>
            <input
              type="text"
              value={borrowerData.borrowerContact || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Department</label>
            <input
              type="text"
              value={borrowerData.departmentName || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Purpose</label>
            <input
              type="text"
              value={borrowerData.purpose || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Reason for Borrowing</label>
            <input
              type="text"
              value={borrowerData.reasonForBorrowing || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Expected Return Date</label>
            <input
              type="text"
              value={formatDate(borrowerData.expectedReturnDate)}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Actual Return Date</label>
            {borrowerData.actualReturnDate ? (
              <input
                type="text"
                value={formatDate(borrowerData.actualReturnDate)}
                readOnly
              />
            ) : (
              <div className={styles.editableField}>
                <input
                  type="date"
                  name="actualReturnDate"
                  value={formValues.actualReturnDate}
                  readOnly={!editableFields.actualReturnDate}
                  onChange={handleChange}
                />
                {editableFields.actualReturnDate ? (
                  <div className={styles.actionButtons}>
                    <button onClick={() => saveField("actualReturnDate")}>Save</button>
                    <button onClick={() => cancelEdit("actualReturnDate")}>Cancel</button>
                  </div>
                ) : (
                  <div className={styles.actionButtons}>
                    <button onClick={() => enableEdit("actualReturnDate")}>Edit</button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Date of Issue</label>
            <input
              type="text"
              value={formatDate(borrowerData.dateOfIssue)}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Created At</label>
            <input
              type="text"
              value={formatDate(borrowerData.createdAt)}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Updated At</label>
            <input
              type="text"
              value={formatDate(borrowerData.updatedAt)}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>UUID</label>
            <input
              type="text"
              value={borrowerData.uuid || "N/A"}
              readOnly
            />
          </div>
        </div>

        {/* Component Information */}
        <div className={styles.formSection}>
          <h2>Component Information</h2>
          
          <div className={styles.fieldGroup}>
            <label>Component Name</label>
            <input
              type="text"
              value={borrowerData.component?.componentName || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Component Type</label>
            <input
              type="text"
              value={borrowerData.component?.componentType || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Part Number</label>
            <input
              type="text"
              value={borrowerData.component?.partNumber || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Quantity</label>
            <input
              type="text"
              value={borrowerData.quantity || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Component UUID</label>
            <input
              type="text"
              value={borrowerData.component?.componentUUID || "N/A"}
              readOnly
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Status</label>
            <div className={styles.editableField}>
              <select
                name="status"
                value={formValues.status}
                disabled={!editableFields.status}
                onChange={handleChange}
              >
                <option value="Borrowed">Borrowed</option>
                <option value="Not Borrowed">Not Borrowed</option>
              </select>
              {editableFields.status ? (
                <div className={styles.actionButtons}>
                  <button onClick={() => saveField("status")}>Save</button>
                  <button onClick={() => cancelEdit("status")}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => enableEdit("status")}>Edit</button>
              )}
            </div>
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Condition</label>
            <div className={styles.editableField}>
              <select
                name="condition"
                value={formValues.condition}
                disabled={!editableFields.condition}
                onChange={handleChange}
              >
                <option value="Okay">Okay</option>
                <option value="Not Okay">Not Okay</option>
              </select>
              {editableFields.condition ? (
                <div className={styles.actionButtons}>
                  <button onClick={() => saveField("condition")}>Save</button>
                  <button onClick={() => cancelEdit("condition")}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => enableEdit("condition")}>Edit</button>
              )}
            </div>
          </div>
          
          {(formValues.condition === "Not Okay" || editableFields.conditionDetails) && (
            <div className={styles.fieldGroup}>
              <label>Condition Details</label>
              <div className={styles.editableField}>
                <textarea
                  name="conditionDetails"
                  value={formValues.conditionDetails}
                  readOnly={!editableFields.conditionDetails}
                  onChange={handleChange}
                  placeholder="Describe the issue with the component"
                />
                {editableFields.conditionDetails ? (
                  <div className={styles.actionButtons}>
                    <button onClick={() => saveField("conditionDetails")}>Save</button>
                    <button onClick={() => cancelEdit("conditionDetails")}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => enableEdit("conditionDetails")}>Edit</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {hasChanges && (
        <div className={styles.submitButtonContainer}>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit All Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePage;