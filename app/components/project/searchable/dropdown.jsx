"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import styles from "@/app/styles/project/project/project.module.css";
import Navbar from "@/app/components/project/navbar/navbar";

import { config } from "/config";

const DropDown = () => {
  const searchParams = useSearchParams();
  const params = useParams()
  const router = useRouter();
  const {uuid} = params;

  // const uuid = searchParams.get("uuid");

  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    status: "",
    description: "",
    budget: 0,
    funding: 0,
  });
  const [activeSection, setActiveSection] = useState("details");

  const backendUrl = `${config.baseURL}`;
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${backendUrl}/projects`);
      if (!response.ok) throw new Error("Error fetching projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjectData = async () => {
    if (!uuid) return;

    try {
      const projectRes = await fetch(`${backendUrl}/projects/${uuid}`);
      if (!projectRes.ok) throw new Error("Error fetching project data");

      const projectData = await projectRes.json();
      setProjectDetails({
        projectName: projectData.name,
        status: projectData.status,
        description: projectData.description,
        budget: projectData.budget,
        funding: projectData.funding,
      });

    } catch (error) {
      console.error("Failed to fetch project data:", error);
    }
  };

  // Fetch current project details
  useEffect(() => {
    fetchProjectData();
  }, [uuid]);

  // Handle project change from dropdown
  const handleProjectChange = (selectedUuid) => {
    router.push(`/pages/project/dashboard/${selectedUuid}/dashboard`);
    fetchProjectData()
    fetchProjects()
  };

  return (
      <div className={styles.projectInfoContainer}>
        {/* Navbar */}
        <div className={styles.projectDropdown}>
            <select
                onChange={(e) => handleProjectChange(e.target.value)}
                value={uuid || ""}
                className={styles.dropdown}
            >
              <option value="" disabled>
                Select a Project
              </option>
              {projects.map((project) => (
                  <option key={project.uuid} value={project.uuid}>
                    {project.name}
                  </option>
              ))}
            </select>
          </div>
       
          <Navbar
              projectName={projectDetails.projectName}
              projectID={uuid}
          />
         
    

        <div className={styles.content}>
          {/* Main Content */}
          {/* <div className={styles.mainContent}>
            {activeSection === "details" && (
                <Details projectDetails={projectDetails} />
            )}
            {activeSection === "documents" && <Documents uuid={uuid} />}
            {activeSection === "assignees" && (
                <Assignees uuid={uuid} backendUrl={backendUrl} />
            )}
            {activeSection === "phases" && (
                <Phases
                    uuid={uuid}
                    phases={phases}
                    backendUrl={backendUrl}
                    setPhases={setPhases}
                />
            )}

            {activeSection === "deliverables" && (
                <Deliverables
                    uuid={uuid}
                    backendUrl={backendUrl}
                />
            )}
            {activeSection === "expenses" && (
                <Expenses
                    uuid={uuid}
                    backendUrl={backendUrl}
                />
            )}       

            
          </div> */}

          {/* Conditionally Render Right Sidebar */}
          {/* {activeSection === "details" && (
              <div className={styles.rightBar}>
                <RightSidebar
                    budget={projectDetails.budget}
                    funding={projectDetails.funding}
                />
              </div>
          )} */}
        </div>
      </div>
  );
};

export default DropDown;