// UploadDropdown.jsx

import { useState, useEffect, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdOutlineCreateNewFolder, MdUploadFile, MdFolder } from 'react-icons/md';
import styles from '@/app/styles/documents/uploadDropdown.module.css';

const UploadDropdown = ({ setModalStates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.relative} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={styles.addButton}
      >
        <FaUpload /> Upload
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              setModalStates((m) => ({ ...m, createFolder: true }));
              setIsOpen(false);
            }}
          >
            <MdOutlineCreateNewFolder /> New Folder
          </button>

          <button
            className={styles.dropdownItem}
            onClick={() => {
              setModalStates((m) => ({ ...m, uploadFolder: true }));
              setIsOpen(false);
            }}
          >
            <MdFolder /> Upload Folder
          </button>

          <button
            className={styles.dropdownItem}
            onClick={() => {
              setModalStates((m) => ({ ...m, uploadFile: true }));
              setIsOpen(false);
            }}
          >
            <MdUploadFile /> Upload File
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadDropdown;
