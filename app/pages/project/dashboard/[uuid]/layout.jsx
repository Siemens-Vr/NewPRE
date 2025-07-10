"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Navbar from "@/app/components/navbar/navbar";
import ProjectNavbar from "@/app/components/project/navbar/navbar";

export default function ProjectLayout({ children }) {
  const { uuid } = useParams();
  const pathname = usePathname() || "";
  // split "/projects/:uuid/:phaseuuid/whatever" → ["projects","uuid","phaseuuid",...]
  const segments = pathname.split("/").filter(Boolean);
  const phaseuuid = segments[2] || "";

  const [projectType, setProjectType] = useState(null);

  // grab projectType so we can choose the right tab labels/hrefs
  useEffect(() => {
    if (!uuid) return;
    api.get(`/projects/${uuid}`)
       .then(res => setProjectType(res.data.type))
       .catch(console.error);
  }, [uuid]);

  // build the “third” tab (Milestones / Work Package / Duration Years)
  const thirdTab = projectType === "Milestones"
    ? { key: "milestones",    label: "Milestones",    href: `/projects/${uuid}/${phaseuuid}` }
    : projectType === "Work Package"
    ? { key: "workpackage",   label: "Work Package",  href: `/projects/${uuid}/${phaseuuid}` }
    : projectType === "Duration Years"
    ? { key: "durationyears", label: "Duration Years", href: `/projects/${uuid}/${phaseuuid}` }
    : null;

  // only show monitoring/thirdTab if we have a phaseuuid
  const tabs = [
    { key: "info",       label: "Project Info", href: `/projects/${uuid}` },
    ...(phaseuuid
       ? [{ key: "monitoring", label: "Monitoring", href: `/projects/${uuid}/${phaseuuid}/monitoring` }]
       : []
      ),
    ...(thirdTab ? [thirdTab] : []), 
    { key: "report",     label: "Report",       href: `/projects/${uuid}/report` },
  ];

  // determine which tab is active
  let activeKey = "info";
  if (pathname.includes("/monitoring"))   activeKey = "monitoring";
  else if (pathname.includes(`/${thirdTab?.key}`)) activeKey = thirdTab.key;
  else if (pathname.includes("/report")) activeKey = "report";

  return (
    <>
      <Navbar />
      <ProjectNavbar items={tabs} activeKey={activeKey} />
      {children}
    </>
  );
}
