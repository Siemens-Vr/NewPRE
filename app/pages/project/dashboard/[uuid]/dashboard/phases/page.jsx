"use client";
import React, { useState, useEffect,useRef } from "react";
import styles from "@/app/styles/project/project/milestone.module.css"
import {  FaPlus  } from "react-icons/fa";
import api from "@/app/lib/utils/axios";
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';


const Phases = () => {
    const [phases, setPhases] = useState([]);
    const [newPhase, setNewPhase] = useState({
        name: "",
        startDate: "",
        endDate: "",
        status: "",
        deliverables: [],
    });
    const [viewPhaseData, setViewPhaseData] = useState(null);
    const [editPhaseData, setEditPhaseData] = useState(null);
    const [editPhase, setEditPhase] = useState(null);  // State for editing phase
    const [showPhaseInput, setShowPhaseInput] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addPhaseError, setAddPhaseError] = useState("");
    const router = useRouter();
    const params = useParams();
    const { uuid, id } = params;
    const [successMessage, setSuccessMessage] = useState("");
    const [deleting, setDeleting] = useState(null);
    const closeTimeoutRef = useRef(null);
    const dropdownRef = useRef(null);

    const [selectedMilestone, setSelectedMilestone] = useState(null); // To store the selected Milestone for actions
    const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal visibility

const handleMenuClick = (phase) => {
    setSelectedMilestone(phase); // Set the selected project for actions
};

