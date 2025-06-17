// "use client";
// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation'; // Use useSearchParams for query parameters
// import styles from '@/app/styles/borrow/add/borrowForm.module.css';
// import api from '@/app/lib/utils/axios';
// import { config } from '/config';


// const BorrowForm = () => {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id'); // Get the 'id' from the query parameters
//   // console.log(id); // Check if 'id' is being captured correctly

//   const [components, setComponents] = useState([]);
//   const [componentTypes, setComponentTypes] = useState([]);

//   const getCurrentDate = () => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const [formData, setFormData] = useState({
//     componentUUID: "",
//     fullName: "",
//     borrowerContact: "",
//     borrowerID: "",
//     departmentName: "",
//     quantity: "",
//     dateOfIssue: getCurrentDate(),
//     expectedReturnDate: "",
//     purpose: "",
//     reasonForBorrowing: ""
//   });

//   const departments = ['Human Resources', 'Finance', 'Engineering', 'Marketing', 'Sales'];

//   useEffect(() => {
//     if (id) {
//       setFormData(prevState => ({
//         ...prevState,
//         componentUUID: id
//       }));
//     }
//   }, [id]);

//   useEffect(() => {

//     const fetchComponentTypes = async () => {
//       try {
//         const response = await api.get(`${config.baseURL}/components`);
//         if (response.status == 200) {
//           const data = response.data;
//           setComponentTypes(data);
//         } else {
//           console.log("Could not fetch data");
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     fetchComponentTypes();
//   }, []);

//   useEffect(() => {
//     const fetchComponents = async () => {
//       if (!formData.componentType) return;

//       try {
//         const response = await api.get(`/components/components/${formData.componentType}`);
//         if (response.status == 200) {
//           const data =  response.data;
//           setComponents(data.rows);
//         } else {
//           console.log("Error fetching data");
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     fetchComponents();
//   }, [formData.componentType]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     console.log(formData);

//     try{
//       const response = await fetch(`${config.baseURL}/borrow`, {
//         method: 'POST',
//         headers:{
//           'Content-Type':'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
//       if(response.ok){
//         alert('Borrower added successfully');
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
//       }
//     }catch(error){
//       console.log(error.message);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {!id && (
//           <>
//            <div className={styles.divInput}>
//           <label htmlFor="componentType">Component Type</label>
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
//             <label htmlFor="componentUUID">Component</label>
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
        
//          <div className={styles.divInput}>
//         <label htmlFor="quantity">Quantity</label>
//             <input 
//           type="number" 
//           name="quantity" 
//           value={formData.quantity} 
//           onChange={handleChange} 
//           placeholder="quantity" 
//         />
//         </div>

//         <div className={styles.divInput}>
//         <label htmlFor="fullName" className={styles.label}>Full Name</label>
//         <input 
//           type="text" 
//           id="fullName"
//           name="fullName" 
//           value={formData.fullName} 
//           onChange={handleChange} 
//           placeholder="Full Name" 
//         />
//       </div>

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
//         <label htmlFor="borrowerID">ID/Registration Number</label>
//         <input 
//           type="text" 
//           name="borrowerID" 
//           value={formData.borrowerID} 
//           onChange={handleChange} 
//           placeholder="ID/Registration Number" 
//         />
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="departmentName">Department</label>
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
//         <label htmlFor="dateOfIssue">Return Date</label>
//         <input 
//           type="date" 
//           name="expectedReturnDate" 
//           value={formData.expectedReturnDate} 
//           onChange={handleChange} 
//           placeholder="Expected Return Date" 
//         />
//        </div>
//        <div className={styles.divInput}>
//         <label htmlFor="purpose">Purpose</label>
//         <textarea 
//           name="purpose" 
//           value={formData.purpose} 
//           onChange={handleChange} 
//           placeholder="Purpose"
//         />
//         </div>
//         <div className={styles.divInput}>
//         <label htmlFor="reasonForBorrowing">Reason for Borrowing</label>
//         <textarea 
//           name="reasonForBorrowing" 
//           value={formData.reasonForBorrowing} 
//           onChange={handleChange} 
//           placeholder="Reason for Borrowing"
//         />
//       </div>
//         <button type="submit">Submit</button>
//       </form>
      
//     </div>
//   );
// }

// export default BorrowForm;


// app/components/borrow/BorrowForm.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams }         from "next/navigation";
import api                         from "@/app/lib/utils/axios";
import { config }                  from "/config";
import FormModal                   from "@/app/components/Form/FormModal";

export default function BorrowForm() {
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

  // modal visibility
  const [show, setShow] = useState(false);

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
    api.get(`${config.baseURL}/components`)
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
    const res = await fetch(`${config.baseURL}/borrow`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(values)
    });
    if (res.ok) {
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
      <button onClick={() => setShow(true)}>
        Borrow Item
      </button>

      {show && (
        <FormModal
          title="Borrow Component"
          fields={fields}
          initialValues={formData}
          onClose={() => setShow(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

