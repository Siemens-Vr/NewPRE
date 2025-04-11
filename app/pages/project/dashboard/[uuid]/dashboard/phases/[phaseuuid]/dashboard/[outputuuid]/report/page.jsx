"use client";

import React, { useState, useEffect, useRef } from "react";
import { config } from "/config";
import Navbar from "@/app/components/project/output/navbar/navbar";
import styles from "@/app/styles/project/project/project.module.css";
import {
    FaUpload,
    FaRegFileAlt,
    FaFilePdf,
    FaFileImage,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileArchive,
    FaFileCode,
    FaEllipsisV
} from "react-icons/fa";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

const Report = () => {
    const [report, setReport] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState({}); 
    const menuRefs = useRef({}); 
    const params = useParams();
    const { uuid, outputuuid } = params;
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            let isClickInsideMenu = Object.values(menuRefs.current).some((menu) => menu && menu.contains(event.target));
            if (!isClickInsideMenu) {
                setMenuOpen({});
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    useEffect(() => {
        if (successMessage && errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 3000);
    
            return () => clearTimeout(timer); 
        }
    }, [successMessage, errorMessage]);
    const fetchFiles = async () => {
        try {
            const response = await fetch(`${config.baseURL}/reports/${outputuuid}`);
            const data = await response.json();
            if (response.ok) {
                setFileList(data.reports.rows);
            } else {
                console.error("Error fetching files:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }
    
        setIsLoading(true);
        const formData = new FormData();
        formData.append("report", selectedFile); 
    
        try {
            const response = await fetch(`${config.baseURL}/reports/${outputuuid}`, {
                method: "POST",
                body: formData,
                headers: {
                   
                },
            });
    
            if (response.ok) {
                fetchFiles();
                setSelectedFile(null);
                setModalOpen(false);
                setSuccessMessage("Report uploaded successfully!");
            } else {
                console.error("Error uploading file:", await response.text());
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleDelete = async (file, name) => {
         const result = await Swal.fire({
                            title: 'Are you sure?',
                            text: `You are about to delete ${name} `,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete',
                            cancelButtonText: 'Cancel'
                          });
                          
                          if (result.isConfirmed) {
                            setDeleting(uuid);
          
            // if (confirmDelete) {

        try {
            const response = await fetch(
                `${config.baseURL}/reports/${file.uuid}/delete`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setFileList((prev) => prev.filter((f) => f.id !== file.id)); 
                setSuccessMessage("Report deleted successfully!");
                 Swal.fire({
                    title: 'Deleted!',
                    text: `${name} has been successfully deleted.`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    });
            } else {
                setErrorMessage("Error deleting report")
                console.error("Error deleting file:", await response.text());
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
};
    // };

    const handleView = (file) => {
        window.open(`${config.baseURL}${file.document}`, "_blank");
    };

    const handleDownload = (file) => {
        if (!file.document) {
          alert("No files available to download.");
          return;
        }
    
        const filePath = `${config.baseURL}/download${file.document}`;
        const link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    const toggleMenu = (fileId) => {
        setMenuOpen((prev) => ({
            [fileId]: !prev[fileId] 
        }));
    };
    
    const getFileIcon = (fileName) => {
        if (!fileName) return <FaRegFileAlt size={50} color="yellow" />;

        const ext = fileName.split(".").pop().toLowerCase();
        switch (ext) {
            case "pdf":
                return <FaFilePdf size={50} color="red" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <FaFileImage size={50} color="blue" />;
            case "doc":
            case "docx":
                return <FaFileWord size={50} color="navy" />;
            case "xls":
            case "xlsx":
                return <FaFileExcel size={50} color="green" />;
            case "ppt":
            case "pptx":
                return <FaFilePowerpoint size={50} color="orange" />;
            case "zip":
            case "rar":
            case "7z":
                return <FaFileArchive size={50} color="purple" />;
            case "js":
            case "html":
            case "css":
            case "json":
            case "xml":
            case "py":
            case "cpp":
            case "java":
                return <FaFileCode size={50} color="teal" />;
            default:
                return <FaRegFileAlt size={50} color="gray" />;
        }
    };

    return (
        <div className={styles.projectDetails}>
            <nav className={styles.navbar}>
                <Navbar />
            </nav>
        <div className={styles.container}>
           
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <div className={styles.topButtons} style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" , marginRight: "20px"}}>
                <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                    <FaUpload size={10} /> Upload File
                </button>
            </div>
            <div className={styles.fileGrid}>
            {fileList.map((file) => (
    <div key={file.id} className={styles.fileCard}>
        <div className={styles.fileInfo}>
            {getFileIcon(file?.name)}
            <span className={styles.fileName} onClick={() => handleView(file)}>
                {file?.documentName || "Unnamed File"}
            </span>
        </div>
        <div className={styles.fileMenu} ref={(el) => (menuRefs.current[file.id] = el)}>
            <button onClick={() => toggleMenu(file.id)}>
                <FaEllipsisV />
            </button>
            {menuOpen[file.id] && (
                <div className={styles.menuDropdown} onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(file); }}>Download</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(file, file.name); }}>Delete</button>
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
                                {isLoading ? "Uploading..." : "Upload"}
                            </button>
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Report;