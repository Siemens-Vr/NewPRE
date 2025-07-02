import React from 'react';
import PropTypes from 'prop-types';
import FormModal from '../Form/formTable'; // adjust path
import styles from '@/app/styles/condition/condition.module.css';

export default function ConditionPopUp({
  onClose,
  conditions,
  setConditions
}) {
  const fields = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'Select condition' },
        { value: 'Okay', label: 'Okay' },
        { value: 'Not Okay', label: 'Not Okay' }
      ]
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      placeholder: 'Example: 10'
    },
    {
      name: 'details',
      label: 'Details',
      type: 'text',
      placeholder: 'Example: Broken'
    }
  ];

  const initialValues = { status: '', quantity: '', details: '' };

  // Called every time you click “Add”
  const handleAdd = newVals => {
    setConditions([...conditions, newVals]);
  };

  // Called when you click “Done”
  const handleDone = () => {
    onClose();
  };

  // Build your table
  const tableContent = (
    <>
      <h3>Added Conditions</h3>
      {conditions.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Quantity</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((c, i) => (
              <tr key={i}>
                <td>{c.status}</td>
                <td>{c.quantity}</td>
                <td>{c.details}</td>
                <td>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() =>
                      setConditions(cs => cs.filter((_, idx) => idx !== i))
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No conditions added yet.</p>
      )}
    </>
  );

  return (
    <FormModal
      title="Condition Details"
      fields={fields}
      initialValues={initialValues}
      onAdd={handleAdd}       // add one row
      onSubmit={handleDone}    // “Done” button closes
      onClose={onClose}
      tableContent={tableContent}
    />
  );
}

ConditionPopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  conditions: PropTypes.array.isRequired,
  setConditions: PropTypes.func.isRequired
};
