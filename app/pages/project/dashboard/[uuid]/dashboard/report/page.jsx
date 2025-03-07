"use client";

import React, { useState, useEffect, useRef } from 'react';
import { config } from "/config";
import styles from '@/app/styles/project/project/project.module.css';
import { FaUpload, FaRegFileAlt, FaEye, FaDownload, FaTrash, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileArchive, FaFileCode, FaEllipsisV } from "react-icons/fa";
import { useParams } from 'next/navigation';

const Report = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);
    const params = useParams();
    const { uuid } = params;

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch(`${config.baseURL}/reports/${uuid}`);
            const data = await response.json();
            if (response.ok) {
                setFileList(data.reports.rows);
            } else {
                console.error('Error fetching files:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append('report', selectedFile);

        try {
            const response = await fetch(`${config.baseURL}/reports/${uuid}`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchFiles();
                setSelectedFile(null);
                setModalOpen(false);
            } else {
                console.error('Error uploading file:', await response.text());
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;
        try {
            const response = await fetch(`${config.baseURL}/reports/delete/${fileId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchFiles();
            } else {
                console.error('Error deleting file:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleView = (file) => {
        window.open(`${config.baseURL}/reports/${file.uuid}`, '_blank');
    };

    const handleDownload = (file) => {
        window.open(`${config.baseURL}/reports/download/${file.id}`, '_blank');
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return <FaRegFileAlt size={50} color="yellow" />;
        
        const ext = fileName.split('.').pop().toLowerCase();
        switch (ext) {
            case "pdf": return <FaFilePdf size={50} color="red" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif": return <FaFileImage size={50} color="blue" />;
            case "doc":
            case "docx": return <FaFileWord size={50} color="navy" />;
            case "xls":
            case "xlsx": return <FaFileExcel size={50} color="green" />;
            case "ppt":
            case "pptx": return <FaFilePowerpoint size={50} color="orange" />;
            case "zip":
            case "rar":
            case "7z": return <FaFileArchive size={50} color="purple" />;
            case "js":
            case "html":
            case "css":
            case "json":
            case "xml":
            case "py":
            case "cpp":
            case "java": return <FaFileCode size={50} color="teal" />;
            default: return <FaRegFileAlt size={50} color="gray" />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topButtons} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom:'10px' }}>
                <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                    < FaUpload size={10} /> Upload File
                </button>
            </div>
            <div className={styles.fileGrid}>
                {fileList.map((file) => (
                    <div key={file.id} className={styles.fileCard}>
                        <div className={styles.fileInfo}>
                            {getFileIcon(file?.name)}
                            <span className={styles.fileName} onClick={() => handleView(file)}>{file?.documentName || "Unnamed File"}</span>
                        </div>
                        <div className={styles.fileMenu} ref={menuRef}>
                            <button onClick={() => setMenuOpen(menuOpen === file.id ? null : file.id)}>
                                <FaEllipsisV />
                            </button>
                            {menuOpen === file.id && (
                                <div className={styles.menuDropdown}>
                                    <button onClick={() => handleView(file)}>View</button>
                                    <button onClick={() => handleDownload(file)}>Download</button>
                                    <button onClick={() => handleDelete(file.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className={styles.inputDocumentModal}>
                    <div className={styles.inputDocumentModalContent}>
                        <h3>Upload File</h3>
                        <input type="file" onChange={handleFileChange} />
                        <div className={styles.inputDocumentModalButtons}>
                            <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
                                {isLoading ? 'Uploading...' : 'Upload'}
                            </button>
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;




