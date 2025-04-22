"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { config } from "/config";
import styles from "@/app/styles/supplier/supplier.module.css";
import style from "@/app/styles/project/project/project.module.css";
import Search from "@/app/components/search/search"
// import Search from "@/app/components/search/searchFilter";
import AddOutputModal from '@/app/components/project/output/AddOutput';
import Link from "next/link";
import UpdateOutputPopup from '@/app/components/project/output/update';
import ActionButton from "@/app/components/project/output/actionButton";
import Pagination from "@/app/components/pagination/pagination";
import Swal from 'sweetalert2';

const OutputsList = () => {
    const { uuid, phaseuuid } = useParams();
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [outputs, setOutputs] = useState([]);
    const [output, setOutput] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOutput, setSelectedOutput] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [newOutput, setNewOutput] = useState({
        name: "",
        completionDate: "",
        status: "",
        description: "",
    });
    const [showOutputInput, setShowOutputInput] =useState(false) ; 

    

    // Fetch outputs function
    const fetchOutputs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.baseURL}/outputs/${phaseuuid}`);
            if (response.ok) {
                const data = await response.json();
                setOutputs(data);
            } else {
                console.error("Failed to fetch outputs");
            }
        } catch (error) {
            console.error("Error fetching outputs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutputs();
    }, [uuid]);

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        fetchOutputs(); // Now fetchOutputs is defined
    };

    const addOutput = async () => {
        try {
            const response = await fetch(`${config.baseURL}/outputs/${phaseuuid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOutput),
            });
    
            if (response.ok) {
                fetchOutputs();
                setShowOutputInput(false);
                setSuccessMessage("Output added successfully");
                setTimeout(() => setSuccessMessage(""), 3000);
                setNewOutput({
                    name: "",
                    description: "",
                    completionDate: "",
                    status: "",
                });
            } else {
                console.error("Failed to add output");
            }
        } catch (error) {
            console.error("Error adding output:", error);
        } finally {
            closeModal();
        }
    };
    const handleView = (outputuuid) => {
 
        console.log("View Output UUID:", outputuuid);
        
        if (!outputuuid) {
          console.error("Output UUID is missing");
          return;
        }
    
       
        router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phaseuuid}/dashboard/${outputuuid}`);
      };
      const handleDelete = async (outputuuid, name) => {
        if (!outputuuid) {
            console.error("Output UUID is missing");
            return;
        }
    
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel'
        });
    
        if (result.isConfirmed) {
            setDeleting(outputuuid);
    
            try {
                const response = await fetch(`${config.baseURL}/outputs/${phaseuuid}/${outputuuid}/`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
    
                if (response.ok) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: `${name} has been successfully deleted.`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
    
                    // ✅ Remove deleted output from state instead of reloading
                    setOutputs((prevOutputs) => prevOutputs.filter(output => output.uuid !== outputuuid));
    
                } else {
                    throw new Error("Failed to delete output");
                }
            } catch (error) {
                console.error("Error deleting output:", error);
                alert("Failed to delete output. Please try again.");
            } finally {
                setDeleting(null);
            }
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    

      const handleUpdateClick = (output) => {
        setSelectedOutput(output);
        setShowPopup(true);
      };
    
      const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedOutput(null);
      };
      const handleSavePopup = async () => {
        handleClosePopup();
        await fetchOutputs();
     
    };
    if (loading) return <p>Loading outputs...</p>;

    return (

                <div className={styles.container}>
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    <div className={styles.top}>
                        <Search placeholder="Search for an output..."/>
                        <button onClick={() => setShowOutputInput(true)} disabled={isAdding}
                                className={style.addButton}>Add
                        </button>
                    </div>
                    {Array.isArray(outputs) && outputs.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <td className={styles.th}>Output Name</td>
                                <td className={styles.th}>Description</td>
                                <td className={styles.th}>Status</td>
                                <td className={styles.th}>Completion Date</td>
                                <td className={styles.th}>Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {outputs.map((output) => (
                                <tr key={output.id}>
                                    <td>{output.name}</td>
                                    <td>{output.description}</td>
                                    <td>{output.status}</td>
                                    <td>{formatDate(output.completionDate)}</td>
                                    <td>
                                        <ActionButton
                                            onEdit={() => handleUpdateClick(output)}
                                            onDelete={() => handleDelete(output.uuid, output.name)}
                                            onView={() => handleView(output.uuid)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.noItem}>No output available</p>
                    )}
                    <Pagination count={count}/>
                    <AddOutputModal isModalOpen={isModalOpen} closeModal={closeModal} addOutput={addOutput}/>
                    {showOutputInput && (
                        <div className={style.modalOverlay}>
                            <div className={style.modalContent}>
                                <h3>Add Output</h3>
                                <div className={style.divInput}>
                                    <label htmlFor="Name">Name</label>
                                    <input
                                        type="text"
                                        value={newOutput.name}
                                        onChange={(e) => setNewOutput({...newOutput, name: e.target.value})}
                                        placeholder="Output Name"
                                        required
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.divInput}>
                                    <label htmlFor="Completion Date">Completion Date</label>
                                    <input
                                        type="date"
                                        value={newOutput.completionDate}
                                        onChange={(e) =>
                                            setNewOutput({...newOutput, completionDate: e.target.value})
                                        }
                                        required
                                        className={style.inputField}
                                    />
                                </div>
                                <div className={style.divInput}>
                                    <label htmlFor="Status">Status</label>
                                    <select
                                        value={newOutput.status}
                                        onChange={(e) =>
                                            setNewOutput({...newOutput, status: e.target.value})
                                        }
                                        className={style.inputField}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="todo">To Do</option>
                                        <option value="progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className={style.divInput}>
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        value={newOutput.description}
                                        onChange={(e) => setNewOutput({...newOutput, description: e.target.value})}
                                        className={style.inputField}
                                        required
                                    />
                                </div>
                                <div className={style.modalActions}>
                                    <button
                                        onClick={() => setShowOutputInput(false)}
                                        className={style.closeButton1}
                                    >
                                      X
                                    </button>
                                    <button onClick={addOutput} disabled={isAdding} className={style.addButton1}>
                                        {isAdding ? "Adding..." : "Add"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}

                    {showPopup && (
                        <UpdateOutputPopup
                            output={selectedOutput}
                            onClose={handleClosePopup}
                            onSave={handleSavePopup}
                        />
                    )}
                </div>

                );
                };

                export default OutputsList;