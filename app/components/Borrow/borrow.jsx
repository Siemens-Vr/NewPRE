
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams }  from "next/navigation";
import api  from "@/app/lib/utils/axios";
import FormModal from "@/app/components/Form/FormModal";

export default function BorrowForm({onClose, initialData, onSaved}) {

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
  const [show, setShow] =useState(false)



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
  useEffect (()=>{
    if(!initialData) return;
    setFormData({
      componentType:      initialData.component.componentType,
      componentName:      initialData.component.componentName,
      componentUUID:      initialData.component.uuid,
      quantity:           initialData.quantity,
      fullName:           initialData.fullName,
      borrowerContact:    initialData.borrowerContact,
      borrowerID:         initialData.borrowerID,
      departmentName:     initialData.departmentName,
      expectedReturnDate: initialData.expectedReturnDate ?.split('T')[0] ?? "",
      dateOfIssue:        initialData.dateOfIssue ?.split('T')[0]  ?? "",
      actualReturnDate:   initialData.actualReturnDate ?.split('T')[0] ?? "",
    })
  }, [initialData])

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
    { name:        "expectedReturnDate", label: "Expected Return Date",        type: "date"   },
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


