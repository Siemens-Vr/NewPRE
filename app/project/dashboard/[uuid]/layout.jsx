// File: app/project/dashboard/[uuid]/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import api from '@/app/lib/utils/axios';
import ProjectNavbar from '@/app/components/project/navbar/navbar';

export default function ProjectLayout({ children }) {
  const { uuid } = useParams();
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  // segments: ['projects', '{uuid}', ...]
  // Extract raw third segment (could be phaseuuid or 'monitoring'/'report')
  const rawSegment = segments[2] || '';
  // Only treat it as a phase UUID if we're not on monitoring or report
  const phaseuuid =
    rawSegment && !rawSegment.includes('monitoring') && !rawSegment.includes('report')
      ? rawSegment
      : '';

  const [projectType, setProjectType] = useState(null);

  // Fetch the project type once we have the uuid
  useEffect(() => {
    if (!uuid) return;
    api.get(`/projects/${uuid}`)
       .then(res => setProjectType(res.data.type))
       .catch(console.error);
  }, [uuid]);

    // Only show type-based tab on the raw phase detail page (not on info, monitoring, or report)
  const isPhaseView = Boolean(phaseuuid) && projectType;

  const typeTab =
    isPhaseView && projectType
      ? {
          key: projectType.replace(/\s+/g, '').toLowerCase(),
          label: projectType,
          href: `/projects/${uuid}/${phaseuuid}`,
        }
      : null;

  const tabs = [
    { key: 'info', label: 'Project Info', href: `/projects/${uuid}` },
    { key: 'monitoring', label: 'Monitoring', href: `/projects/${uuid}/monitoring` },
    ...(typeTab ? [typeTab] : []),
    { key: 'report', label: 'Report', href: `/projects/${uuid}/report` },
     { key: 'personnel', label: 'Personnel', href: `/projects/${uuid}/personnel` },
  ];

  let activeKey = 'info';
  if (pathname.includes('/monitoring')) {
    activeKey = 'monitoring';
  } else if (typeTab && pathname.includes(`/${typeTab.key}`)) {
    activeKey = typeTab.key;
  } else if (pathname.includes('/report')) {
    activeKey = 'report';
  }

  return (
    <>
      <ProjectNavbar items={tabs} activeKey={activeKey} />
      {children}
    </>
  );
}
