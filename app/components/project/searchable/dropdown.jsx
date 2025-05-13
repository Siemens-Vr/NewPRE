"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import styles from "@/app/styles/project/project/project.module.css";
import api from "@/app/lib/utils/axios";


import { config } from "/config";

const DropDown = () => {
  const searchParams = useSearchParams();
  const params = useParams()
  const router = useRouter();
  const {uuid, phaseuuid} = params;

  // const uuid = searchParams.get("uuid");

  const [projects, setProjects] = useState([]);
  const [phases, setPhases] = useState([]);
  const [phase, setPhase] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    status: "",
    description: "",
    budget: 0,
    funding: 0,
  });
  const [activeSection, setActiveSection] = useState("details");


  const fetchProjects = async () => {
    try {
      const response = await api.get(`/projects`);
      if (response.status!== 200) throw new Error("Error fetching projects");
      const data =  response.data;
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  const fetchPhases = async () => {
    try {
      const response = await api.get(`/milestones/${uuid}`);
      // console.log(response)
      if (response.status!== 200) throw new Error("Error fetching phases");
      const data = response.data;
      setPhases(data);
    } catch (error) {
      console.error("Failed to fetch phases:", error);
    }
  };
  // console.log(phases)
  useEffect(() => {
    fetchProjects();
    fetchPhases();
  }, []);


  const fetchProjectData = async () => {
    if (!uuid) return;

    try {
      const projectRes = await api.get(`/projects/${uuid}`);
      if (projectRes.status !== 200) throw new Error("Error fetching project data");

      const projectData =  projectRes.data;
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
  const fetchPhaseData = async () => {
    if (!phaseuuid) return;

    try {
      const phaseRes = await api.get(`outputs/${phaseuuid}`);
      if (phaseRes.status !== 200) throw new Error("Error fetching project data");

      const phaseData =  phaseRes.data;
      setProjectDetails({
        name: phase.name,
        completionDate: phase.completionDate,
        status: phase.status,
        description: phase.description,
      });

    } catch (error) {
      console.error("Failed to fetch project data:", error);
    }
  };

  // Fetch current project details
  useEffect(() => {
    fetchProjectData();
  }, [uuid]);
  useEffect(() => {
    fetchPhaseData();
  }, [phaseuuid]);

  // Handle project change from dropdown
  const handleProjectChange = (selectedUuid) => {
    router.push(`/pages/project/dashboard/${selectedUuid}/dashboard`);
    fetchProjectData()
    fetchProjects()
  };
  
  const handleMilestoneChange = (e) => {
    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${phases.phaseuuid}/dashboard`);
    fetchPhaseData();
    fetchPhases()
  };

  return (
      <div className={styles.projectInfoContainer}>
        {/* Navbar */}
        <h1 className={styles.projecth1}>Project</h1>

        <div className={styles.project}>
        
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
          
            </div> 
      </div>
  );
};

export default DropDown;

