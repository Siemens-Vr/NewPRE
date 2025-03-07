import React, { useState } from 'react';
import styles from '@/app/styles/categories/categories.module.css'
import { config } from '/config';

const CategoriesPopUp = ({ onClose }) => {
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            const response = await fetch(`${config.baseURL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            });

            if (response.ok) {
                console.log("Added successfully");
                setCategory(''); 
                onClose(); 
            } else {
                setError("Failed to add categories. Please try again."); 
            }
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <h2>Add New Component Types</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Component Types</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter categories separated by commas"
                        />
                    </div>
                    {loading && <p className={styles.loader}>Adding, please wait...</p>}
                    {error && <p className={styles.error}>{error}</p>} Error message
                    <div className={styles.popupActions}>
                        <button type="submit" disabled={loading}>Add</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoriesPopUp;
