"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProjectCard from '@/app/components/project/projectCard';
import styles from '@/app/styles/dashboards/project/dashboard.module.css';
// import style from "@/app/styles/project/project/project.module.css";
import Spinner from "@/app/components/spinner/spinner";
import { config } from "/config";
import Swal from 'sweetalert2';

const Dashboard = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [editModalOpen, setEditModalOpen] = useState(false); // Edit modal visibility
    const [editProjectData, setEditProjectData] = useState(null); // Project being edited
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // To store the selected project for actions
    const [isSaving, setIsSaving] = useState(false); // To handle the saving state
    const [newProject, setNewProject] = useState({
        name: "",
        startDate: "",
        endDate: "",
        status: "",
        description: "",
    });
    const [showProjectInput, setShowProjectInput] =useState(false) ; 
    const [addProjectError, setAddProjectError] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [deleting, setDeleting] = useState(null); 
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);


    // Fetch projects from backend
    const fetchProjects = async () => {
        setLoading(true); // Start loading state
        try {
            const response = await fetch(`${config.baseURL}/projects`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(); // Fetch projects on mount
    }, []);

    function handleSearch(term) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }


    const handleCardClick = (project) => {
        console.log(project.uuid)
        router.push(`/pages/project/dashboard/${project.uuid}/dashboard`);
        clearTimeout(closeTimeoutRef.current); 
    };


    const handleOutsideClick = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            closeTimeoutRef.current = setTimeout(() => {
                setSelectedProject(null);
            }, 3000); 
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            clearTimeout(closeTimeoutRef.current); // Clean up on unmount
        };
    }, []);
    
    const handleDelete = async (uuid, name) => {
        // Call the delete API endpoint
const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      setDeleting(uuid);
        const response = await fetch(`${config.baseURL}/projects/delete/${uuid}`);
        if (response.ok) {
            setProjects((prevProjects) => prevProjects.filter((project) => project.uuid !== uuid));
              Swal.fire({
                        title: 'Deleted!',
                        text: `${name} has been successfully deleted.`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                      });
        } else {
            console.error('Failed to delete the project');
        }
        setSelectedProject(null); // Reset selected project
    }
};

    const openModal = () => setIsModalOpen(true);

    // Update closeModal to fetch projects
    const closeModal = () => {
        setIsModalOpen(false);
        fetchProjects(); // Refresh project list when modal closes
    };


    const addProject = async (e) => {
        e.preventDefault();
    
        if (!newProject.name.trim()) {
            alert("Project name is required!");
            return;
        }
    
        if (!newProject.startDate || !newProject.endDate) {
            alert("Both Start Date and End Date are required.");
            return;
        }
    
        const startDate = new Date(newProject.startDate);
        const endDate = new Date(newProject.endDate);
    
        // Check if End Date is before Start Date
        if (endDate < startDate) {
            alert("End Date cannot be before Start Date.");
            return;
        }
    
        try {
            const response = await fetch(`${config.baseURL}/projects/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });
    
            console.log("New project data:", newProject);
    
            if (response.ok) {
                fetchProjects();
                setShowProjectInput(false);
                setSuccessMessage("Project added successfully");
                setTimeout(() => setSuccessMessage(""), 3000);
                setNewProject({
                    name: "",
                    startDate: "",
                    endDate: "",
                    status: "",
                    description: "",
                });
            } else {
                const errorText = await response.text();
                console.error("Failed to add project:", errorText);
                setAddProjectError("Failed to add project.");
                setErrorMessage("Failed to add project");
                setTimeout(() => setErrorMessage(""), 3000);
                setShowProjectInput(false);
            }
        } catch (error) {
            console.error("Error in addProject function:", error);
            setAddProjectError("Error occurred while adding project.");
        }
    };
    

    const handleMenuClick = (project) => {
        setSelectedProject(project); // Set the selected project for actions
    };

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error}</p>;

    // Open edit modal with project data
    const handleEdit = (project) => {
        console.log(project)
        setEditProjectData(project);
        setEditModalOpen(true);
        clearTimeout(closeTimeoutRef.current); 
    };

// Close edit modal
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditProjectData(null);
        fetchProjects(); // Refresh projects after editing
    };



    const updateProject = async () => {
        if (editProjectData) {
            setIsSaving(true); // Start saving state

            // Clean the payload to only include valid fields
            const cleanedProjectData = {
                name: editProjectData.name,
                description: editProjectData.description,
                status: editProjectData.status,
                budget: editProjectData.budget,
                funding: editProjectData.funding,
                startDate: editProjectData.startDate,
                endDate: editProjectData.endDate,

            };

            console.log(cleanedProjectData)

            try {
                const response = await fetch(
                    `${config.baseURL}/projects/update/${editProjectData.uuid}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cleanedProjectData),
                    }
                );

                if (response.ok) {
                    closeEditModal(); // Close the modal on success
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update the project:', errorData);
                }
            } catch (error) {
                console.error('Error while updating project:', error);
            } finally {
                setIsSaving(false); // End saving state
            }
        }
    };




    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Project Management Dashboard</h1>
                     {successMessage && <p className={style.successMessage}>{successMessage}</p>}
                    {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} 
                    <div className={styles.controls}>
                        <input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            type="text"
                            placeholder="Search projects..."
                            className={styles.searchInput}
                        />
                  
                        <button className={styles.addProjectBtn}  onClick={() => setShowProjectInput(true)}>
                            Add Project
                        </button>
                    </div>
                </header>

                <section className={styles.boardView}>
                    <div className={styles.cardContainer}>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <div key={project.uuid} className={styles.projectCard} ref={menuRef}>
                                    <div className={styles.cardContent} onClick={() => handleCardClick(project)}>
                                        <ProjectCard
                                            title={project.name}
                                            
                                        />
                                        <div className={styles.menuButton} onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleMenuClick(project);
                                        }}>
                                            &#x022EE; {/* Three dots icon */}
                                        </div>
                                    </div>
                                    {selectedProject === project && (
                                        <div className={styles.menuOptions}>
                                            <button onClick={() => handleCardClick(project)}>View</button>
                                            <button onClick={() => handleEdit(project)}>Edit</button>
                                            <button onClick={() => handleDelete(project.uuid, project.name)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No  projects available.</p>
                        )}
                    </div>
                </section>
            </div>
            {editModalOpen && editProjectData && (
                <div className={styles.editModalOverlay}>
                    <div className={styles.editModalContent}>
                        <h3>Edit Project</h3>
                        <label htmlFor="">Project Name</label>
                        <input
                            type="text"
                            value={editProjectData.name}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, name: e.target.value })
                            }
                            placeholder="Project Name"
                            className={styles.editInputField}
                        />
                        <label htmlFor=""> Description</label>
                           <input
                            type="text"
                            value={editProjectData.description || ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, description: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <label htmlFor="Status">Status</label>
                        <select
                            value={editProjectData.status}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, status: e.target.value })
                            }
                            className={styles.editInputField}
                        >
                            <option value="todo">Todo</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label htmlFor="">Start Date</label>
                        <input
                            type="date"
                            value={editProjectData.startDate ? editProjectData.startDate.split('T')[0] : ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, startDate: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <label htmlFor="">End Date</label>
                        <input
                            type="date"
                            value={editProjectData.endDate ? editProjectData.endDate.split('T')[0] : ''}
                            onChange={(e) =>
                                setEditProjectData({ ...editProjectData, endDate: e.target.value })
                            }
                            className={styles.editInputField}
                        />
                        <div className={styles.editModalActions}>
                        <button onClick={closeEditModal} className={styles.editCancelButton}>
                                Cancel
                            </button>
                            <button
                                onClick={updateProject}
                                disabled={isSaving} // Disable the button while saving
                                className={`${styles.editSaveButton} ${isSaving ? styles.saving : ''}`}
                            >
                                {isSaving ? (
                                    <>
                                        <span className={styles.loadingDots}>Saving Changes</span>
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}
   {/* Add Project Modal */}
   {showProjectInput && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <h3>Add Project</h3>
                        <div className={style.divInput}>
                            <label htmlFor="Name">Name</label>
                            <input
                                type="text"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                placeholder="Project Name"
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="Start Date">Start Date</label>
                            <input
                                type="date"
                                value={newProject.startDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, startDate: e.target.value })
                                }
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="End Date">End Date</label>
                            <input
                                type="date"
                                value={newProject.endDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, endDate: e.target.value })
                                }
                                required
                                className={style.inputField}
                            />
                        </div>
                        <div className={style.divInput}>
                        <label htmlFor="Status">Status</label>
                        <select
                            value={newProject.status}
                            onChange={(e) =>
                                setNewProject({ ...newProject, status: e.target.value })
                            }
                            className={style.inputField}
                        >
                            <option value="">Select Status</option>
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        </div>
                        <div className={style.divInput}>
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className={style.inputField}
                                required
                            />
                        </div>
                        <div className={style.modalActions}>
                        <button
                                onClick={() => setShowProjectInput(false)}
                                className={style.closeButton1}
                            >
                                Cancel
                            </button>
                        <button onClick={addProject} disabled={isAdding} className={style.addButton1}>
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;