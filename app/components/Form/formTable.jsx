import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './FormModal.module.css';

export default function FormModal({
  title,
  fields,
  initialValues,
  onAdd,      // called by the “Add” button
  onSubmit,   // called by the “Done” (Submit) button
  onClose,
  onChange,
  tableContent = null
}) {
  const [values, setValues] = useState(initialValues || {});

const handleChange = (name, val) => {
    const updated = { ...values, [name]: val };
    setValues(updated);
    if (onChange) onChange(updated); // ✅ Propagate changes to parent
  };


  const handleSubmit = e => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            {fields.map(f => (
              <div className={styles.field} key={f.name}>
                <label htmlFor={f.name}>{f.label}</label>

                {f.type === 'textarea' ? (
                  <textarea
                    id={f.name}
                    placeholder={f.placeholder}
                    value={values[f.name] || ''}
                    onChange={e => handleChange(f.name, e.target.value)}
                  />
                ) : f.type === 'select' ? (
                  <select
                    id={f.name}
                    value={values[f.name] || ''}
                    onChange={e => handleChange(f.name, e.target.value)}
                    disabled={f.disabled}
                  >
                    <option value="">Select…</option>
                    {f.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={values[f.name] || ''}
                    onChange={e => handleChange(f.name, e.target.value)}
                    disabled={f.disabled}
                  />
                )}
              </div>
            ))}

            <div className={styles.footerAddButton}>
              <button
                type="button"
                className={styles.submit}
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>

          {tableContent && (
            <div className={styles.tableWrapper}>
              {tableContent}
            </div>
          )}

          <div className={styles.actions1}>
            <div className={styles.footerButtons}>
              <button
                type="button"
                className={styles.cancel}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submit}
              >
                Done
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

FormModal.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  extraActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  })),
  tableContent: PropTypes.node
};