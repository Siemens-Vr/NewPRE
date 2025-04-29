import React, { useState } from 'react';
import styles from '@/app/styles/categories/categories.module.css'
import api from '@/app/lib/utils/axios';


const CategoriesPopUp = ({ onClose }) => {
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
     

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            const categoriesArray = category
            .split(',')
            .map(c => c.trim())
            .filter(c => c !== '');

            if (categoriesArray.length === 0) {
                setError("Please enter at least one valid category.");
                setLoading(false);
                return;
            }

            const payload = { categories: categoriesArray };

            const response = await api.post(`/categories`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.statusText === "OK") {
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
            <button type="button" onClick={onClose} className={styles.btn}>X</button>

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
                    {error && <p className={styles.error}>{error}</p>} 
                    <div className={styles.popupActions}>
                        <button type="submit" disabled={loading}>Add</button>
                     </div>
                </form>
            </div>
        </div>
    );
};

export default CategoriesPopUp;
