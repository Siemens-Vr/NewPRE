"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/project/project/project.module.css";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { config } from "/config";
import { useParams } from 'next/navigation';

const Phases = () => {
    const [phases, setPhases] = useState([]);
    const [newPhase, setNewPhase] = useState({
        name: "",
        startDate: "",
        endDate: "",
        status: "",
        deliverables: [],
    });
    const [editPhaseData, setEditPhaseData] = useState(null); // State for editing phase
    const [showPhaseInput, setShowPhaseInput] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addPhaseError, setAddPhaseError] = useState("");
    const params = useParams();
    const { uuid } = params;

    const fetchPhases = async () => {
        try {
            const response = await fetch(`${config.baseURL}/phases/${uuid}`);
            if (response.ok) {
                const data = await response.json();
                setPhases(data.phases || []);
            } else {
                console.error("Failed to fetch phases");
            }
        } catch (error) {
            console.error("Error fetching phases:", error);
        }
    };

    useEffect(() => {
        fetchPhases();
    }, []);

    const addPhase = async () => {
        console.log("UUID in addPhase:", uuid);
        if (!uuid) {
            console.error("UUID is undefined.");
            return;
        }
        
        if (newPhase.name.trim()) {
            setIsAdding(true);
            setAddPhaseError("");

            try {
                const payload = {
                    phases: [
                        {
                            name: newPhase.name,
                            startDate: new Date(newPhase.startDate).toISOString(),
                            endDate: new Date(newPhase.endDate).toISOString(),
                            status: newPhase.status,
                            deliverables: newPhase.deliverables,
                        },
                    ],
                };

                const response = await fetch(`${config.baseURL}/phases/${uuid}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    fetchPhases();
                    setShowPhaseInput(false);
                    setNewPhase({
                        name: "",
                        startDate: "",
                        endDate: "",
                        status: "",
                        deliverables: [],
                    });
                } else {
                    const errorText = await response.text();
                    console.error("Failed to add phase:", errorText);
                    setAddPhaseError("Failed to add phase.");
                }
            } catch (error) {
                console.error("Error in addPhase function:", error);
                setAddPhaseError("Error occurred while adding phase.");
            } finally {
                setIsAdding(false);
            }
        } else {
            alert("Phase name is required!");
        }
    };

    const deletePhase = async (index) => {
        const phaseToDelete = phases[index];
        try {
            const response = await fetch(`${config.baseURL}/phases/${uuid}/${phaseToDelete.uuid}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setPhases((prevPhases) => prevPhases.filter((_, i) => i !== index));
                fetchPhases();
            } else {
                console.error("Failed to delete phase");
            }
        } catch (error) {
            console.error("Error deleting phase:", error);
        }
    };

    const updatePhase = async () => {
        if (editPhaseData) {
            try {
                const response = await fetch(`${config.baseURL}/phases/${uuid}/${editPhaseData.uuid}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editPhaseData),
                });

                if (response.ok) {
                    fetchPhases();
                    setEditPhaseData(null); // Close the edit modal
                } else {
                    console.error("Failed to update phase");
                }
            } catch (error) {
                console.error("Error updating phase:", error);
            }
        }
    };

    return (
        <div className={styles.phases}>
            <div className = {styles.top}>
                <h2>Phases</h2>
                <button
                    onClick={() => setShowPhaseInput(true)}
                    className={styles.addButton}
                >
                    <FaPlus /> Add Milestone
                </button>
            </div>
            
            <div className={styles.phaseCards}>
                {phases.map((phase, index) => (
                    <div key={index} className={styles.phaseCard}>
                        <div className={styles.top}>
                            <h3>{phase.name}</h3>
                            <div className={styles.cardActions}>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => setEditPhaseData(phase)}
                                />
                                <FaTrash
                                    className={styles.deleteIcon}
                                    onClick={() => deletePhase(index)}
                                />
                            </div>
                        </div>

                        <p>
                        <strong>Start Date:</strong>{" "}
                        {phase.startDate ? new Date(phase.startDate).toLocaleDateString() : ""}
                        </p>
                        <p>
                        <strong>End Date:</strong>{" "}
                        {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : ""}
                        </p>
                        <p>
                            <strong>Status:</strong> {phase.status}
                        </p>

                    </div>
                ))}
            </div>



            {/* Add Phase Modal */}
            {showPhaseInput && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Add Milestone</h3>
                        <div className={styles.divInput}>
                            <label htmlFor="Name">Name</label>
                            <input
                                type="text"
                                value={newPhase.name}
                                onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
                                placeholder="Phase Name"
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="Start Date">Start Date</label>
                            <input
                                type="date"
                                value={newPhase.startDate}
                                onChange={(e) =>
                                    setNewPhase({ ...newPhase, startDate: e.target.value })
                                }
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.divInput}>
                            <label htmlFor="End Date">End Date</label>
                            <input
                                type="date"
                                value={newPhase.endDate}
                                onChange={(e) =>
                                    setNewPhase({ ...newPhase, endDate: e.target.value })
                                }
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.divInput}>
                        <label htmlFor="Status">Status</label>
                        <select
                            value={newPhase.status}
                            onChange={(e) =>
                                setNewPhase({ ...newPhase, status: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="">Select Status</option>
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={addPhase} disabled={isAdding} className={styles.addButton}>
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                            <button
                                onClick={() => setShowPhaseInput(false)}
                                className={styles.closeButton}
                            >
                                Cancel
                            </button>
                        </div>
                        {addPhaseError && <p className={styles.errorMessage}>{addPhaseError}</p>}
                    </div>
                </div>
            )}

            {/* Edit Phase Modal */}
            {editPhaseData && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Edit Milestone</h3>
                        <div className={styles.divInput}>
                            <label htmlFor="">Name</label>
                            <input
                            type="text"
                            value={editPhaseData.name}
                            onChange={(e) =>
                                setEditPhaseData({ ...editPhaseData, name: e.target.value })
                            }
                            placeholder="Phase Name"
                            className={styles.inputField}
                        />
                        </div>
                    
                        <div className={styles.divInput}>
                            <label htmlFor="">Start Date</label>
                            <input
                            type="date"
                            value={
                                editPhaseData.startDate
                                  ? new Date(editPhaseData.startDate).toISOString().split("T")[0] 
                                  : "" 
                              }
                            onChange={(e) =>
                                setEditPhaseData({ ...editPhaseData, startDate: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        </div>
                      
                        <div className={styles.divInput}>
                            <label htmlFor="">End Date</label>
                            <input
                            type="date"
                            value={
                                editPhaseData.endDate
                                  ? new Date(editPhaseData.endDate).toISOString().split("T")[0] 
                                  : "" 
                              }
                            onChange={(e) =>
                                setEditPhaseData({ ...editPhaseData, endDate: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        </div>
                      
                        <div className={styles.divInput}>
                            <label htmlFor="">Status</label>
                            <select
                            value={editPhaseData.status}
                            onChange={(e) =>
                                setEditPhaseData({ ...editPhaseData, status: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        </div>
              
                        <div className={styles.modalActions}>
                            <button onClick={updatePhase} className={styles.addButton}>
                                Update
                            </button>
                            <button
                                onClick={() => setEditPhaseData(null)}
                                className={styles.closeButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Phases;