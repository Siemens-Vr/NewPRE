"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
// import styles from "@/app/styles/project/project/project.module.css";
import styles from "@/app/styles/project/project/milestonedrop.module.css";

// import styles from "@/app/styles/project/project/project.module.css
import { config } from "/config";

const DropDown = () => {
  const searchParams = useSearchParams();
  const params = useParams()
  const router = useRouter();
  const {phaseuuid} = params;
  const [phases, setPhases] = useState([]);
  const [phase, setPhase] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    status: "",
    description: "",
    budget: 0,
    funding: 0,
  });
console.log("Phase UUID:", phaseuuid);  // Debugging output
    const { uuid } = useParams();

  const backendUrl = `${config.baseURL}`;
  const fetchPhases = async () => {
    try {
      const response = await fetch(`${backendUrl}/milestones/${uuid}`);
      if (!response.ok) throw new Error("Error fetching phases");
      const data = await response.json();
      console.log("Fetched Phases Data:", data); 
      setPhases(data);
    } catch (error) {
      console.error("Failed to fetch phases:", error);
    }
  };
  useEffect(() => {
    fetchPhases();
  }, []);

 
  const fetchPhaseData = async () => {
    if (!phaseuuid) return;

   try {
               const response = await fetch(`${config.baseURL}/outputs/${phaseuuid}`);
               if (response.ok) {
                   const data = await response.json();
                   setOutputs(data);
               } else {
                   console.error("Failed to fetch outputs");
               }
           } catch (error) {
               console.error("Error fetching outputs:", error);
           }
  };

  // Fetch current project details
  useEffect(() => {
    fetchPhaseData();
  }, [phaseuuid]);

  useEffect(() => {
    console.log("Fetched Phases:", phases);  // Check if phaseuuid exists
  }, [phases]);
  

  const handleMilestoneChange = (selectedUuid) => {
    console.log("Selected Phase UUID:", selectedUuid); // Debugging output
    if (!selectedUuid) return;
  
    router.push(`/pages/project/dashboard/${uuid}/dashboard/phases/${selectedUuid}/dashboard`);
  };
  

  
  

  return (
      <div className={styles.projectInfoContainer}>
        {/* Navbar */}
        <div className={styles.project}>
            <h1>Milestone</h1>
           <div className={styles.milestoneDropdown}>
           <select
  onChange={(e) => handleMilestoneChange(e.target.value)}
  value={phaseuuid || ""}
  className={styles.dropdown}
>
  <option value="" disabled>
    Select a Milestone
  </option>
  {phases.map((phase) => (
    <option key={phase.uuid} value={phase.uuid}>  {/* FIXED: Ensuring correct UUID is used */}
      {phase.name}  
    </option>
  ))}
</select>



              </div>
          
            </div> 
      </div>
  );
};

export default DropDown;

