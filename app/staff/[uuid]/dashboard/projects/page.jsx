"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProjectCard from "@/app/components/project/projectCard";
import styles from "@/app/styles/dashboards/project/dashboard.module.css";
import Spinner from "@/app/components/spinner/spinner";
import api from "@/app/lib/utils/axios";
import Swal from "sweetalert2";
import Toolbar from '@/app/components/ToolBar/ToolBar';
import { MdFilterList, MdAdd } from 'react-icons/md';
import AddProjectModal from "@/app/components/project/add/AddProjectModal";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const pathname     = usePathname();
  const router       = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddModalOpen,  setIsAddModalOpen]  = useState(false);

  const menuRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const  res  = await api.get(`/projects/personnel/user`);
      console.log("data",res.data)
      const data = res.data.projects
      setProjects([data]);
    } catch (err) {
        console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("projects",projects)
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCardClick = (project) => {
    router.push(`/projects/${project.uuid}`);
    clearTimeout(closeTimeoutRef.current);
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
        const res = await fetch(`projects/delete/${uuid}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        setProjects((prev) => prev.filter(p => p.uuid !== uuid));
        Swal.fire("Deleted!", `${name} has been deleted.`, "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
      setSelectedProject(null);
    }
  };

  const handleMenuClick = (project) => {
    setSelectedProject(project);
  };
// added something
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
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
  if (error)   return <p>Error: {error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Projects Management Dashboard</h1>
        <Toolbar
          placeholder="Search Project..."
          buttons={[
            { label: 'Filter', onClick: () => {}, variant: 'secondary', icon: MdFilterList },
          
          ]}
        />

        <section>
          <div className={styles.cardContainer}>
            {projects.map((project, idx) => (
              <div
                key={project.uuid}
                className={styles.projectWrapper}
                ref={menuRef}
              >
                <div
                  className={styles.projectCard}
                  onClick={() => handleCardClick(project)}
                >
                  <ProjectCard
                    title={project.title}
                    implementation_startDate={project.implementation_startDate}
                    implementation_endDate={project.implementation_endDate}
                  />
                </div>

                <div className={styles.cardIndexItem}>
                  <span className={styles.indexNumber}>{idx + 1}</span>
                  <br />
                  <span className={styles.indexName}>{project.title}</span>
                </div>

                {selectedProject === project && (
                  <div className={styles.menuOptions}>
                    <button onClick={() => handleCardClick(project)}>View</button>
                    <button onClick={() => handleDelete(project.uuid, project.title)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={fetchProjects}
      />
    </div>
  );
}
