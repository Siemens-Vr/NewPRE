import React, {useEffect, useState} from "react";
import styles from "@/app/styles/cohorts/addCohort/addCohort.module.css";
import Select from "react-select";
import Spinner from "@/app/components/spinner/spinner";
import { config } from "/config";
import FacilitatorPopup from "@/app/components/cohort/FacilitatorPopUp"

const LevelForm = ({ onClose, onSave, cohortStartDate = "", cohortEndDate = "" }) => {
    const [level, setLevel] = useState({
        levelName: '',
        startDate: '',
        endDate: '',
        exam_dates: '',
        exam_quotation_number: '',
        facilitators: []
    });
    const facilitators = [
        { uuid: "fac001", firstName: "Alice", lastName: "Wanjiku" },
        { uuid: "fac002", firstName: "Brian", lastName: "Omondi" },
        { uuid: "fac003", firstName: "Catherine", lastName: "Mutua" },
        { uuid: "fac004", firstName: "David", lastName: "Kiptoo" },
        { uuid: "fac005", firstName: "Esther", lastName: "Njoki" }
      ];
      
    // const [facilitators, setFacilitators] = useState([]);
    const [levelDateError, setLevelDateError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFacilitatorPopup, setShowFacilitatorPopup] = useState(false);

    // Fetch facilitators when component mounts
    // useEffect(() => {
    //     const fetchFacilitators = async () => {
    //         try {
    //             const response = await fetch(`${config.baseURL}/facilitators`);
    //             const data = await response.json();
    //             if (Array.isArray(data)) {
    //                 setFacilitators(data);
    //             } else {
    //                 setFacilitators([]);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching facilitators:', error);
    //             setFacilitators([]);
    //         }
    //     };

    //     fetchFacilitators();
    // }, []);

    // Validation for level dates
    const validateDates = () => {
        if (!level.startDate || !level.endDate) return true;
        
        const levelStartDate = new Date(level.startDate);
        const levelEndDate = new Date(level.endDate);
        
        // If cohort dates are provided, validate level is within cohort
        if (cohortStartDate && cohortEndDate) {
            const cohortStart = new Date(cohortStartDate);
            const cohortEnd = new Date(cohortEndDate);
            
            if (levelStartDate < cohortStart || levelEndDate > cohortEnd) {
                setLevelDateError('Level dates must be within the cohort start and end dates.');
                return false;
            }
        }
        
        if (levelEndDate <= levelStartDate) {
            setLevelDateError('Level end date must be after the start date.');
            return false;
        }
        
        setLevelDateError('');
        return true;
    };

    const handleChange = (field, value) => {
        setLevel({
            ...level,
            [field]: value
        });
    };

    const addFacilitator = (facilitator) => {
        const updatedFacilitators = [...level.facilitators, facilitator];
        setLevel({
            ...level,
            facilitators: updatedFacilitators
        });
    };

    const removeFacilitator = (facilitatorIndex) => {
        const updatedFacilitators = [...level.facilitators];
        updatedFacilitators.splice(facilitatorIndex, 1);
        setLevel({
            ...level,
            facilitators: updatedFacilitators
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateDates()) {
            return;
        }
        
        // Set loading state (optional, for future API calls)
        setLoading(true);
        
        // Pass the level data back to parent component
        onSave(level);
        
        // Reset loading state
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className={styles.levelGroup}>
                        <h3 className={styles.title}>Add Level</h3>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Level Name</label>
                                <select
                                    className={styles.input}
                                    name="levelName"
                                    value={level.levelName}
                                    onChange={(e) => handleChange('levelName', e.target.value)}
                                    required
                                >
                                    <option value="">Select level name</option>
                                    <option value="SMSCP Level 1">SMSCP Level 1</option>
                                    <option value="SMSCP Level 2">SMSCP Level 2</option>
                                    <option value="SMSCP Level 3">SMSCP Level 3</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Start Date</label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    value={level.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>End Date</label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    value={level.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
                                    required
                                />
                            </div>
                            
                            {levelDateError && 
                                <p className='text-red-700 text-base text-center font-semibold'>{levelDateError}</p>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Exam Date</label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    value={level.exam_dates}
                                    onChange={(e) => handleChange('exam_dates', e.target.value)}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Exam Quotation Number</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={level.exam_quotation_number}
                                    onChange={(e) => handleChange('exam_quotation_number', e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                            <label className={styles.label}>Facilitators</label>
                                <button
                                    type="button"
                                    className={styles.addFacilitatorButton}
                                    onClick={() => setShowFacilitatorPopup(true)}
                                >
                                    + Add Facilitator
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.facilitator}>  
                            {level.facilitators.length > 0 ? (
                                <div className={styles.mainTable}>
                                    {/* <h3 className={styles.tableTitle}>Facilitators</h3> */}
                                    <table className={styles.infoTable}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {level.facilitators.map((facilitator, i) => (
                                                <tr key={i}>
                                                    <td>{facilitator.label}</td>
                                                    <td>{facilitator.role}</td>
                                                    <td>
                                                        <button 
                                                            type="button"
                                                            className={styles.removeButton}
                                                            onClick={() => removeFacilitator(i)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className={styles.noFacilitators}>
                                    {/* No facilitators added yet */}
                                </div>
                            )}
                        </div>

                        <div className={styles.buttons2}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={`${styles.cancelButton} ${styles.button}`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`${styles.saveButton} ${styles.button}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner/> Saving...
                                    </>
                                ) : (
                                    'Save Level'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            {/* Facilitator Popup */}
            {showFacilitatorPopup && (
                <FacilitatorPopup 
                    onClose={() => setShowFacilitatorPopup(false)}
                    onAddFacilitator={addFacilitator}
                    facilitators={facilitators}
                />
            )}
        </div>
    );
};

export default LevelForm;