import React, { useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import AssigneeForm from './assigneesTable'
import styles from '@/app/styles/project/assignees/assigneesForm.module.css';

const AssigneesTable = ({ assignees = [], setNewProject }) => {
    const [showForm, setShowForm] = useState(false); // State to toggle the form modal
    const [editingIndex, setEditingIndex] = useState(null); // Track if editing an existing assignee

    // Function to add a new assignee, which opens the form
    const addAssignee = () => {
        setEditingIndex(null); // Reset the editing index to avoid pre-filling the form
        setShowForm(true); // Show the form modal
    };

    // Function to save a new or edited assignee
    const saveAssignee = (newAssignee) => {
        if (editingIndex !== null) {
            // If editing an existing assignee, update the assignee at the editing index
            const updatedAssignees = [...assignees];
            updatedAssignees[editingIndex] = newAssignee;
            setNewProject(prev => ({ ...prev, assignees: updatedAssignees }));
        } else {
            // If adding a new assignee, append it to the list
            setNewProject(prev => ({
                ...prev,
                assignees: [...prev.assignees, newAssignee],
            }));
        }
        setShowForm(false); // Close the form after saving
    };

    // Function to remove an assignee from the list
    const removeAssignee = (index) => {
        const updatedAssignees = assignees.filter((_, i) => i !== index);
        setNewProject(prev => ({ ...prev, assignees: updatedAssignees }));
    };

    return (
        <div className={styles.assigneesTable}>
            <h1>Assignees</h1>
            {/* Show the add button */}
            <button onClick={addAssignee} className={styles.addButton}>
                <FaPlus /> Add Assignee
            </button>
            
            {/* Table to display the assignees */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>Access</th>
                        <th>Date Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignees.map((assignee, index) => (
                        <tr key={index}>
                            <td>{assignee.name}</td>
                            <td>{assignee.gender}</td>
                            <td>{assignee.role}</td>
                            <td>{assignee.access}</td>
                            <td>{assignee.dateJoined}</td>
                            <td>
                                <button
                                    onClick={() => { 
                                        setEditingIndex(index); 
                                        setShowForm(true); 
                                    }}
                                >
                                    Edit
                                </button>
                                <button onClick={() => removeAssignee(index)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Show the AssigneeForm modal when showForm is true */}
            {showForm && (
                <AssigneeForm
                    assignee={editingIndex !== null ? assignees[editingIndex] : {}}
                    saveAssignee={saveAssignee}
                    closeForm={() => setShowForm(false)} // Close the form when cancel is clicked
                />
            )}
        </div>
    );
};

export default AssigneesTable;
