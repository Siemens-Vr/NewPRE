"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProjectCard from "@/app/components/project/projectCard";
import styles from "@/app/styles/dashboards/project/dashboard.module.css";
import Spinner from "@/app/components/spinner/spinner";
import api from "@/app/lib/utils/axios";
import { config } from "/config";
import Swal from "sweetalert2";

import AddProjectModal from "@/app/components/project/add/AddProjectModal"; // <-- import Add modal

const Dashboard = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const menuRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get(`projects`);
      if (response.status === 200) {
        setProjects(response.data);
        console.log("Projects fetched successfully:", response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleCardClick = (project) => {
    router.push(`/projects/${project.uuid}`);
    clearTimeout(closeTimeoutRef.current);
  };

  const handleMenuClick = (project) => {
    setSelectedProject(project);
  };

  const handleDelete = async (uuid, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`projects/delete/${uuid}`, { method: "DELETE" });
        if (response.ok) {
          setProjects((prev) => prev.filter((p) => p.uuid !== uuid));
          Swal.fire({
            title: "Deleted!",
            text: `${name} has been successfully deleted.`,
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        } else {
          throw new Error("Failed to delete the project");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
      setSelectedProject(null);
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeTimeoutRef.current = setTimeout(() => {
        setSelectedProject(null);
      }, 3000);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Project Management Dashboard</h1>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <button className={styles.addProjectBtn} onClick={() => setIsAddModalOpen(true)}>
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
                    <ProjectCard title={project.title} />
                    <div
                      className={styles.menuButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(project);
                      }}
                    >
                      &#x022EE; {/* Three dots icon */}
                    </div>
                  </div>
                  {selectedProject === project && (
                    <div className={styles.menuOptions}>
                      <button onClick={() => handleCardClick(project)}>View</button>
                      {/* Add your edit modal button here if needed */}
                      <button onClick={() => handleDelete(project.uuid, project.name)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        </section>
      </div>

      {/* Add Project Modal */}
     <AddProjectModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onAdded={fetchProjects}
/>
    </div>
  );
};

export default Dashboard;
