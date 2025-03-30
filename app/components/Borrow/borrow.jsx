// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "@/app/styles/components/add/addComponent.module.css";
// import ConditionPopUp from "@/app/components/condition/condition";
// import { config } from "/config";

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const AddBorrow = ({ onClose, id }) => {
//   const router = useRouter();
//   const [componentTypes, setComponentTypes] = useState([]);
//   const [disablePartNumber, setDisablePartNumber] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [conditions, setConditions] = useState([]);
//   const [formData, setFormData] = useState({
//     componentUUID: id || "",
//     fullName: "",
//     borrowerContact: "",
//     borrowerID: "",
//     quantity: "",
//     departmentName: "",
//     dateOfIssue: getCurrentDate(),
//     expectedReturnDate: "",
//     purpose: "",
//     reasonForBorrowing: ""
//   });

//   useEffect(() => {
//     const fetchComponentTypeData = async () => {
//       try {
//         const response = await fetch(`${config.baseURL}/categories`);
//         if (response.ok) {
//           const data = await response.json();
//           setComponentTypes(data);
//         } else {
//           console.error("Failed to fetch component types");
//         }
//       } catch (error) {
//         console.error("Error fetching categories", error);
//       }
//     };
//     fetchComponentTypeData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${config.baseURL}/components`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         alert("Component borrowed successfully");
//         setFormData({
//           componentUUID: id || "",
//           fullName: "",
//           borrowerContact: "",
//           borrowerID: "",
//           quantity: "",
//           departmentName: "",
//           dateOfIssue: getCurrentDate(),
//           expectedReturnDate: "",
//           purpose: "",
//           reasonForBorrowing: ""
//         });
//         router.push("/pages/equipment/dashboard/components");
//       } else {
//         const err = await response.json();
//         alert("Error: " + err.message);
//       }
//     } catch (error) {
//       console.error("Error submitting form", error);
//       alert("An error occurred while submitting the form.");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit}>
//         <div className={styles.top}></div>
//         <div className={styles.form}>
//           <button type="button" onClick={onClose} className={styles.btn}>
//             X
//           </button>

//           <div className={styles.divInput}>
//             <label htmlFor="fullName">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="borrowerContact">Borrower Contact</label>
//             <input
//               type="text"
//               name="borrowerContact"
//               value={formData.borrowerContact}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="borrowerID">Borrower ID</label>
//             <input
//               type="text"
//               name="borrowerID"
//               value={formData.borrowerID}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="quantity">Quantity</label>
//             <input
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="departmentName">Department Name</label>
//             <input
//               type="text"
//               name="departmentName"
//               value={formData.departmentName}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="expectedReturnDate">Expected Return Date</label>
//             <input
//               type="date"
//               name="expectedReturnDate"
//               value={formData.expectedReturnDate}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="purpose">Purpose</label>
//             <textarea
//               name="purpose"
//               value={formData.purpose}
//               onChange={handleChange}
//             ></textarea>
//           </div>

//           <div className={styles.divInput}>
//             <label htmlFor="reasonForBorrowing">Reason for Borrowing</label>
//             <textarea
//               name="reasonForBorrowing"
//               value={formData.reasonForBorrowing}
//               onChange={handleChange}
//             ></textarea>
//           </div>

//           <button type="submit" className={styles.submit1}>
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddBorrow;





 "use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/borrow/add/borrowForm.module.css";
import { config } from "/config";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const AddBorrow = ({ onClose, id }) => {
  const router = useRouter();
  const [componentTypes, setComponentTypes] = useState([]);
  const [components, setComponents] = useState([]);
  const [formData, setFormData] = useState({
    componentUUID: id || "",
    fullName: "",
    borrowerContact: "",
    borrowerID: "",
    departmentName: "",
    quantity: "",
    dateOfIssue: getCurrentDate(),
    expectedReturnDate: "",
    purpose: "",
    reasonForBorrowing: "",
  });

  const departments = ["Human Resources", "Finance", "Engineering", "Marketing", "Sales"];

  useEffect(() => {
    if (id) {
      setFormData((prevState) => ({ ...prevState, componentUUID: id }));
    }
  }, [id]);

  useEffect(() => {
    const fetchComponentTypes = async () => {
      try {
        const response = await fetch(`${config.baseURL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setComponentTypes(data);
        } else {
          console.error("Failed to fetch component types");
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchComponentTypes();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      if (!formData.componentType) return;
      try {
        const response = await fetch(`${config.baseURL}/components/${formData.componentType}`);
        if (response.ok) {
          const data = await response.json();
          setComponents(data.rows);
        } else {
          console.error("Error fetching components");
        }
      } catch (error) {
        console.error("Error fetching components", error);
      }
    };
    fetchComponents();
  }, [formData.componentType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseURL}/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Borrow request submitted successfully");
        setFormData({
          componentUUID: id || "",
          fullName: "",
          borrowerContact: "",
          borrowerID: "",
          quantity: "",
          departmentName: "",
          dateOfIssue: getCurrentDate(),
          expectedReturnDate: "",
          purpose: "",
          reasonForBorrowing: "",
        });
        router.push("/pages/equipment/dashboard/components");
      } else {
        const err = await response.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (

    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button type="button" onClick={onClose} className={styles.btn}>X</button>

        {!id && (
          <>
            <select name="componentType"
             value={formData.componentType} 
             onChange={handleChange}>
              <option value="">Select Component Type</option>
              {componentTypes.map((type, index) => (
                <option key={index} value={type.componentType}>{type.componentType}</option>
              ))}
            </select>

            <select name="componentUUID"
             value={formData.componentUUID} 
             onChange={handleChange}>
              <option value="">Select the Component</option>
              {components.map((component, index) => (
                <option key={index} value={component.uuid}>{component.componentName}</option>
              ))}
            </select>
          </>
        )}

        <input type="number" 
        name="quantity" 
         value={formData.quantity} 
         onChange={handleChange}
          placeholder="Quantity" />

        <input type="text" 
        name="fullName" 
        value={formData.fullName} 
        onChange={handleChange} 
        placeholder="Full Name" />

        <input type="text" 
        name="borrowerContact"
         value={formData.borrowerContact} 
         onChange={handleChange} 
         placeholder="Contact" />

        <input type="text"
         name="borrowerID" 
         value={formData.borrowerID} 
         onChange={handleChange}
         placeholder="ID/Registration Number" />
        
        <select name="departmentName" value={formData.departmentName} onChange={handleChange}>
          <option value="">Select Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>{department}</option>
          ))}
        </select>

        <input type="date"
         name="expectedReturnDate" 
         value={formData.expectedReturnDate}
          onChange={handleChange} />

        <textarea name="purpose"
         value={formData.purpose}
          onChange={handleChange}
           placeholder="Purpose" />

        <textarea name="reasonForBorrowing" 
        value={formData.reasonForBorrowing} 
        onChange={handleChange} 
        placeholder="Reason for Borrowing" />
        
        <button type="submit" className={styles.submit}>SUBMIT</button>
 
      </form>
    </div>
  );
};

export default AddBorrow;
