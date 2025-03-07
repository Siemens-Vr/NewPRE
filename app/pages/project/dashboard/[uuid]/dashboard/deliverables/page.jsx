"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "@/app/styles/project/project/project.module.css";
import { config } from "/config";
import { useParams } from 'next/navigation';

const DeliverablesManager = () => {
    const [phases, setPhases] = useState([]);
    const [deliverables, setDeliverables] = useState([]);
    const [newDeliverable, setNewDeliverable] = useState({
        name: "",
        status: "",
        startDate: "",
        expectedFinish: "",
        phaseId: "",
    });
    const [editDeliverable, setEditDeliverable] = useState(null); // Track deliverable being edited
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const params = useParams();
    const { uuid } = params;

    // Fetch Phases
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

    // Fetch Deliverables
    const fetchDeliverables = async () => {
        try {
            const response = await fetch(`${config.baseURL}/deliverables/${uuid}`);
            if (response.ok) {
                const data = await response.json();
                setDeliverables(Array.isArray(data) ? data : data.deliverables || []);
            } else {
                const errorText = await response.text();
                console.error("Failed to fetch deliverables:", errorText);
            }
        } catch (error) {
            console.error("Error fetching deliverables:", error);
        }
    };

    useEffect(() => {
        fetchPhases();
        fetchDeliverables();
    }, [uuid]);

    // Add Deliverable
    const addDeliverable = async () => {
        if (!newDeliverable.name.trim() || !newDeliverable.phaseId || !newDeliverable.status.trim()) {
            alert("Please provide all required details including name, phase, and status!");
            return;
        }

        setLoading(true); // Start loading animation
        try {
            const payload = {
                deliverables: [
                    {
                        name: newDeliverable.name,
                        status: newDeliverable.status,
                        startDate: newDeliverable.startDate,
                        expectedFinish: newDeliverable.expectedFinish,
                    },
                ],
            };

            const response = await fetch(
                `${config.baseURL}/deliverables/${uuid}/${newDeliverable.phaseId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                fetchDeliverables();
                setShowAddModal(false);
                setNewDeliverable({
                    name: "",
                    status: "",
                    startDate: "",
                    expectedFinish: "",
                    phaseId: "",
                });
                console.log("Deliverable added successfully");
            } else {
                const responseText = await response.text();
                console.error("Failed to add deliverable:", responseText);
            }
        } catch (error) {
            console.error("Error adding deliverable:", error);
        } finally {
            setLoading(false); // End loading animation
        }
    };

    // Edit Deliverable
    const updateDeliverable = async () => {
        if (!editDeliverable.name.trim() || !editDeliverable.phaseId || !editDeliverable.status.trim()) {
            alert("Please provide all required details including name, phase, and status!");
            return;
        }

        try {
            const payload = {
                name: editDeliverable.name,
                status: editDeliverable.status,
                startDate: editDeliverable.startDate,
                expectedFinish: editDeliverable.expectedFinish,
            };

            const response = await fetch(
                `${config.baseURL}/deliverables/${uuid}/${editDeliverable.phaseId}/${editDeliverable.uuid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                fetchDeliverables();
                setEditDeliverable(null);
                console.log("Deliverable updated successfully");
            } else {
                const responseText = await response.text();
                console.error("Failed to update deliverable:", responseText);
            }
        } catch (error) {
            console.error("Error updating deliverable:", error);
        }
    };

    // Delete Deliverable
    const deleteDeliverable = async (deliverableUuid, phaseId) => {
        try {
            const response = await fetch(
                `${config.baseURL}/deliverables/${uuid}/${phaseId}/${deliverableUuid}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setDeliverables((prevDeliverables) =>
                    prevDeliverables.filter((item) => item.uuid !== deliverableUuid)
                );
                console.log("Deliverable deleted successfully");
            } else {
                console.error("Failed to delete deliverable");
            }
        } catch (error) {
            console.error("Error deleting deliverable:", error);
        }
    };

    return (
        <div className={styles.deliverablesManager}>
            <div className={styles.top}>
                <h2>Deliverables</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={styles.addButton}
                >
                    <FaPlus /> Add Deliverable
                </button>
            </div>

            {deliverables.length === 0 ? (
                <p>No deliverables found.</p>
            ) : (
                <div className={styles.deliverablesTableContainer}>
                    <table className={styles.deliverablesTable}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Expected Finish</th>
                            <th>Phase</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deliverables.map((deliverable) => (
                            <tr key={deliverable.uuid}>
                                <td>{deliverable.name}</td>
                                <td>{deliverable.status || "N/A"}</td>
                                <td>
                                    {deliverable.startDate
                                        ? new Date(deliverable.startDate).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td>
                                    {deliverable.expectedFinish
                                        ? new Date(deliverable.expectedFinish).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td>{deliverable.phaseName || "Unknown"}</td>
                                <td>
                                    <button
                                        onClick={() => setEditDeliverable(deliverable)}
                                        className={styles["deliverable-editButton"]}
                                    >
                                        <FaEdit/>
                                    </button>
                                    <button
                                        onClick={() => deleteDeliverable(deliverable.uuid, deliverable.phaseId)}
                                        className={styles["deliverable-deleteButton"]}
                                    >
                                        <FaTrash/>
                                    </button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Deliverable Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Add New Deliverable</h3>
                        <input
                            type="text"
                            value={newDeliverable.name}
                            onChange={(e) =>
                                setNewDeliverable({ ...newDeliverable, name: e.target.value })
                            }
                            placeholder="Deliverable Name"
                            className={styles.inputField}
                        />
                        <select
                            value={newDeliverable.status}
                            onChange={(e) =>
                                setNewDeliverable({ ...newDeliverable, status: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="">Select Status</option>
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={newDeliverable.phaseId}
                            onChange={(e) =>
                                setNewDeliverable({ ...newDeliverable, phaseId: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="">Select Phase</option>
                            {phases.map((phase) => (
                                <option key={phase.uuid} value={phase.uuid}>
                                    {phase.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={newDeliverable.startDate}
                            onChange={(e) =>
                                setNewDeliverable({ ...newDeliverable, startDate: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        <input
                            type="date"
                            value={newDeliverable.expectedFinish}
                            onChange={(e) =>
                                setNewDeliverable({ ...newDeliverable, expectedFinish: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button
                                onClick={addDeliverable}
                                className={styles.addButton}
                                disabled={loading}
                            >
                                {loading ? "Adding Deliverable..." : "Add Deliverable"}
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={styles.closeButton}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Deliverable Modal */}
            {editDeliverable && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Edit Deliverable</h3>
                        <input
                            type="text"
                            value={editDeliverable.name}
                            onChange={(e) =>
                                setEditDeliverable({ ...editDeliverable, name: e.target.value })
                            }
                            placeholder="Deliverable Name"
                            className={styles.inputField}
                        />
                        <select
                            value={editDeliverable.status}
                            onChange={(e) =>
                                setEditDeliverable({ ...editDeliverable, status: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="">Select Status</option>
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={editDeliverable.phaseId}
                            onChange={(e) =>
                                setEditDeliverable({ ...editDeliverable, phaseId: e.target.value })
                            }
                            className={styles.inputField}
                        >
                            <option value="">Select Phase</option>
                            {phases.map((phase) => (
                                <option key={phase.uuid} value={phase.uuid}>
                                    {phase.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={editDeliverable.startDate}
                            onChange={(e) =>
                                setEditDeliverable({ ...editDeliverable, startDate: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        <input
                            type="date"
                            value={editDeliverable.expectedFinish}
                            onChange={(e) =>
                                setEditDeliverable({ ...editDeliverable, expectedFinish: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={updateDeliverable} className={styles.addButton}>
                                Update Deliverable
                            </button>
                            <button
                                onClick={() => setEditDeliverable(null)}
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

export default DeliverablesManager;