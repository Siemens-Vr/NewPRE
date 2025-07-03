import React from "react";
import styles from "@/app/styles/project/projectInfo.module.css";

const ProjectInfo = ({ newProject, setNewProject }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.projectInfo}>
            <label>
                Project Name:
                <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Start Date:
                <input
                    type="date"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                End Date:
                <input
                    type="date"
                    name="endDate"
                    value={newProject.endDate}
                    onChange={handleChange}
                />
            </label>
            <label>
                Status:
                <select
                    name="status"
                    value={newProject.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="progress">Active</option>
                    <option value="todo">To do</option>
                    <option value="completed">Completed</option>

                </select>
            </label>
            <label>
                Description:
                <input
                    type="text"
                    name="description"
                    value={newProject.description}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};

export default ProjectInfo;
