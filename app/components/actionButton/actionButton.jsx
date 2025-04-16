// import { useState, useRef, useEffect } from "react";
// import { FaEdit, FaDownload, FaTrash, FaEye } from "react-icons/fa";
// import styles from "@/app/styles/action/actionButton.module.css";
//
// const ActionButton = ({ onEdit, onDownload, onDelete, onView }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };
//
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };
//
//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//
//   return (
//     <div className={styles.actionContainer} ref={dropdownRef}>
//       <button onClick={toggleDropdown} className={styles.actionButton}>
//         Actions
//       </button>
//
//       {isOpen && (
//         <div className={styles.dropdownMenu}>
//           <button onClick={onView} className={styles.dropdownItem}>
//             <FaEye className={styles.icon} /> View
//           </button>
//           <button onClick={onEdit} className={styles.dropdownItem}>
//             <FaEdit className={styles.icon} /> Edit
//           </button>
//           <button onClick={onDownload} className={styles.dropdownItem}>
//             <FaDownload className={styles.icon} /> Download
//           </button>
//           <button onClick={onDelete} className={styles.dropdownItemDelete}>
//             <FaTrash className={styles.icon} /> Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ActionButton;
"use client"
// import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
 import { FaEdit, FaDownload, FaTrash, FaEye } from "react-icons/fa";
import styles from "@/app/styles/action/actionButton.module.css";



const ActionButton = ({ onEdit, onDownload, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
          menuRef.current &&
          !menuRef.current.contains(e.target) &&
          !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    setShowMenu(!showMenu);
  };

  return (
      <>
        <button
            className={styles.dotsButton}
            onClick={toggleMenu}
            ref={buttonRef}
        >
          ⋮
        </button>

        {showMenu &&
            createPortal(
                <div
                    ref={menuRef}
                    className={styles.dropdownMenu}
                    style={{
                      top: position.top + 4,
                      left: position.left - 100, // Adjust based on width
                      position: "absolute",
                      zIndex: 9999,
                    }}
                >
                  {onView && (
                      <button onClick={() => { onView(); setShowMenu(false); }}>
                        <FaEye className={styles.icon} />  View
                      </button>
                  )}
                  {onEdit && (
                      <button onClick={() => { onEdit(); setShowMenu(false); }}>
                        <FaEdit className={styles.icon} />Edit
                      </button>
                  )}
                  {onDownload && (
                      <button onClick={() => { onDownload(); setShowMenu(false); }}>
                        <FaDownload className={styles.icon} /> Download
                      </button>
                  )}
                  {onDelete && (
                      <button
                          onClick={() => { onDelete(); setShowMenu(false); }}
                          className={styles.deleteButton}
                      >
                        <FaTrash className={styles.icon} />Delete
                      </button>
                  )}
                </div>,
                document.body
            )}
      </>
  );
};

export default ActionButton;
