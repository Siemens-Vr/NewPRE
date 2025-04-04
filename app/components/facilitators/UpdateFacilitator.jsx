"use client"
import styles from '@/app/styles/students/singleStudent/updateFacilitator.module.css'
import { useState, useEffect } from "react";
import { AddUpdateHoursPopup, ViewHoursPopup } from '@/app/components/facilitators/WorkHoursPopups'
import { config } from "/config";
import { useParams } from "next/navigation";
const SingleFacilitatorPage = ({onClose}) => {
    const [facilitator, setFacilitator] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentFacilitatorId, setCurrentFacilitatorId] = useState(null);
    const [popupType, setPopupType] = useState(null);



    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        idNo:'',
        phoneNo: '',
        gender: '',
    });
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchFacilitator = async () => {
            try {
                const response = await fetch(`${config.baseURL}/facilitators/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log("Fetched facilitator data:", data);
                setFacilitator(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    idNo: data.idNo,
                    phoneNo: data.phoneNo,
                    gender: data.gender,

                });
            } catch (error) {
                console.error('Error fetching facilitator:', error);
            }
        };

        fetchFacilitator();
    }, [id]);


    const [showAddUpdateHours, setShowAddUpdateHours] = useState(false);
    const [showViewHours, setShowViewHours] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await fetch(`${config.baseURL}/facilitators/${id}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {

                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setSuccessMessage(data.message); // Set the success message

            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            setErrorMessage(data.message); // Set the success message

            setTimeout(() => {
                setErrorMessage('');
            }, 404);


            // console.log("Update response:", data);

            const updatedFacilitator = await fetch(`${config.baseURL}/facilitators/${id}`);
            const updatedData = await updatedFacilitator.json();
            setFacilitator(updatedData);


            // Clear the success message after 5 seconds

        } catch (error) {
            // console.error('Error updating facilitator:', error);
            alert('Failed to update facilitator. Please try again.');
        }
    };

    const handleAddUpdateHours = async (entries) => {
        // console.log(entries)
        try {
            const response = await fetch(`${config.baseURL}/facilitators/${id}/hours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ entries }),
            });
            if (!response.ok) {
                setErrorMessage('Failed to add Hours');
                setTimeout(()=> setErrorMessage (''), 404);
                // throw new Error('Failed to add hours');
            }
            setSuccessMessage('Hours updated successfully');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (error) {
            setErrorMessage('Error updating hours:');
            setTimeout(()=> setErrorMessage (''), 404);
            // console.error('Error updating hours:', error);
            setErrorMessage('Failed to update hours. Please try again.');
            setTimeout(()=> setErrorMessage (''), 404);
            // alert('Failed to update hours. Please try again.');
        }
    };


    if (!facilitator) {
        return <div>Loading...</div>;
    }
    // console.log(formData)
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.container}>
                    <div className={styles.modalHeader}>
                        <button type="button" className={styles.closeButton} onClick={onClose}>
                            ✖
                        </button>
                        {/*<h1>{facilitator.firstName} {facilitator.lastName}</h1>*/}
                    </div>

                    {successMessage && (
                        <div className={styles.successMessage}>
                        {successMessage}
                        </div>
                    )}

                    <form className={styles.formGrid} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>ID Number</label>
                            <input
                                type="text"
                                name="idNo"
                                value={formData.idNo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Gender</label>
                            <input
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.submitButton}>

                            <button type="submit" className={styles.submitButton}>Update</button>
                        </div>
                    </form>

                    {/*<div className={styles.hoursButtons}>*/}
                    {/*    <button className={styles.button} onClick={() => {*/}
                    {/*        setCurrentFacilitatorId(facilitator.uuid);*/}
                    {/*        setPopupType('addUpdate');*/}
                    {/*    }}>Add Hours*/}
                    {/*    </button>*/}
                    {/*    <button className={styles.button} onClick={() => {*/}
                    {/*        setCurrentFacilitatorId(facilitator.uuid);*/}
                    {/*        setPopupType('view');*/}
                    {/*    }}>View Hours*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/*{popupType === 'addUpdate' && (*/}
                    {/*    <AddUpdateHoursPopup*/}
                    {/*        facilitatorId={currentFacilitatorId}*/}
                    {/*        onClose={() => setPopupType(null)}*/}
                    {/*        onSubmit={(entries) => handleAddUpdateHours(currentFacilitatorId, entries)}*/}
                    {/*    />*/}
                    {/*)}*/}

                    {/*{popupType === 'view' && (*/}
                    {/*    <ViewHoursPopup*/}
                    {/*        facilitatorId={currentFacilitatorId}*/}
                    {/*        onClose={() => setPopupType(null)}*/}
                    {/*    />*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
                );
                };

                export default SingleFacilitatorPage;