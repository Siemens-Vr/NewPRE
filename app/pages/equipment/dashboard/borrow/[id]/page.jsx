'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import styles from '@/app/styles/borrow/singlepage/singlepage.module.css';

export default function SinglePage() {
  const { id: uuid } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [editable, setEditable] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/borrow/${uuid}`);
        setData(res.data);
        const init = extractValues(res.data);
        setFormValues(init);
        setEditable({
          actualReturnDate: !res.data.actualReturnDate,
          status: true,
          condition: true,
          conditionDetails: !res.data.component.condition
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchData();
  }, [uuid]);

  const extractValues = (d) => ({
    fullName: d.fullName,
    borrowerContact: d.borrowerContact,
    departmentName: d.departmentName,
    purpose: d.purpose,
    reasonForBorrowing: d.reasonForBorrowing,
    expectedReturnDate: formatDate(d.expectedReturnDate),
    actualReturnDate: d.actualReturnDate ? formatDate(d.actualReturnDate) : '',
    dateOfIssue: formatDate(d.dateOfIssue),
    createdAt: formatDate(d.createdAt),
    updatedAt: formatDate(d.updatedAt),
    uuid: d.uuid,
    componentName: d.component.componentName,
    componentType: d.component.componentType,
    partNumber: d.component.partNumber,
    quantity: d.quantity,
    status: d.component.status ? 'Borrowed' : 'Not Borrowed',
    condition: d.component.condition ? 'Okay' : 'Not Okay',
    conditionDetails: d.component.conditionDetails || ''
  });

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString() : 'N/A';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(fv => ({ ...fv, [name]: value }));
    setHasChanges(true);
    if (name === 'condition') {
      setEditable(ed => ({ ...ed, conditionDetails: value === 'Not Okay' }));
    }
  };

  const enable = (field) => setEditable(ed => ({ ...ed, [field]: true }));
  const cancel = (field) => {
    setFormValues(fv => ({ ...fv, [field]: extractValues(data)[field] }));
    setEditable(ed => ({ ...ed, [field]: false }));
  };
  const save = (field) => setEditable(ed => ({ ...ed, [field]: false }));

  const handleSubmit = async () => {
    try {
      const payload = {
        actualReturnDate: formValues.actualReturnDate,
        component: {
          ...data.component,
          status: formValues.status === 'Borrowed',
          condition: formValues.condition === 'Okay',
          conditionDetails: formValues.condition === 'Not Okay' ? formValues.conditionDetails : ''
        }
      };
      await api.patch(`/borrow/${uuid}`, payload);
      alert('Changes saved successfully.');
      setHasChanges(false);
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <div className={styles.loader}>Loading…</div>;
  if (error)   return <div className={styles.error}>Error: {error}</div>;
  if (!data)  return <div className={styles.noData}>No data available.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <section className={styles.formSection}>
          <h2>Borrower’s Information</h2>
          {['fullName','borrowerContact','departmentName','purpose','reasonForBorrowing','expectedReturnDate'].map(key => (
            <div className={styles.fieldGroup} key={key}>
              <label>{key.replace(/([A-Z])/g,' $1')}</label>
              <input type="text" value={formValues[key]||'N/A'} readOnly />
            </div>
          ))}
          <div className={styles.fieldGroup}>
            <label>Actual Return Date</label>
            <div className={styles.editableField}>
              <input
                name="actualReturnDate"
                type="date"
                value={formValues.actualReturnDate}
                onChange={handleChange}
                readOnly={!editable.actualReturnDate}
              />
              {editable.actualReturnDate
                ? <><button onClick={()=>save('actualReturnDate')}>Save</button><button onClick={()=>cancel('actualReturnDate')}>Cancel</button></>
                : <button onClick={()=>enable('actualReturnDate')}>Edit</button>
              }
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <h2>Component Information</h2>
          {['componentName','componentType','partNumber','quantity'].map(key => (
            <div className={styles.fieldGroup} key={key}>
              <label>{key.replace(/([A-Z])/g,' $1')}</label>
              <input type="text" value={formValues[key]||'N/A'} readOnly />
            </div>
          ))}
          <div className={styles.fieldGroup}>
            <label>Status</label>
            <div className={styles.editableField}>
              <select name="status" value={formValues.status} onChange={handleChange} disabled={!editable.status}>
                <option>Borrowed</option>
                <option>Not Borrowed</option>
              </select>
              {editable.status
                ? <><button onClick={()=>save('status')}>Save</button><button onClick={()=>cancel('status')}>Cancel</button></>
                : <button onClick={()=>enable('status')}>Edit</button>
              }
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>Condition</label>
            <div className={styles.editableField}>
              <select name="condition" value={formValues.condition} onChange={handleChange} disabled={!editable.condition}>
                <option>Okay</option>
                <option>Not Okay</option>
              </select>
              {editable.condition
                ? <><button onClick={()=>save('condition')}>Save</button><button onClick={()=>cancel('condition')}>Cancel</button></>
                : <button onClick={()=>enable('condition')}>Edit</button>
              }
            </div>
          </div>
          {(formValues.condition==='Not Okay' || editable.conditionDetails) && (
            <div className={styles.fieldGroup}>
              <label>Condition Details</label>
              <div className={styles.editableField}>
                <textarea name="conditionDetails" value={formValues.conditionDetails} onChange={handleChange} readOnly={!editable.conditionDetails} />
                {editable.conditionDetails
                  ? <><button onClick={()=>save('conditionDetails')}>Save</button><button onClick={()=>cancel('conditionDetails')}>Cancel</button></>
                  : <button onClick={()=>enable('conditionDetails')}>Edit</button>
                }
              </div>
            </div>
          )}
        </section>
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
}