const fetchPhases = async () => {
    try {
        const response = await api.get(`/milestones/${uuid}`);
        if (response.status == 200) {
            const data =  response.data;
            setPhases(data);
            console.log(data);
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

    const showErrorAlert = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        confirmButtonColor: '#3085d6',
    });
    };

    const addPhase = async () => {
    console.log("UUID in addPhase:", uuid);
    if (!uuid) {
        console.error("UUID is undefined.");
        return;
    }

    if (!newPhase.name || !newPhase.startDate || !newPhase.endDate || !newPhase.status) {
        showErrorAlert("All fields (Name, Start Date, End Date, and Status) are required.");
        return;
    }

    const startDate = new Date(newPhase.startDate);
    const endDate = new Date(newPhase.endDate);

    // Check if End Date is before Start Date
    if (endDate < startDate) {
        showErrorAlert("End Date cannot be before Start Date.");
        return;
    }

    setIsAdding(true);
    setAddPhaseError("");

    try {
        const payload = {
            name: newPhase.name,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: newPhase.status,
        };

        console.log(payload);

        const response = await api.post(`/milestones/${uuid}/`,payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            fetchPhases();
            setShowPhaseInput(false);
            setSuccessMessage("Milestone added successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
            setNewPhase({
                name: "",
                startDate: "",
                endDate: "",
                status: "",
            });
        } else {
            const errorText = response.message;
            console.error("Failed to add phase:", errorText);
            setAddPhaseError("Failed to add phase.");
        }
    } catch (error) {
        console.error("Error in addPhase function:", error);
        setAddPhaseError("Error occurred while adding phase.");
    } finally {
        setIsAdding(false);
    }
};


// Attaching a click listener
useEffect(() => {
    const handleClickOutside = (event) => {
        if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
        ) {
        setSelectedMilestone(null); // Close the dropdown
        }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);


const deletePhase = async (index, name) => {
    const phaseToDelete = phases[index];
    if (!uuid || !phaseToDelete?.uuid) {
        console.error("UUID is missing:", uuid, phaseToDelete?.uuid);
        return; 
    }
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

    console.log("Deleting phase with UUID:", uuid, phaseToDelete.uuid);

    try {
        const response = await fetch(`${config.baseURL}/milestones/delete/${phaseToDelete.uuid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phaseId: phaseToDelete.uuid }),
        });

        if (response.ok) {
            setPhases((prevPhases) => prevPhases.filter((_, i) => i !== index));
            fetchPhases();
                Swal.fire({
                        title: 'Deleted!',
                        text: `${name} has been successfully deleted.`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        });
        } else {
            console.error("Failed to delete phase");
            // showErrorAlert(error || 'Failed to delete phase.');
        }
    } catch (error) {
        console.error("Error deleting phase:", error);
        showErrorAlert('An error occurred while trying to delete the phase.');
    }
    finally {
        setDeleting(null);
    }   
}
};



const updatePhase = async () => {
    if (!editPhaseData.name.trim()) {
        alert("Please provide all required details including name and status!");
        return;
    }

    if (!editPhaseData.startDate || !editPhaseData.endDate) {
        alert("Please provide both Start Date and End Date.");
        return;
    }

    const startDate = new Date(editPhaseData.startDate);
    const endDate = new Date(editPhaseData.endDate);

    // Check if End Date is before Start Date
    if (endDate < startDate) {
        alert("End Date cannot be before Start Date.");
        return;
    }
    setAddPhaseError("");

    try {
        const payload = {
            
                    phaseId: editPhaseData.uuid,
                    name: editPhaseData.name,
                    status: editPhaseData.status,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
          
           
        };

        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("Updating phase with:", uuid, editPhaseData.uuid);

        const response = await api.put(`/milestones/update/${editPhaseData.uuid}`,payload,
            {headers: {"Content-Type": "application/json",},
            }
        );

        if (response.status === 200) {
            fetchPhases();
            console.log("Phase updated successfully");
            setSuccessMessage("Phase updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
            setEditPhase(null);
            setEditPhaseData(null);
        } else {
            const responseText =  response.message;
            console.error("Failed to update phase:", responseText);
        }
    } catch (error) {
        console.error("Error updating phase:", error);
    }
};

    // View click

    const handleCardClick = (phase) => {
        console.log(phase.uuid)
            router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phase.uuid}/dashboard`)
        clearTimeout(closeTimeoutRef.current); 
    };
    
    const handleEdit = (phase) => {
            setEditPhaseData(phase);
            setEditModalOpen(true);
            clearTimeout(closeTimeoutRef.current); 
    };



return (
    // <div className= {styles.container}></div>
    <div className={styles.phases}>
        <div className = {styles.top}>
            <h2>Milestones</h2>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>} 
            <button

                onClick={() => setShowPhaseInput(true)}
                className={styles.addBtn}
            >
                <FaPlus /> Add Milestone
            </button>
        </div>
        
        <div className={styles.milestoneContainer}>
            {phases.map((phase, index) => (
                <div
                    key={index}
                    className={styles.milestone}
                >
                {/* <div className="flex justify-between items-center mb-2 border-b border-gray-500 pb-2"> */}
                <div className="relative">
                    <h3 className={styles.h3}>
                    {phase.name}
                    </h3>                 
                    
                    <div className={styles.iconButton} onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                handleMenuClick(phase);
                            }}>
                            <div className={styles.icon}>&#x022EE;</div> 
                        </div>



    
                    {selectedMilestone === phase && (

                    <div ref={dropdownRef} className={styles.menuOptions}>
                            <button onClick={() => handleCardClick(phase)}>View</button>
                            <button onClick={() => handleEdit(phase)}>Edit</button>
                            <button onClick={() => deletePhase(index, phase.name)}>Delete</button>
                            
                        </div>
                    )}

    
    </div>
    <div className={styles.detail}>
    <p>
        <strong>Start Date:</strong>{" "}
        {phase.startDate
        ? new Date(phase.startDate).toLocaleDateString()
        : ""}
    </p>
    <p>
        <strong>End Date:</strong>{" "}
        {phase.endDate
        ? new Date(phase.endDate).toLocaleDateString()
        : ""}
    </p>
    <p>
        <strong>Status:</strong> {phase.status}
    </p>
    </div>
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
                            placeholder="Milestone Name"
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
                    
                        <button onClick={addPhase} disabled={isAdding} className={styles.addButton1}>
                            {isAdding ? "Adding..." : "Add"}
                        </button>

                        <button
                            onClick={() => setShowPhaseInput(false)}
                            className={styles.closeButton1}
                        >
                            X
                        </button>
                        
                    </div>
                    {addPhaseError && <p className={styles.errorMessage}>{addPhaseError}</p>}
                </div>
            </div>
        )}

        {/* Edit Phase Modal */}
        {editModalOpen && editPhaseData && (
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

                    <button onClick={updatePhase} className={styles.addButtons1}>
                            Update
                        </button>

                    <button
                            onClick={() => setEditPhaseData(null)}
                            className={styles.closeButton1}
                        >
                            X
                        </button>
                        
                        
                    </div>
                    {addPhaseError && <p className={styles.errorMessage}>{addPhaseError}</p>}
                </div>
            </div>
        )}
    </div>
);
};

export default Phases;