import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './FormModal.module.css';

/**
 * FormModal
 * A reusable modal that renders dynamic form fields.
 * 
 * Props:
 * - title: string - modal header
 * - fields: array of {
 *     name: string,
 *     label: string,
 *     type: 'text'|'number'|'date'|'textarea'|'select',
 *     options?: array of { value, label } for select,
 *     placeholder?: string
 *   }
 * - initialValues: object
 * - onSubmit: fn(values)
 * - onClose: fn()
 */
export default function FormModal({ title, fields, initialValues, onSubmit, onClose }) {
  const [values, setValues] = useState(initialValues || {});

  const handleChange = (name, val) => {
    setValues(v => ({ ...v, [name]: val }));
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
                />
              )}
            </div>
          ))}
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submit}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

FormModal.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text','number','date','textarea','select']).isRequired,
    options: PropTypes.array,
    placeholder: PropTypes.string
  })).isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
