// app/components/Form/FormModal.jsx
import React from 'react';
import Modal from 'react-modal';
import styles from './FormModal.module.css';

export default function FormModal({
  isOpen,
  title,
  fields = [],     // default to empty array
  onSubmit,
  onClose,
  submitLabel = 'Submit',
  disableSubmit = false,
  children
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2 className={styles.title}>{title}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Render any defined fields */}
        {fields.map((f) => (
          <div className={styles.field} key={f.name}>
            <label htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={f.value}
              onChange={f.onChange}
              {...(f.multiple ? { multiple: true } : {})}
              {...(f.directory ? { webkitdirectory: true, directory: true } : {})}
            />
          </div>
        ))}

        {/* Render any custom children as fallback */}
        {children}

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" disabled={disableSubmit} className={styles.submit}>
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
