import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './FormModal.module.css';

export default function FormModal({
  title,
  fields,
  initialValues,
  onSubmit,
  onClose,
  onChange,
  extraActions = [],
  tableContent = null // <-- NEW
}) {
  const [values, setValues] = useState(initialValues || {});

const handleChange = (name, val) => {
    const updated = { ...values, [name]: val };
    setValues(updated);
    if (onChange) onChange(updated); // ✅ Propagate changes to parent
  };


  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {fields.map(f => (
            <div className={styles.field} key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              {f.type === 'button' ? (
                <button
                  type="button"
                  className={styles.button}
                  onClick={f.onClick}
                >
                  {f.label}
                </button>
              ) : f.type === 'textarea' ? (
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
                  <option value="">Select...</option>
                  {f.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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

          <div className={styles.actions}>
            <div>
              {extraActions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles[action.className] || styles.button}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div>
              <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
              <button type="submit" className={styles.submit}>Submit</button>
            </div>
          </div>
        </form>

        {/* 🔥 DROP-IN TABLE AREA */}
        {tableContent && (
          <div className={styles.tableWrapper}>
            {tableContent}
          </div>
        )}
      </div>
    </>
  );
}

FormModal.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text','number','date','textarea','select','button']).isRequired,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  })).isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  extraActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  })),
  tableContent: PropTypes.node // <-- NEW
};
