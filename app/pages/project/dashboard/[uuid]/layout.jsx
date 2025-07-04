"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import Navbar from '@/app/components/navbar/navbar';
import ProjectNavbar from '@/app/components/project/navbar/navbar';

// ProjectLayout.jsx
export default function ProjectLayout({ children }) {
  const { uuid, phaseuuid } = useParams();
  const [projectType, setProjectType] = useState(null);

  useEffect(() => {
    if (!uuid) return;
    api.get(`projects/${uuid}`)
      .then(res => {
        if (res.status === 200) setProjectType(res.data.type);
      })
      .catch(console.error);
  }, [uuid]);

  // Decide tab label and href for the third tab dynamically
  const thirdTab = projectType === "Milestones"
    ? { key: 'milestones', label: 'Milestones', href: `/projects/${uuid}/${phaseuuid}` }
    : projectType === "Work Package"
    ? { key: 'workpackage', label: 'Work Package',  href: `/projects/${uuid}/${phaseuuid}` }
    : { key: 'durationyears', label: 'Duration Years',  href: `/projects/${uuid}/${phaseuuid}` };

  const tabs = [
    { key: 'info',       label: 'Project Info', href: `/projects/${uuid}/` },
    { key: 'monitoring', label: 'Monitoring',   href: `/projects/${uuid}/monitoring` },
    thirdTab,
    { key: 'report',     label: 'Report',       href: `/projects/${uuid}/report` },
  ];

  return (
    <>
      <Navbar />
      <ProjectNavbar items={tabs} activeKey={thirdTab.key} />
      {React.cloneElement(children, { projectType })}
    </>
  );
}