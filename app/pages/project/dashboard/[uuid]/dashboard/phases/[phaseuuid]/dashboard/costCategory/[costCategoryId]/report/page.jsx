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
                            cancelButtonColor: '#ff7211',
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
                    confirmButtonColor: '#ff7211',
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
                return <FaFilePdf size={50} color="orange" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <FaFileImage size={50} color="orange" />;
            case "doc":
            case "docx":
                return <FaFileWord size={50} color="orange" />;
            case "xls":
            case "xlsx":
                return <FaFileExcel size={50} color="orange" />;
            case "ppt":
            case "pptx":
                return <FaFilePowerpoint size={50} color="orange" />;
            case "zip":
            case "rar":
            case "7z":
                return <FaFileArchive size={50} color="orange" />;
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
                <div className={styles.topButtons}
                     style={{display: "flex", justifyContent: "flex-end", marginBottom: "10px", marginRight: "20px"}}>
                    <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                        <FaUpload size={10}/> Upload File
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {fileList.map((file) => (
                        <div
                            key={file.uuid}
                            className="flex items-center justify-between rounded-lg p-3 min-w-0 w-full sm:w-[200px] md:w-[220px] lg:w-[250px] h-[50px] shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-300"
                            style={{backgroundColor: '#c6e7e7'}}
                            onClick={() => handleView(file)}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {getFileIcon(file.document)}
                                <span className="text-gray-700 font-medium truncate">
                    {file.document.split("/").pop()}
                </span>
                            </div>

                            <div className="relative" ref={(el) => (menuRefs.current[file.uuid] = el)}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(file.uuid);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaEllipsisV size={16}/>
                                </button>

                                {menuOpen[file.uuid] && (
                                    <div
                                        className="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-lg z-50"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(file);
                                                setTimeout(() => toggleMenu(file.uuid), 200);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Download
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(file, file.document.split("/").pop());
                                                setTimeout(() => toggleMenu(file.uuid), 200);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
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
                            <input type="file" onChange={handleFileChange}/>
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