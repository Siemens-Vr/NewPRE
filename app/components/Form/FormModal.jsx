// FormModal.jsx
"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./FormModal.module.css";

/**
 * FormModal
 * A reusable modal that renders dynamic form fields and optional footer buttons.
 * Props:
 * - title: string - modal header
 * - fields: array of { name, label, type, options?, placeholder?, onClick?, disabled? }
 * - initialValues: object
 * - onChange: fn(updatedValues)
 * - onSubmit: fn(values)
 * - onClose: fn()
 * - extraActions: array of { label, onClick, className? }
 * - submitText: string (default "Submit")
 * - loading: boolean (default false)
 * - errorMessage: string (default "")
 */
export default function FormModal({
  title,
  fields,
  initialValues,
  onChange,
  onSubmit,
  onClose,
  extraActions = [],
  submitText = "Submit",
  loading = false,
  errorMessage = ""
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

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {fields.map(f => (
            <div className={styles.field} key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>

              {f.type === "button" ? (
                <button
                  type="button"
                  className={styles.button}
                  onClick={f.onClick}
                  disabled={f.disabled}
                >
                  {f.label}
                </button>
              ) : f.type === "textarea" ? (
                <textarea
                  id={f.name}
                  placeholder={f.placeholder}
                  value={values[f.name] || ""}
                  onChange={e => handleChange(f.name, e.target.value)}
                  disabled={f.disabled}
                />
              ) : f.type === "select" ? (
                <select
                  id={f.name}
                  value={values[f.name] || ""}
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
              ) : f.type === "file" ? (
                <input
                  id={f.name}
                  name={f.name}
                  type="file"
                  onChange={e => handleChange(f.name, e.target.files[0] || null)}
                  disabled={f.disabled}
                />
              ) : (
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={values[f.name] || ""}
                  onChange={e => handleChange(f.name, e.target.value)}
                  disabled={f.disabled}
                />
              )}
            </div>
          ))}

          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          <div className={styles.actions}>
            {extraActions.length > 0 && (
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
            )}

            <div className={styles.footerButtons}>
              <button
                type="button"
                className={styles.cancel}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submit}
                disabled={loading}
              >
                {loading ? "Please wait…" : submitText}
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
      type: PropTypes.oneOf([
        "text","number","date","textarea","select","button","file"
      ]).isRequired,
      options: PropTypes.array,
      placeholder: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool
    })
  ).isRequired,
  initialValues: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  extraActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string
    })
  ),
  submitText: PropTypes.string,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string
};
