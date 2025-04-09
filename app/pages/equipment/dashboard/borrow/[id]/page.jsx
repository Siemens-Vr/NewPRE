"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from '@/app/styles/borrow/singlepage/singlepage.module.css';
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
        const response = await fetch(`${config.baseURL}/borrow/${uuid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch borrower data.");
        }
        const data = await response.json();
        setBorrowerData(data);
        initializeEditableFields(data);
        setFormValues(extractFormValues(data));
      } catch (err) {
        setError(err.message);
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
      condition: data.component?.condition !== "Okay",
      conditionDetails: data.component?.condition === "Not Okay",
    });
  };

  const extractFormValues = (data) => {
    return {
      actualReturnDate: data.actualReturnDate || "",
      status: data.component?.status ? "Borrowed" : "Not Borrowed",
      condition: data.component?.condition || "",
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
      [fieldName]: borrowerData.component?.[fieldName] || "",
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
        condition: formValues.condition,
        conditionDetails: formValues.conditionDetails,
      },
    };
    console.log(payload)
    try {
      const response = await fetch(`${config.baseURL}/borrows/${uuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update the data.");
      }

      const updatedData = await response.json();
      setBorrowerData(updatedData);
      initializeEditableFields(updatedData);
      setFormValues(extractFormValues(updatedData));
      setHasChanges(false);
      alert("Changes saved successfully!");
    } catch (err) {
      alert(err.message);
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

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* Borrower Information */}
        <div className={styles.formSection}>
          <h2>Borrower&rsquo;s Information</h2>
          {/* ... (other borrower information fields remain unchanged) ... */}
          <div className={styles.fieldGroup}>
            <label>Return Date</label>
            {borrowerData.actualReturnDate ? (
              <input
                type="text"
                value={new Date(borrowerData.actualReturnDate).toLocaleDateString()}
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
          {/* ... (other borrower information fields remain unchanged) ... */}
        </div>

        {/* Component Information */}
        <div className={styles.formSection}>
          <h2>Component Information</h2>
          {/* ... (other component information fields remain unchanged) ... */}
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
              {editableFields.status && (
                <div className={styles.actionButtons}>
                  <button onClick={() => saveField("status")}>Save</button>
                  <button onClick={() => cancelEdit("status")}>Cancel</button>
                </div>
              )}
              {!editableFields.status && (
                <button onClick={() => enableEdit("status")}>Edit</button>
              )}
            </div>
          </div>
          {/* ... (other component information fields remain unchanged) ... */}
        </div>
      </div>
      
      {hasChanges && (
        <div className={styles.submitButtonContainer}>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePage;