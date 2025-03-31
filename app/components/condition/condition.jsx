import React, { useState } from 'react';
import styles from '@/app/styles/condition/condition.module.css';

const ConditionPopUp = ({ onClose, conditions, setConditions }) => {
    const [status, setStatus] = useState('');
    const [quantity, setQuantity] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddCondition = (e) => {
        e.preventDefault();
        if (status && quantity && details) {
            const newCondition = { status, quantity, details };
            setConditions([...conditions, newCondition]);
            setStatus('');
            setQuantity('');
            setDetails('');
            setError(null);
        } else {
            setError("All fields are required.");
        }
    };

    const handleDeleteCondition = (index) => {
        const updatedConditions = conditions.filter((_, i) => i !== index);
        setConditions(updatedConditions);
    };

    return (
        <>
        <div className={styles.overlay}></div>
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <h2>Condition Details</h2>
                <form onSubmit={handleAddCondition}>
                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status" 
                            name="status" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select the condition of the components</option>
                            <option value="Okay">Okay</option>
                            <option value="Not Okay">Not Okay</option>
                        </select>

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Example: 10"
                        />

                        <label htmlFor="details">Details</label>
                        <input
                            type="text"
                            id="details"
                            name="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Example: Broken"
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.popupActions}>
                        <button type="submit" disabled={loading}>Add Condition</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
                
                <h3>Added Conditions</h3>
                {conditions.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Quantity</th>
                                <th>Details</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conditions.map((condition, index) => (
                                <tr key={index}>
                                    <td>{condition.status}</td>
                                    <td>{condition.quantity}</td>
                                    <td>{condition.details}</td>
                                    <td>
                                        <button onClick={() => handleDeleteCondition(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No conditions added yet.</p>
                )}
                <div className={styles.popupActions}>
                    <button type="button" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default ConditionPopUp;
