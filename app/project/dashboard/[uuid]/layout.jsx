"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import api from "@/app/lib/utils/axios";
import Navbar from "@/app/components/navbar/navbar";
import ProjectNavbar from "@/app/components/project/navbar/navbar";

export default function ProjectLayout({ children }) {
  const { uuid } = useParams();
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);
  const phaseuuid = segments[2] || "";

  const [projectType, setProjectType] = useState(null);

  // Fetch the project type once we have the uuid
  useEffect(() => {
    if (!uuid) return;
    api.get(`/projects/${uuid}`)
       .then(res => setProjectType(res.data.type))
       .catch(console.error);
  }, [uuid]);

  // Build the conditional “type” tab (Milestones / Work Package / Duration Years)
  const typeTab = phaseuuid && projectType
    ? {
        key: projectType.replace(/\s+/g, "").toLowerCase(),
        label: projectType,
        href: `/projects/${uuid}/${phaseuuid}`,
      }
    : null;

  // Always show Info, Monitoring, Report
  const tabs = [
    {
      key: "info",
      label: "Project Info",
      href: `/projects/${uuid}`,
    },
    {
      key: "monitoring",
      label: "Monitoring",
      href: `/projects/${uuid}/monitoring`,
    },
    // Inject the type‐based tab only when we have a phaseuuid
    ...(typeTab ? [typeTab] : []),
    {
      key: "report",
      label: "Report",
      href: `/projects/${uuid}/report`,
    },
  ];

  // Determine which tab is active
  let activeKey = "info";
  if (pathname.includes("/monitoring")) {
    activeKey = "monitoring";
  } else if (typeTab && pathname.includes(`/${typeTab.key}`)) {
    activeKey = typeTab.key;
  } else if (pathname.includes("/report")) {
    activeKey = "report";
  }

  return (
    <>
      {/* <Navbar /> */}
      <ProjectNavbar items={tabs} activeKey={activeKey} />
      {children}
    </>
  );
}
