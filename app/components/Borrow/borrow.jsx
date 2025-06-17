//   "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "@/app/styles/borrow/add/borrowForm.module.css";
// import api from "@/app/lib/utils/axios";
// import { config } from "/config";

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const AddBorrow = ({ onClose, id }) => {
//   const router = useRouter();
//   const [componentTypes, setComponentTypes] = useState([]);
//   const [components, setComponents] = useState([]);
//   const [formData, setFormData] = useState({
//     componentUUID: id || "",
//     fullName: "",
//     borrowerContact: "",
//     borrowerID: "",
//     departmentName: "",
//     quantity: "",
//     dateOfIssue: getCurrentDate(),
//     expectedReturnDate: "",
//     purpose: "",
//     reasonForBorrowing: "",
//   });

//   const departments = ["Human Resources", "Finance", "Engineering", "Marketing", "Sales"];

//   useEffect(() => {
//     if (id) {
//       setFormData((prevState) => ({ ...prevState, componentUUID: id }));
//     }
//   }, [id]);

//   useEffect(() => {
//     const fetchComponentTypes = async () => {
//       try {
//         const response = await api.get(`${config.baseURL}/components`);
//         if (response.statusText === 'OK') {
//           const data = response.data;
//           setComponentTypes(data);
//         } else {
//           console.error("Failed to fetch component types");
//         }
//       } catch (error) {
//         console.error("Error fetching categories", error);
//       }
//     };
//     fetchComponentTypes();
//   }, []);

//   useEffect(() => {
//     const fetchComponents = async () => {
//       if (!formData.componentType) return;
//       try {
//         const response = await api.get(`/components/components/${formData.componentType}`);
//         console.log(response)
//         if (response.statusText === 'OK') {
//           const data =  response.data;
//           setComponents(data.rows);
//         } else {
//           console.error("Error fetching components");
//         }
//       } catch (error) {
//         console.error("Error fetching components", error);
//       }
//     };
//     fetchComponents();
//   }, [formData.componentType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post(`/borrow`,formData, {
//         headers: { "Content-Type": "application/json" }
//       });
//       if (response.statusText === 'OK') {
//         alert("Borrow request submitted successfully");
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
//           reasonForBorrowing: "",
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
//     <>
//     {/* An overlay to make the background black */}
//     <div className={styles.overlay}></div>

//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <button type="button" onClick={onClose} className={styles.btn}>X</button>

//         {!id && (
//           <>
//           <div className={styles.divInput}>
//           <label htmlFor="componentType"className={styles.label}>Component Type</label>
//             <select 
//               name="componentType" 
//               value={formData.componentType}
//               onChange={handleChange}
//             >
//               <option value="">Select Component Type</option>
//               {componentTypes.map((componentType, index) => (
//                 <option key={index} value={componentType.componentType}>
//                   {componentType.componentType}
//                 </option>
//               ))}
//             </select>
//             </div>
//             <div className={styles.divInput}>
//             <label htmlFor="componentUUID"className={styles.label}>Component</label>
//             <select 
//               name="componentUUID" 
//               value={formData.componentUUID}
//               onChange={handleChange}
//             >
//               <option value="">Select the Component</option>
//               {components.map((component, index) => (
//                 <option key={index} value={component.uuid}>
//                   {component.componentName}
//                 </option>
//               ))}
//             </select>
//             </div>
//           </>
//         )}

// <div className={styles.divInput}>
//         <label htmlFor="quantity"className={styles.label}>Quantity</label>
//             <input 
//           type="number" 
//           name="quantity" 
//           value={formData.quantity} 
//           onChange={handleChange} 
//           placeholder="quantity" 
//         />
//         </div>

//         <div className={styles.divInput}>
//   <label htmlFor="fullName" className={styles.label}>Full Name</label>
//   <input 
//     type="text" 
//     id="fullName"
//     name="fullName" 
//     value={formData.fullName} 
//     onChange={handleChange} 
//     placeholder="Full Name" 
//   />
// </div>

//         <div className={styles.divInput}>
//         <label className={styles.label}>Contact</label>
//         <input 
//           type="text" 
//           name="borrowerContact" 
//           value={formData.borrowerContact} 
//           onChange={handleChange} 
//           placeholder="Contact" 
//         />
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="borrowerID"className={styles.label}>ID/Registration Number</label>
//         <input 
//           type="text" 
//           name="borrowerID" 
//           value={formData.borrowerID} 
//           onChange={handleChange} 
//           placeholder="ID/Registration Number" 
//         />
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="departmentName"className={styles.label}>Department</label>
//         <select 
//           name="departmentName" 
//           value={formData.departmentName} 
//           onChange={handleChange}
//         >
//           <option value="">Select Department</option>
//           {departments.map((department, index) => (
//             <option key={index} value={department}>
//               {department}
//             </option>
//           ))}
//         </select>
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="dateOfIssue"className={styles.label}>Return Date</label>
//         <input 
//           type="date" 
//           name="expectedReturnDate" 
//           value={formData.expectedReturnDate} 
//           onChange={handleChange} 
//           placeholder="Expected Return Date" 
//         />
//        </div>
//        <div className={styles.divInput}>
//         <label htmlFor="purpose"className={styles.label}>Purpose</label>
//         <textarea 
//           name="purpose" 
//           value={formData.purpose} 
//           onChange={handleChange} 
//           placeholder="Purpose"
//         />
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="reasonForBorrowing"className={styles.label}>Reason for Borrowing</label>
//         <textarea 
//           name="reasonForBorrowing" 
//           value={formData.reasonForBorrowing} 
//           onChange={handleChange} 
//           placeholder="Reason for Borrowing"
//         />
// </div>
//         <button type="submit" className={styles.submit}>SUBMIT</button>
 
//       </form>
//     </div>
//     </>
//   );
// };

// export default AddBorrow;


"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams }  from "next/navigation";
import api  from "@/app/lib/utils/axios";
import FormModal from "@/app/components/Form/FormModal";

export default function BorrowForm({onClose}) {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id") || "";

  const getToday = () => {
    const d        = new Date();
    const yyyy     = d.getFullYear();
    const mm       = String(d.getMonth() + 1).padStart(2, "0");
    const dd       = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // master data
  const [componentTypes, setComponentTypes] = useState([]);
  const [components,     setComponents]     = useState([]);



  // initial form state
  const [formData, setFormData] = useState({
    componentType:       "",
    componentUUID:       preselectedId,
    quantity:            "",
    fullName:            "",
    borrowerContact:     "",
    borrowerID:          "",
    departmentName:      "",
    expectedReturnDate:  "",
    purpose:             "",
    reasonForBorrowing:  "",
    dateOfIssue:         getToday(),
  });

  // fetch types
  useEffect(() => {
    api.get(`/components`)
      .then(r => setComponentTypes(r.data))
      .catch(console.error);
  }, []);

  // fetch actual components when type changes
  useEffect(() => {
    if (!formData.componentType) return;
    api.get(`/components/components/${formData.componentType}`)
      .then(r => setComponents(r.data.rows))
      .catch(console.error);
  }, [formData.componentType]);

  // your submit handler
  const handleSubmit = async (values) => {
    console.log(values)
    const res = await api.post(`/borrow`, values);
    if (res.status === 200) {
      alert("Borrow recorded!");
      setShow(false);
      // reset formData, preserving preselectedId & date
      setFormData({
        ...values,
        componentUUID: preselectedId,
        quantity:      "",
        fullName:      "",
        borrowerContact: "",
        borrowerID:      "",
        departmentName:  "",
        expectedReturnDate: "",
        purpose:           "",
        reasonForBorrowing:"",
      });
    } else {
      alert("Failed to borrow");
    }
  };

  // console.log("This are the componenst fetched by the api",components)

  // define FormModal fields
  const fields = [
    {
      name:        "componentType",
      label:       "Component Type",
      type:        "select",
      options:     componentTypes.map(c => ({ value: c.componentType, label: c.componentType })),
    },
    {
      name:        "componentUUID",
      label:       "Component",
      type:        "select",
      options:     components.map(c => ({ value: c.uuid, label: c.componentName })),
    },
    { name:        "quantity",         label: "Quantity",              type: "number" },
    { name:        "fullName",         label: "Full Name",             type: "text"   },
    { name:        "borrowerContact",  label: "Contact",               type: "text"   },
    { name:        "borrowerID",       label: "ID/Registration No.",   type: "text"   },
    {
      name:        "departmentName",
      label:       "Department",
      type:        "select",
      options:     ["HR","Finance","Engineering","Marketing","Sales"]
                    .map(d => ({ value: d, label: d })),
    },
    { name:        "expectedReturnDate", label: "Return Date",        type: "date"   },
    { name:        "purpose",           label: "Purpose",             type: "textarea" },
    { name:        "reasonForBorrowing",label: "Reason for Borrowing",type: "textarea" },
  ];

  return (
    <div>

          <FormModal
            title="Borrow Component"
            fields={fields}
            initialValues={formData}
            // ← wire up onChange so componentType changes propagate
            onChange={(name, val) =>
              setFormData(prev => ({ ...prev, [name]: val }))
            }
            onClose={onClose}
            onSubmit={handleSubmit}
    />
        {/* <FormModal
          title="Borrow Component"
          fields={fields}
          initialValues={formData}
          onClose={onClose}
          onSubmit={handleSubmit}
        /> */}

    </div>
  );
}


