'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FormModal.module.css';

/**
 * FormModal
 * A reusable modal that renders dynamic form fields and optional footer buttons.
 * Props:
 * - title: string - modal header
 * - fields: array of {
 *     name: string,
 *     label: string,
 *     type: 'text'|'number'|'date'|'textarea'|'select'|'button',
 *     options?: array of { value, label } for select,
 *     placeholder?: string,
 *     onClick?: fn for button,
 *     disabled?: boolean
 *   }
 * - initialValues: object
 * - onChange: fn(name: string, value: any) called on each field change
 * - onSubmit: fn(values)
 * - onClose: fn()
 * - extraActions: array of { label: string, onClick: fn, className?: string }
 */
export default function FormModal({
  title,
  fields,
  initialValues,
  onChange,
  onSubmit,
  onClose,
  extraActions = []
}) {
  const [values, setValues] = useState(initialValues || {});

  // Keep local state in sync if initialValues change
   useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);

  const handleChange = (name, val) => {
    const updated = { ...values, [name]: val };
    setValues(updated);
    if (onChange) onChange(updated);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.container} role="dialog" aria-modal="true">
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
                  disabled={f.disabled}
                >
                  {f.label}
                </button>
              ) : f.type === 'textarea' ? (
                <textarea
                  id={f.name}
                  placeholder={f.placeholder}
                  value={values[f.name] || ''}
                  onChange={e => handleChange(f.name, e.target.value)}
                  disabled={f.disabled}
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

          <div className={styles.actions}>
            <div className={styles.extraActions}>
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

            <div className={styles.footerButtons}>
              <button type="button" className={styles.cancel} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submit}>
                Submit
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
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text','number','date','textarea','select','button']).isRequired,
      options: PropTypes.array,
      placeholder: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool
    })
  ).isRequired,
  initialValues: PropTypes.object,
  onChange: PropTypes.func,           // new prop
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  extraActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string
    })
  )
};