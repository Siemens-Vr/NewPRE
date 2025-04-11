import { useState, useRef, useEffect } from "react";
import { FaEdit, FaDownload, FaTrash, FaEye } from "react-icons/fa";
import styles from "@/app/styles/action/actionButton.module.css";

const ActionButton = ({ onEdit, onDownload, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.actionContainer} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.actionButton}>
        Actions
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={onView} className={styles.dropdownItem}>
            <FaEye className={styles.icon} /> View
          </button>
          <button onClick={onEdit} className={styles.dropdownItem}>
            <FaEdit className={styles.icon} /> Edit
          </button>
          <button onClick={onDelete} className={styles.dropdownItemDelete}>
            <FaTrash className={styles.icon} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
