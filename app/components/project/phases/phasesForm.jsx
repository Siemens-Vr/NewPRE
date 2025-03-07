import React from "react";
import styles from "@/app/styles/project/phases/phasesForm.module.css";

const PhasesForm = ({ phases, setNewProject }) => {
    const handlePhaseChange = (index, field, value) => {
        const newPhases = [...phases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    const handleDeliverableChange = (phaseIndex, deliverableIndex, field, value) => {
        const newPhases = [...phases];
        newPhases[phaseIndex].deliverables[deliverableIndex] = {
            ...newPhases[phaseIndex].deliverables[deliverableIndex],
            [field]: value,
        };
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    const addDeliverable = (phaseIndex) => {
        const newPhases = [...phases];
        newPhases[phaseIndex].deliverables.push({
            name: "",
            status: "",
            startDate: "",
            expectedFinish: "",

        });
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    const deletePhase = (index) => {
        const newPhases = phases.filter((_, phaseIndex) => phaseIndex !== index);
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    const deleteDeliverable = (phaseIndex, deliverableIndex) => {
        const newPhases = [...phases];
        // Filter out the deliverable from the specific phase
        newPhases[phaseIndex].deliverables = newPhases[phaseIndex].deliverables.filter(
            (_, delIndex) => delIndex !== deliverableIndex
        );
        // Update the state with the modified phases array
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    const addPhase = () => {
        const newPhases = [
            ...phases,
            {
                name: "",
                startDate: "",
                endDate: "",
                status: "",
                deliverables: [],
            },
        ];
        setNewProject((prev) => ({ ...prev, phases: newPhases }));
    };

    return (
        <div className={styles.phasesForm}>
            {phases.map((phase, index) => (
                <div key={index} className={styles.phase}>
                    <label>
                        Phase Name:
                        <input
                            type="text"
                            value={phase.name}
                            onChange={(e) =>
                                handlePhaseChange(index, "name", e.target.value)
                            }
                        />
                    </label>
                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={phase.startDate}
                            onChange={(e) =>
                                handlePhaseChange(index, "startDate", e.target.value)
                            }
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            value={phase.endDate}
                            onChange={(e) =>
                                handlePhaseChange(index, "endDate", e.target.value)
                            }
                        />
                    </label>
                    <label>
                        Status:
                        <select
                            value={phase.status}
                            onChange={(e) =>
                                handlePhaseChange(index, "status", e.target.value)
                            }
                        >
                            <option value="">Select Status</option>
                            <option value="progress">Active</option>
                            <option value="todo">To do</option>
                            <option value="completed">Completed</option>
                        </select>
                    </label>
                    <div>
                        {phase.deliverables.map(
                            (deliverable, deliverableIndex) => (
                                <div
                                    key={deliverableIndex}
                                    className={styles.deliverable}
                                >
                                    <label>
                                        Deliverable Name:
                                        <input
                                            type="text"
                                            value={deliverable.name}
                                            onChange={(e) =>
                                                handleDeliverableChange(
                                                    index,
                                                    deliverableIndex,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <select
                                            value={deliverable.status}
                                            onChange={(e) =>
                                                handleDeliverableChange(
                                                    index,
                                                    deliverableIndex,
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select Status</option>
                                            <option value="progress">Active</option>
                                            <option value="todo">To do</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </label>
                                    <label>
                                        start date:
                                        <input
                                            type="date"
                                            value={deliverable.startDate}
                                            onChange={(e) =>
                                                handleDeliverableChange(
                                                    index,
                                                    deliverableIndex,
                                                    "startDate",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label><label>
                                        Expected Finish date:
                                        <input
                                            type="date"
                                            value={deliverable.expectedFinish}
                                            onChange={(e) =>
                                                handleDeliverableChange(
                                                    index,
                                                    deliverableIndex,
                                                    "expectedFinish",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteDeliverable(
                                                index,
                                                deliverableIndex
                                            )
                                        }
                                    >
                                        Delete Deliverable
                                    </button>
                                </div>
                            )
                        )}
                        <button
                            type="button"
                            onClick={() => addDeliverable(index)}
                        >
                            + Add Deliverable
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => deletePhase(index)}
                    >
                        Delete Phase
                    </button>
                </div>
            ))}
            <button type="button" onClick={addPhase}>
                + Add Phase
            </button>
        </div>
    );
};

export default PhasesForm;