"use client";
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '@/app/styles/project/project/project.module.css';
import { config } from "/config";

const Assignees = ({ uuid }) => {
    const [assignees, setAssignees] = useState([]);
    const [newAssignee, setNewAssignee] = useState({ name: '', gender: '', access: '', role: '', dateJoined: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingAssigneeIndex, setEditingAssigneeIndex] = useState(null);

    const fetchAssignees = async () => {
        try {
            const response = await fetch(`${config.baseURL}/assignees/${uuid}`);
            if (!response.ok) {
                console.error(`Failed to fetch assignees: ${response.status}`);
                return;
            }

            const data = await response.json(); // Call response.json() only once
            console.log('Fetched Assignees:', data); // Log the parsed data
            setAssignees(data); // Use the data directly
        } catch (error) {
            console.error('Error fetching assignees:', error);
        }
    };
    // Fetch assignees initially
    useEffect(() => {


        fetchAssignees();
    }, [uuid]);


    const addAssignee = async (newAssignee) => {
        try {
            const response = await fetch(`${config.baseURL}/assignees/${uuid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignees: [newAssignee] }),
            });
            if (response.ok) {
                // const updatedProject = await response.json();
                // setAssignees(updatedProject.assignees);
                fetchAssignees();
            } else {
                console.error('Failed to add assignee');
            }
        } catch (error) {
            console.error('Error adding assignee:', error);
        }
    };

    const deleteAssignee = async (assigneeId) => {
        try {
            const response = await fetch(`${config.baseURL}/assignees/${uuid}/${assigneeId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAssignees((prevAssignees) => prevAssignees.filter((assignee) => assignee.uuid !== assigneeId));
            } else {
                console.error('Failed to delete assignee');
            }
        } catch (error) {
            console.error('Error deleting assignee:', error);
        }
    };

    const updateAssignee = async (updatedAssignee) => {
        try {
            const response = await fetch(`${config.baseURL}/assignees/${uuid}/${updatedAssignee.uuid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAssignee),
            });
            if (response.ok) {
                const updatedData = await response.json();
                setAssignees((prevAssignees) =>
                    prevAssignees.map((assignee) => (assignee.uuid === updatedData.uuid ? updatedData : assignee))
                );
                resetForm();
            } else {
                console.error('Failed to update assignee', response.status, await response.text());
            }
        } catch (error) {
            console.error('Error updating assignee:', error);
        }
    };

    const resetForm = () => {
        setNewAssignee({ name: '', gender: '', access: '', role: '', dateJoined: '' });
        setShowModal(false);
        setEditingAssigneeIndex(null);
    };

    const handleEditClick = (index) => {
        const assigneeToEdit = assignees[index];
        setNewAssignee(assigneeToEdit);
        setEditingAssigneeIndex(index);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (editingAssigneeIndex !== null) {
            await updateAssignee({ ...newAssignee, uuid: assignees[editingAssigneeIndex].uuid });
        } else {
            await addAssignee(newAssignee);
        }
        resetForm();
    };

    return (
        <div className={styles.assignees}>
            <div className={styles.assigneesHeader}>
                <h2>Assignees</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className={styles.addButtonTopRight}
                >
                    <FaPlus /> Add Member
                </button>
            </div>
            <table className={styles.assigneeTable}>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Access</th>
                    <th>Role</th>
                    <th>Date Joined</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {assignees?.map((assignee, index) => (
                    <tr key={assignee.uuid}>
                        <td>
                            <img
                                src={`https://i.pravatar.cc/150?img=${index + 1}`}
                                alt="Profile"
                                className={styles.profilePic}
                            />
                        </td>
                        <td>{assignee.name}</td>
                        <td>{assignee.gender}</td>
                        <td>{assignee.access}</td>
                        <td>{assignee.role}</td>
                        <td>{assignee.dateJoined}</td>
                        <td>
                            <div className={styles.actionButtons}>
                                <FaEdit className={styles.editIcon} onClick={() => handleEditClick(index)}/>
                                <FaTrash className={styles.deleteIcon} onClick={() => deleteAssignee(assignee.uuid)}/>
                            </div>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>{editingAssigneeIndex !== null ? 'Edit Member' : 'Add Member'}</h3>
                        <div className={styles.divInput}>
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                value={newAssignee.name}
                                onChange={(e) => setNewAssignee({...newAssignee, name: e.target.value})}
                                placeholder="Name"
                                className={styles.inputField}
                            />
                        </div>
                         <div className={styles.divInput}>
                                
                            <label htmlFor="">Gender</label>
                            <select
                                value={newAssignee.gender}
                                onChange={(e) => setNewAssignee({...newAssignee, gender: e.target.value})}
                                className={styles.inputField}
                            >
                                <option value="">Select Status</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                        </div>
                         <div className={styles.divInput}>
                            
                            <label htmlFor="">Level</label>
                            <input
                                type="text"
                                value={newAssignee.access}
                                onChange={(e) => setNewAssignee({...newAssignee, access: e.target.value})}
                                placeholder="Access Level"
                                className={styles.inputField}
                            />
                        </div>
                         <div className={styles.divInput}>
                            
                            <label htmlFor="">Role</label>
                            <input
                                type="text"
                                value={newAssignee.role}
                                onChange={(e) => setNewAssignee({...newAssignee, role: e.target.value})}
                                placeholder="Role"
                                className={styles.inputField}
                            />
                        </div>
                         <div className={styles.divInput}>
                            <label htmlFor="">Date Joined</label>
                            <input
                                type="date"
                                value={newAssignee.dateJoined}
                                onChange={(e) => setNewAssignee({...newAssignee, dateJoined: e.target.value})}
                                className={styles.inputField}
                            />

                        </div>

     
                        <div className={styles.modalActions}>
                            <button onClick={handleSubmit} className={styles.addButton}>
                                {editingAssigneeIndex !== null ? 'Update' : 'Add'}
                            </button>
                            <button onClick={resetForm} className={styles.closeButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignees;