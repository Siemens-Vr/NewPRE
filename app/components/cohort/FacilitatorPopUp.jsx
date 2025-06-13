
import React, {useEffect, useState} from "react";
import styles from "@/app/styles/cohorts/Facilitators/facilitatorsPopUp.module.css";
import Select from "react-select";
import Spinner from "@/app/components/spinner/spinner";
import { config } from "/config";

// New component for the Facilitator Popup
const FacilitatorPopup = ({ onClose, onAddFacilitator, facilitators }) => {
    const [selectedFacilitator, setSelectedFacilitator] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const roleOptions = [
        { value: 'Theory Instructor', label: 'Theory Instructor' },
        { value: 'Practical Instructor', label: 'Practical Instructor' },
    ];

    const handleAddFacilitator = () => {
        if (selectedFacilitator && selectedRole) {
            onAddFacilitator({ 
                value: selectedFacilitator.value, 
                label: selectedFacilitator.label, 
                role: selectedRole.value 
            });
            setSelectedFacilitator(null);
            setSelectedRole(null);
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.containers} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h3 className={styles.title}>Add Facilitator</h3>
                
                <div className={styles.facilitatorRoleSelection}>
                    <Select
                        className={styles.selects}
                        placeholder="Select Facilitator"
                        options={facilitators.map(facilitator => ({
                            value: facilitator.uuid,
                            label: `${facilitator.firstName} ${facilitator.lastName}`
                        }))}
                        value={selectedFacilitator}
                        onChange={setSelectedFacilitator}
                    />
                    <Select
                        className={styles.selects}
                        placeholder="Select Role"
                        options={roleOptions}
                        value={selectedRole}
                        onChange={setSelectedRole}
                    />
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
                        type="button"
                        onClick={handleAddFacilitator}
                        className={`${styles.saveButton} ${styles.button}`}
                        disabled={!selectedFacilitator || !selectedRole}
                    >
                        Add Facilitator
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FacilitatorPopup;