"use client"
import { useEffect, useState } from 'react';
import styles from '@/app/styles/project/project/project.module.css';
import { useParams } from 'next/navigation';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { config } from "/config";

const Details = () => {
  const params = useParams();
  const {uuid} = params
  console.log(uuid)
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    status: "",
    description: "",
    budget: 0,
    funding: 0,
  });

 
  const fetchProjectData = async () => {
     if (!uuid) return;
 
     try {
       const projectRes = await fetch(`${config.baseURL}/projects/${uuid}`);
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
    const budgetData = [
        { month: 'Jan', Budget: 4000, Funding: 2400 },
        { month: 'Feb', Budget: 3000, Funding: 1398 },
        { month: 'Mar', Budget: 2000, Funding: 9800 },
        { month: 'Apr', Budget: 2780, Funding: 3908 },
        { month: 'May', Budget: 1890, Funding: 4800 },
        { month: 'Jun', Budget: 2390, Funding: 3800 },
        { month: 'Jul', Budget: 3490, Funding: 4300 },
    ];
    console.log(projectDetails)

    return (
        <div className={styles.projectDetails}>
            <div className={styles.projectDetail}>

            <div className={styles.card}>
               <div className={styles.imgDiv}>
               <img src='/60111.jpg' alt="Avatar image" className={styles.img} />  
               <h2>{projectDetails.projectName}</h2>             
 
               </div>

                <div className={styles.conditions}>
                <p>Status:{projectDetails.status}</p>
                <p>Startdate:{}</p>
                <p>Enddate:{}</p>
                </div>

             </div>

            <div className={styles.card}>
                <h2>Description</h2>
                <p>{projectDetails.description}</p>
            </div>
            </div>
          
            <div>
            <div className={styles.card}>
                <h2>Budget Allocation</h2>
                {/* <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="Budget" stroke="#1e90ff"/>
                        <Line type="monotone" dataKey="Funding" stroke="#ff4081"/>
                    </LineChart>
                </ResponsiveContainer> */}
            </div>
            </div>
        </div>)
}

export default Details;