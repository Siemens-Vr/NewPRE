import React, { useState } from 'react';
import styles from '@/app/styles/project/assignees/assigneesForm.module.css';


const AssigneeForm = ({ assignee, saveAssignee, closeForm }) => {
    // Initialize form state with either the passed assignee or default empty values
    const [formState, setFormState] = useState(
        assignee || { name: '', role: '', access: '', dateJoined: '', gender: '' }
    );

    const handleChange = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveAssignee(formState); // Save the assignee
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>{assignee.name ? 'Edit Member' : 'Add Member'}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={formState.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="gender">Gender:</label>
                        <select
                            id="gender"
                            value={formState.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <input
                            id="role"
                            type="text"
                            value={formState.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="access">Access:</label>
                        <input
                            id="access"
                            type="text"
                            value={formState.access}
                            onChange={(e) => handleChange('access', e.target.value)}
                            required
                        />
                    </div>
                    <div>
        <label htmlFor="dateJoined">Date Joined:</label>
        <input
            id="dateJoined"
            type="date"
            value={formState.dateJoined}
            onChange={(e) => handleChange('dateJoined', e.target.value)}
        />
    </div>
    <div className={styles.formActions}>
        <button type="submit">Save</button>
        <button type="button" onClick={closeForm}>Cancel</button>
    </div>
</form>

            </div>
        </div>
    );
};

export default AssigneeForm;
