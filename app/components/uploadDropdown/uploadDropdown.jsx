import { useState, useEffect, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdOutlineCreateNewFolder, MdUploadFile, MdFolder } from 'react-icons/md';
import styles from '@/app/styles/documents/uploadDropdown.module.css';

const UploadDropdown = ({ setModalStates }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.relative} ref={dropdownRef}>
        <div className={styles.inlineBlock}>
            <button onClick={() => setIsOpen(!isOpen)} className={styles.addButton}>
                <FaUpload /> Upload
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu} >
                    <button className= {styles.dropdownItem}
                        onClick={() => { 
                            setModalStates(prev => ({ ...prev, folderModal: true }));
                            setIsOpen(false);
                        }}
                    >
                        <MdOutlineCreateNewFolder /> New Folder
                    </button>
                    <button className= {styles.dropdownItem} 
                        onClick={() => { 
                            setModalStates(prev => ({ ...prev, folderUploadModal: true }));
                            setIsOpen(false);
                        }}
                    >
                        <MdFolder /> Upload Folder
                    </button>
                    <button className= {styles.dropdownItem}
                        onClick={() => { 
                            setModalStates(prev => ({ ...prev, fileModal: true }));
                            setIsOpen(false);
                        }}
                    >
                        <MdUploadFile /> Upload File
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default UploadDropdown;
